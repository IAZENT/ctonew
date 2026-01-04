export const FeatureGridBlock = {
  slug: 'featureGrid',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'features',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'icon', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
} as const
