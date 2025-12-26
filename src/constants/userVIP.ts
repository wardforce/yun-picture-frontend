// 用户角色枚举类型
export type UserRoleEnumType = {
  readonly text: string
  readonly value: string
}

// 用户角色枚举
export const UserRoleEnum = {
  STANDARD: {
    text: '标准',
    value: 'standard',
  },
  PRO: {
    text: '专业版',
    value: 'pro',
  },
  MAX: {
    text: '企业版',
    value: 'max',
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
