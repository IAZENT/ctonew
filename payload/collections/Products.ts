import { ensureSlugFromField } from '../hooks/slug'
import { auditAfterChange } from '../hooks/audit'
import { hasRoleOrAbove } from '../access/roles'

export const Products = {
  slug: 'products',
  admin: {
    useAsTitle: 'productName',
    defaultColumns: ['productName', 'modelNumber', 'category', 'status', 'featured'],
  },
  access: {
    read: ({ req }: any) => {
      const role = req.user?.role
      if (role && ['super-admin', 'admin', 'editor', 'contributor'].includes(role)) return true
      return {
        status: {
          equals: 'published',
        },
      }
    },
    create: hasRoleOrAbove('contributor'),
    update: hasRoleOrAbove('contributor'),
    delete: hasRoleOrAbove('admin'),
  },
  hooks: {
    beforeChange: [ensureSlugFromField('modelNumber')],
    afterChange: [auditAfterChange('products')],
  },
  fields: [
    {
      name: 'productName',
      type: 'text',
      required: true,
    },
    {
      name: 'modelNumber',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      index: true,
    },
    {
      name: 'coolingCapacity',
      type: 'number',
      label: 'Cooling Capacity (BTU/h)',
    },
    {
      name: 'coverageArea',
      type: 'number',
      label: 'Coverage Area (sq ft)',
    },
    {
      name: 'energyRating',
      type: 'number',
      label: 'Energy Rating (stars)',
      index: true,
    },
    {
      name: 'powerConsumption',
      type: 'number',
      label: 'Power Consumption (W)',
    },
    {
      name: 'noiseLevel',
      type: 'number',
      label: 'Noise Level (dB)',
    },
    {
      name: 'refrigerantType',
      type: 'text',
    },
    {
      name: 'dimensions',
      type: 'text',
      label: 'Dimensions (L×W×H)',
    },
    {
      name: 'weight',
      type: 'number',
      label: 'Weight (kg)',
    },
    {
      name: 'voltage',
      type: 'number',
      label: 'Voltage (V)',
    },
    {
      name: 'frequency',
      type: 'number',
      label: 'Frequency (Hz)',
    },
    {
      name: 'warranty',
      type: 'text',
    },
    {
      name: 'additionalFeatures',
      type: 'textarea',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'primaryImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'videos',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'resources',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    {
      name: 'customSpecs',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'metaTitle',
      type: 'text',
    },
    {
      name: 'metaDescription',
      type: 'textarea',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'seoKeywords',
      type: 'text',
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
  ],
} as const
