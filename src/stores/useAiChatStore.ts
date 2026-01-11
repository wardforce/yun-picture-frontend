import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateAiImage } from '@/api/aiPictureGeneratorController'
import { listMySession, getSessionDetail, deleteBySession, deleteById } from '@/api/chatHistoryController'
import { getPictureVoById } from '@/api/pictureController'

// ViewModel类型定义
export interface ChatMessageVM {
  id: number
  content: string
  placement: 'start' | 'end' // start=AI左侧, end=用户右侧
  type: 'user' | 'ai'
  createTime: string
  pictures: {
    id: number
    pictureId: number
    url: string
    thumbnailUrl: string
    type: string // 'input' | 'output'
    sortOrder: number
  }[]
}

export interface MessagePagination {
  current: number
  pageSize: number
  total: number
  hasMore: boolean
}

const STORAGE_KEY = 'ai_chat_session_id'

export const useAiChatStore = defineStore('aiChat', () => {
  // === State ===
  const currentSessionId = ref<string | null>(null)

  // spaceId拆分：职责分离
  const createSpaceId = ref<number | null>(null) // 用于创建图片时传给后端
  const currentSessionSpaceId = ref<number | null>(null) // 当前会话的spaceId（从后端数据读取）

  const sessionList = ref<API.ChatHistorySessionVO[]>([])
  const messages = ref<ChatMessageVM[]>([])
  const messagePagination = ref<MessagePagination>({
    current: 1,
    pageSize: 20,
    total: 0,
    hasMore: false,
  })

  const pendingPictures = ref<API.PictureVO[]>([])

  const isGenerating = ref(false)
  const isLoadingMessages = ref(false)
  const isLoadingSessionList = ref(false)

  // === Computed ===
  const isInSpaceMode = computed(() => currentSessionSpaceId.value !== null)

  // === Actions ===

  // 从路由参数初始化
  async function initFromRoute(params: {
    sessionId?: string
    pictureId?: number
    spaceId?: number
  }) {
    // 设置创建图片用的spaceId（仅从路由传入时设置）
    if (params.spaceId) {
      createSpaceId.value = params.spaceId
    }

    if (params.sessionId) {
      // 加载历史对话（会从后端数据中提取spaceId）
      await loadSessionDetail(params.sessionId)
    } else if (params.pictureId) {
      // 从图片详情页跳转，加载图片
      await loadPictureById(params.pictureId)
    } else {
      // 新建对话，尝试恢复上次会话
      const savedSessionId = loadSessionIdFromStorage()
      if (savedSessionId) {
        await loadSessionDetail(savedSessionId)
      } else {
        // 完全新建对话，清空会话的spaceId
        currentSessionSpaceId.value = null
      }
    }

    // 加载会话列表（不过滤spaceId）
    await loadSessionList()
  }

  // 加载会话列表（永远显示全部会话，不过滤spaceId）
  async function loadSessionList() {
    isLoadingSessionList.value = true
    try {
      const res = await listMySession({
        current: 1,
        pageSize: 50,
        sortField: 'firstChatTime',
        sortOrder: 'desc',
        // ❌ 移除spaceId过滤，显示所有会话
      })

      if (res.data.code === 0 && res.data.data) {
        sessionList.value = res.data.data.records || []
      }
    } catch (error) {
      console.error('加载会话列表失败:', error)
    } finally {
      isLoadingSessionList.value = false
    }
  }

  // 加载会话详情
  async function loadSessionDetail(sessionId: string, page = 1) {
    isLoadingMessages.value = true
    try {
      const res = await getSessionDetail({
        sessionId,
        current: page,
        pageSize: 20,
        sortField: 'createTime',
        sortOrder: 'asc',
      })

      if (res.data.code === 0 && res.data.data) {
        const records = res.data.data.records || []
        const vms = await Promise.all(records.map(transformToVM))

        if (page === 1) {
          messages.value = vms
          currentSessionId.value = sessionId
          persistSessionId()

          // ✅ 从第一条记录中提取当前会话的spaceId
          if (records.length > 0 && records[0].spaceId) {
            currentSessionSpaceId.value = records[0].spaceId
          } else {
            currentSessionSpaceId.value = null
          }
        } else {
          messages.value = [...vms, ...messages.value]
        }

        const totalPages = Math.ceil((res.data.data.total || 0) / 20)
        messagePagination.value = {
          current: page,
          pageSize: 20,
          total: res.data.data.total || 0,
          hasMore: page < totalPages,
        }
      }
    } catch (error) {
      console.error('加载会话详情失败:', error)
    } finally {
      isLoadingMessages.value = false
    }
  }

  // 通过pictureId加载图片到待发送区
  async function loadPictureById(pictureId: number) {
    try {
      const res = await getPictureVoById({ id: pictureId })
      if (res.data.code === 0 && res.data.data) {
        addPendingPicture(res.data.data)
      }
    } catch (error) {
      console.error('加载图片失败:', error)
    }
  }

  // 发送消息
  async function sendMessage(prompt: string) {
    if (!prompt.trim() && pendingPictures.value.length === 0) return

    isGenerating.value = true

    // 添加用户消息到UI（乐观更新）
    const userMessage: ChatMessageVM = {
      id: Date.now(),
      content: prompt,
      placement: 'end',
      type: 'user',
      createTime: new Date().toISOString(),
      pictures: pendingPictures.value.map((pic, index) => ({
        id: pic.id || 0,
        pictureId: pic.id || 0,
        url: pic.url || '',
        thumbnailUrl: pic.thumbnailUrl || '',
        type: 'input',
        sortOrder: index,
      })),
    }
    messages.value.push(userMessage)

    try {
      const pictureIds = pendingPictures.value
        .map((p) => p.id)
        .filter((id): id is number => id !== undefined)

      const res = await generateAiImage({
        prompt,
        pictureIds,
        sessionId: currentSessionId.value ?? undefined,
        spaceId: createSpaceId.value ?? undefined, // ✅ 使用创建用的spaceId
      })

      if (res.data.code === 0 && res.data.data) {
        const { chatHistory, pictureVOs, aiText } = res.data.data

        // 保存sessionId和spaceId
        if (chatHistory?.sessionId) {
          currentSessionId.value = chatHistory.sessionId
          persistSessionId()

          // ✅ 更新当前会话的spaceId（从后端返回的数据中读取）
          if (chatHistory.spaceId) {
            currentSessionSpaceId.value = chatHistory.spaceId
          }
        }

        // 添加AI响应消息
        const aiMessage: ChatMessageVM = {
          id: chatHistory?.id || Date.now() + 1,
          content: aiText || '',
          placement: 'start',
          type: 'ai',
          createTime: new Date().toISOString(),
          pictures:
            pictureVOs?.map((pic, index) => ({
              id: pic.id || 0,
              pictureId: pic.id || 0,
              url: pic.url || '',
              thumbnailUrl: pic.thumbnailUrl || '',
              type: 'output',
              sortOrder: index,
            })) || [],
        }
        messages.value.push(aiMessage)

        // 清空待发送图片
        pendingPictures.value = []

        // 刷新会话列表
        await loadSessionList()
      }
    } catch (error) {
      console.error('发送消息失败:', error)
      // 移除乐观更新的用户消息
      messages.value.pop()
    } finally {
      isGenerating.value = false
    }
  }

  // 删除会话
  async function deleteSession(sessionId: string) {
    try {
      const res = await deleteBySession({ sessionId })
      if (res.data.code === 0) {
        sessionList.value = sessionList.value.filter((s) => s.sessionId !== sessionId)

        // 如果删除的是当前会话，清空消息
        if (currentSessionId.value === sessionId) {
          currentSessionId.value = null
          messages.value = []
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    } catch (error) {
      console.error('删除会话失败:', error)
    }
  }

  // 删除单条消息
  async function deleteMessage(id: number) {
    try {
      const res = await deleteById({ id })
      if (res.data.code === 0 && currentSessionId.value) {
        await loadSessionDetail(currentSessionId.value)
      }
    } catch (error) {
      console.error('删除消息失败:', error)
    }
  }

  // 新建对话
  function newConversation() {
    currentSessionId.value = null
    currentSessionSpaceId.value = null // ✅ 清空会话spaceId
    // createSpaceId保持不变，如果来自空间详情页，仍然可以创建到该空间
    messages.value = []
    pendingPictures.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  // 添加待发送图片
  function addPendingPicture(picture: API.PictureVO) {
    if (!pendingPictures.value.find((p) => p.id === picture.id)) {
      pendingPictures.value.push(picture)
    }
  }

  // 移除待发送图片
  function removePendingPicture(pictureId: number) {
    pendingPictures.value = pendingPictures.value.filter((p) => p.id !== pictureId)
  }

  // === Helper Functions ===

  // 图片URL缓存（避免重复查询老数据）
  const pictureUrlCache = new Map<number, { url: string; thumbnailUrl: string }>()

  // 解析图片URL（仅用于老数据降级）
  async function resolvePictureUrl(
    pictureId: number,
  ): Promise<{ url: string; thumbnailUrl: string }> {
    // 先检查缓存
    if (pictureUrlCache.has(pictureId)) {
      return pictureUrlCache.get(pictureId)!
    }

    try {
      const res = await getPictureVoById({ id: pictureId })
      if (res.data.code === 0 && res.data.data) {
        const result = {
          url: res.data.data.url || '',
          thumbnailUrl: res.data.data.thumbnailUrl || '',
        }
        pictureUrlCache.set(pictureId, result)
        return result
      }
    } catch (error) {
      console.error('查询老数据图片URL失败:', error)
    }

    // 失败也缓存，避免重复请求
    const emptyResult = { url: '', thumbnailUrl: '' }
    pictureUrlCache.set(pictureId, emptyResult)
    return emptyResult
  }

  // 将后端数据转换为ViewModel（混合方案：新数据直接用，老数据查询）
  async function transformToVM(detail: API.ChatHistoryDetailVO): Promise<ChatMessageVM> {
    const pictures: ChatMessageVM['pictures'] = []

    if (detail.pictures && detail.pictures.length > 0) {
      const sortedPictures = [...detail.pictures].sort(
        (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
      )

      for (const pic of sortedPictures) {
        // ✅ 优先使用新数据（picture对象）
        if (pic.picture) {
          pictures.push({
            id: pic.picture.id || 0,
            pictureId: pic.picture.id || 0,
            url: pic.picture.url || '',
            thumbnailUrl: pic.picture.thumbnailUrl || '',
            type: pic.pictureType || 'output',
            sortOrder: pic.sortOrder || 0,
          })
        }
        // ⚠️ 降级：老数据可能只有pictureId（类型定义中没有，但实际数据可能存在）
        else if ((pic as any).pictureId) {
          const legacyPictureId = (pic as any).pictureId as number
          const { url, thumbnailUrl } = await resolvePictureUrl(legacyPictureId)
          pictures.push({
            id: (pic as any).id || 0,
            pictureId: legacyPictureId,
            url,
            thumbnailUrl,
            type: pic.pictureType || 'output',
            sortOrder: pic.sortOrder || 0,
          })
        }
      }
    }
    // 兼容更老的数据结构（直接在detail上的pictureId）
    // else if (detail.pictureId) {
    //   const { url, thumbnailUrl } = await resolvePictureUrl(detail.pictureId)
    //   pictures.push({
    //     id: 0,
    //     pictureId: detail.pictureId,
    //     url,
    //     thumbnailUrl,
    //     type: 'output',
    //     sortOrder: 0,
    //   })
    // }
    //删除这行的原因是为了能够更好的做到加载。
    return {
      id: detail.id || 0,
      content: detail.message || '',
      placement: detail.messageType === 'user' ? 'end' : 'start',
      type: (detail.messageType as 'user' | 'ai') || 'ai',
      createTime: detail.createTime || '',
      pictures,
    }
  }

  // 持久化sessionId
  function persistSessionId() {
    if (currentSessionId.value) {
      localStorage.setItem(STORAGE_KEY, String(currentSessionId.value))
    }
  }

  // 从Storage加载sessionId
  function loadSessionIdFromStorage(): string | null {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved || null
  }

  return {
    // State
    currentSessionId,
    createSpaceId, // ✅ 用于创建图片
    currentSessionSpaceId, // ✅ 当前会话的spaceId（UI显示用）
    sessionList,
    messages,
    messagePagination,
    pendingPictures,
    isGenerating,
    isLoadingMessages,
    isLoadingSessionList,

    // Computed
    isInSpaceMode,

    // Actions
    initFromRoute,
    loadSessionList,
    loadSessionDetail,
    loadPictureById,
    sendMessage,
    deleteSession,
    deleteMessage,
    newConversation,
    addPendingPicture,
    removePendingPicture,
  }
})
