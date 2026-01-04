export const StatsCounterBlock = {
  slug: 'statsCounter',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'number', required: true },
        { name: 'suffix', type: 'text' },
      ],
    },
  ],
} as const
