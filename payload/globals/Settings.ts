import { hasRoleOrAbove } from '../access/roles'

export const Settings = {
  slug: 'settings',
  access: {
    read: () => true,
    update: hasRoleOrAbove('admin'),
  },
  fields: [
    { name: 'siteName', type: 'text', required: true, defaultValue: 'Aircon' },
    { name: 'tagline', type: 'text', defaultValue: 'Premium Air Conditioning' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'theme',
      type: 'group',
      fields: [
        { name: 'coolBlue', type: 'text', defaultValue: '#0066CC' },
        { name: 'arcticSilver', type: 'text', defaultValue: '#E8F1F5' },
        { name: 'iceBlue', type: 'text', defaultValue: '#00A3E0' },
        { name: 'mintGreen', type: 'text', defaultValue: '#10B981' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
        { name: 'address', type: 'textarea' },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      fields: [
        { name: 'googleAnalyticsId', type: 'text' },
        { name: 'gtmId', type: 'text' },
      ],
    },
  ],
} as const
