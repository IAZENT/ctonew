import { ensureSlugFromField } from '../hooks/slug'
import { auditAfterChange } from '../hooks/audit'
import { hasRoleOrAbove } from '../access/roles'

export const Categories = {
  slug: 'categories',
  admin: {
    useAsTitle: 'categoryName',
    defaultColumns: ['categoryName', 'slug', 'displayOrder'],
  },
  access: {
    read: () => true,
    create: hasRoleOrAbove('editor'),
    update: hasRoleOrAbove('editor'),
    delete: hasRoleOrAbove('admin'),
  },
  hooks: {
    beforeChange: [ensureSlugFromField('categoryName')],
    afterChange: [auditAfterChange('categories')],
  },
  fields: [
    {
      name: 'categoryName',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'parentCategory',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'categoryImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'icon',
      type: 'text',
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      index: true,
    },
    {
      name: 'metaTitle',
      type: 'text',
    },
    {
      name: 'metaDescription',
      type: 'textarea',
    },
  ],
} as const
