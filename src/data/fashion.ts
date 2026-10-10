// TODO: Restore the Birka flavor and Fashion Items category later using these saved lists.
// Intentionally kept for that planned feature; currently unused by the generator.

export const fashionAttributes = ['sexy', 'warm', 'cool', 'elegant', 'lively', 'cute'] as const

// One shared pool; the original odd/even grouping does not affect selection.
export const fashionTags = [
  'Adventure', 'Animal', 'Army', 'Bath', 'Casual', 'Classic', 'Dancer', 'Demonic',
  'Elven', 'Fantasy', 'Formal', 'Gothic', 'Gunman', 'Homey', 'Imperial', 'Legend',
  'Lolita', 'Musician', 'Outdoor', 'Pastoral', 'Pilot', 'Preppy', 'Punk', 'Retro',
  'Rock & Roll', 'Romantic', 'Simple', 'Sport', 'Street', 'Swimsuit', 'Trendy',
  'Unisex', 'Whimsy', 'Vintage', 'Witch', 'Workwear',
  'Agent', 'Apron', 'Autumn', 'Bohemia', 'Chic', 'Cyberpunk', 'Dark', 'Divine',
  'Fairytale', 'Floral', 'Galactic', 'Girl Group', 'Glam', 'Gown', 'Holiday',
  'Hot Girl', 'Ladylike', 'Light', 'Mori', 'Neon', 'Nostalgia', 'Outback',
  'Paramedic', 'Playful', 'Princess', 'Rain', 'Robot', 'Royal', 'Sailor', 'Spirit',
  'Spring', 'Summer', 'Swordsman', 'Uniform', 'Wedding', 'Winter',
] as const

// Select a main slot first, then one item name within it; paired clothing stays plural.
export const fashionSlots = [
  { slot: 'Accessories', items: [
    'Bracelet', 'Earring', 'Exotic Accessory', 'Face Accessory', 'Gloves',
    'Hair Accessory', 'Hat', 'Necklace', 'Ring',
  ] },
  { slot: 'Bags', items: ['Bag'] },
  { slot: 'Bottoms', items: ['Bottoms'] },
  { slot: 'Coats', items: ['Coat'] },
  { slot: 'Dresses/Overalls', items: ['Dress', 'Overalls'] },
  { slot: 'Handheld', items: ['Handheld Item'] },
  { slot: 'Socks', items: ['Socks'] },
  { slot: 'Shoes', items: ['Shoes'] },
  { slot: 'Tops', items: ['Top'] },
] as const

export const fashionTiers = ['SSS', 'SS', 'S', 'A', 'B', 'C', 'D'] as const
