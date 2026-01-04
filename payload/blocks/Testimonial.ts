export const TestimonialBlock = {
  slug: 'testimonial',
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'author', type: 'text', required: true },
    { name: 'authorTitle', type: 'text' },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
  ],
} as const
