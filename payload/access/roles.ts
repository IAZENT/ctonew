export type AirconRole = 'super-admin' | 'admin' | 'editor' | 'contributor' | 'viewer'

const roleRank: Record<AirconRole, number> = {
  'super-admin': 4,
  admin: 3,
  editor: 2,
  contributor: 1,
  viewer: 0,
}

export function isRoleOrAbove(userRole: AirconRole, requiredRole: AirconRole) {
  return roleRank[userRole] >= roleRank[requiredRole]
}

export const isLoggedIn = ({ req }: any) => Boolean(req.user)

export function hasRoleOrAbove(requiredRole: AirconRole) {
  return ({ req }: any) => {
    const role = req.user?.role as AirconRole | undefined
    if (!role) return false
    return isRoleOrAbove(role, requiredRole)
  }
}

export const isSuperAdmin = ({ req }: any) => req.user?.role === 'super-admin'

export function allowSelfOrRoleOrAbove(requiredRole: AirconRole) {
  return ({ req, id }: any) => {
    const role = req.user?.role as AirconRole | undefined
    if (!role) return false

    if (req.user?.id && id && req.user.id === id) return true
    return isRoleOrAbove(role, requiredRole)
  }
}
