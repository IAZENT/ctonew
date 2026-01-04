import { auditAfterChange } from '../hooks/audit'
import { allowSelfOrRoleOrAbove, hasRoleOrAbove, isSuperAdmin } from '../access/roles'

function validatePassword(password: string) {
  if (password.length < 12) throw new Error('Password must be at least 12 characters long')
  if (!/[a-z]/.test(password)) throw new Error('Password must include a lowercase letter')
  if (!/[A-Z]/.test(password)) throw new Error('Password must include an uppercase letter')
  if (!/[0-9]/.test(password)) throw new Error('Password must include a number')
  if (!/[^A-Za-z0-9]/.test(password)) throw new Error('Password must include a symbol')
}

export const Users = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'firstName', 'lastName'],
  },
  access: {
    create: hasRoleOrAbove('admin'),
    read: ({ req, id }: any) => {
      if (!req.user) return false
      if (req.user.role && ['super-admin', 'admin', 'editor'].includes(req.user.role)) return true
      return req.user.id === id
    },
    update: allowSelfOrRoleOrAbove('admin'),
    delete: isSuperAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation }: any) => {
        if (!data) return data
        const password = data.password as string | undefined

        if (operation === 'create' && password) validatePassword(password)
        if (operation === 'update' && typeof password === 'string') validatePassword(password)

        return data
      },
    ],
    afterChange: [auditAfterChange('users')],
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'viewer',
      index: true,
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Contributor', value: 'contributor' },
        { label: 'Viewer', value: 'viewer' },
      ],
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'twoFactorEnabled',
      type: 'checkbox',
      defaultValue: false,
      access: {
        read: ({ req, id }: any) => Boolean(req.user) && (req.user.id === id || req.user.role === 'super-admin'),
        update: ({ req, id }: any) => Boolean(req.user) && (req.user.id === id || req.user.role === 'super-admin'),
      },
    },
    {
      name: 'twoFactorSecret',
      type: 'text',
      access: {
        read: () => false,
        update: ({ req, id }: any) => Boolean(req.user) && (req.user.id === id || req.user.role === 'super-admin'),
      },
    },
  ],
} as const
