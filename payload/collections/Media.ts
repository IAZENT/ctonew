export const Media = {
  slug: 'media',
  upload: {
    staticDir: 'public/media',
    staticURL: '/media',
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
} as const
