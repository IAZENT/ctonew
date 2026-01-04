import { ensureSlugFromField } from '../hooks/slug'
import { auditAfterChange } from '../hooks/audit'
import { hasRoleOrAbove } from '../access/roles'
import {
  CTABannerBlock,
  FeatureGridBlock,
  HeroBlock,
  ImageGalleryBlock,
  StatsCounterBlock,
  TestimonialBlock,
  TextBlock,
  VideoEmbedBlock,
} from '../blocks'

export const Pages = {
  slug: 'pages',
  admin: {
    useAsTitle: 'pageTitle',
    defaultColumns: ['pageTitle', 'slug', 'status', 'template'],
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
    create: hasRoleOrAbove('editor'),
    update: hasRoleOrAbove('editor'),
    delete: hasRoleOrAbove('admin'),
  },
  hooks: {
    beforeChange: [ensureSlugFromField('pageTitle')],
    afterChange: [auditAfterChange('pages')],
  },
  fields: [
    { name: 'pageTitle', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'template',
      type: 'select',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Landing', value: 'landing' },
        { label: 'Product', value: 'product' },
      ],
      defaultValue: 'default',
    },
    {
      name: 'content',
      type: 'blocks',
      blocks: [
        HeroBlock,
        TextBlock,
        ImageGalleryBlock,
        FeatureGridBlock,
        TestimonialBlock,
        StatsCounterBlock,
        VideoEmbedBlock,
        CTABannerBlock,
      ] as any,
    },
    { name: 'metaTitle', type: 'text' },
    { name: 'metaDescription', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      required: true,
      index: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    { name: 'publishedAt', type: 'date' },
  ],
} as const
