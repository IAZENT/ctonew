import { auditAfterChange } from '../hooks/audit'
import { hasRoleOrAbove } from '../access/roles'

export const FormSubmissions = {
  slug: 'formSubmissions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['formType', 'name', 'email', 'status', 'submittedAt'],
  },
  access: {
    create: () => true,
    read: hasRoleOrAbove('editor'),
    update: hasRoleOrAbove('editor'),
    delete: hasRoleOrAbove('admin'),
  },
  hooks: {
    afterChange: [auditAfterChange('formSubmissions')],
  },
  fields: [
    {
      name: 'formType',
      type: 'text',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      index: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'In progress', value: 'in_progress' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Spam', value: 'spam' },
      ],
    },
    {
      name: 'submittedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
    },
  ],
} as const
