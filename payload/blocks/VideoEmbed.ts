export const VideoEmbedBlock = {
  slug: 'videoEmbed',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'url',
      type: 'text',
      required: true,
    },
  ],
} as const
