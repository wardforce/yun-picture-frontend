// 用户角色枚举类型
export type UserRoleEnumType = {
  readonly text: string
  readonly value: string
}

// 用户角色枚举
export const UserRoleEnum = {
  USER: {
    text: '普通用户',
    value: 'user',
  },
  ADMIN: {
    text: '管理员',
    value: 'admin',
  },
  VIP: {
    text: 'VIP用户',
    value: 'vip',
  },
} as const satisfies Record<string, UserRoleEnumType>

/**
 * 根据 value 获取枚举
 *
 * @param value 枚举值的value
 * @return 枚举值，如果未找到则返回 null
 */
export function getUserEnumByValue(value: string | null | undefined): UserRoleEnumType | null {
  if (!value) {
    return null
  }
  for (const enumValue of Object.values(UserRoleEnum)) {
    if (enumValue.value === value) {
      return enumValue
    }
  }
  return null
}
