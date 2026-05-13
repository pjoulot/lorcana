// Inkfolk — mock card data
// Names reference the real card game (necessary for a card-search site).
// Stats are illustrative — for visual fidelity in the mockups only.

// Only cards with real licensed art. Mockups repeat from this small pool
// rather than fall back to fake CSS placeholders.
const _ALL_CARDS = [
  { id: 'tod-playful-kit', name: 'Tod', subtitle: 'Playful Kit', ink: 'amber', cost: 4, type: 'Character', rarity: 'rare', strength: 2, willpower: 4, lore: 2, set: 'TFC', cls: ['Storyborn','Hero'], seed: 30, illustrator: 'Malia Ewart', image: 'assets/cards/tod-playful-kit.avif' },
  { id: 'pocahontas-peacekeeper', name: 'Pocahontas', subtitle: 'Peacekeeper', ink: 'amber', cost: 5, type: 'Character', rarity: 'super', strength: 3, willpower: 6, lore: 2, set: 'TFC', cls: ['Floodborn','Hero','Princess'], seed: 31, illustrator: 'Alice Pisoni', image: 'assets/cards/pocahontas-peacekeeper.avif' },
  { id: 'elsa-snow-queen', name: 'Elsa', subtitle: 'Snow Queen', ink: 'amethyst', cost: 3, type: 'Character', rarity: 'rare', strength: 2, willpower: 3, lore: 2, set: 'TFC', cls: ['Dreamborn','Hero','Queen','Sorcerer'], seed: 1, illustrator: 'Nicholas Kole', image: 'assets/cards/elsa-snow-queen.avif' },
  { id: 'mickey-brave-tailor', name: 'Mickey Mouse', subtitle: 'Brave Little Tailor', ink: 'ruby', cost: 8, type: 'Character', rarity: 'legendary', strength: 5, willpower: 5, lore: 3, set: 'TFC', cls: ['Hero','Knight'], seed: 0, illustrator: 'Matthew Oxley' },
  { id: 'elsa-spirit-of-winter', name: 'Elsa', subtitle: 'Spirit of Winter', ink: 'amethyst', cost: 8, type: 'Character', rarity: 'legendary', strength: 4, willpower: 6, lore: 2, set: 'TFC', cls: ['Hero','Queen','Sorcerer'], seed: 1 },
  { id: 'be-prepared', name: 'Be Prepared', ink: 'ruby', cost: 7, type: 'Song', rarity: 'rare', set: 'TFC', seed: 2 },
  { id: 'friends-other-side', name: 'Friends on the Other Side', ink: 'amethyst', cost: 4, type: 'Song', rarity: 'super', set: 'TFC', seed: 3 },
  { id: 'stitch-new-dog', name: 'Stitch', subtitle: 'New Dog', ink: 'sapphire', cost: 5, type: 'Character', rarity: 'rare', strength: 4, willpower: 4, lore: 2, set: 'TFC', cls: ['Hero','Alien'], seed: 4 },
  { id: 'sword-in-stone', name: 'The Sword in the Stone', ink: 'steel', cost: 3, type: 'Item', rarity: 'common', set: 'TFC', seed: 5 },
  { id: 'belle-strange-special', name: 'Belle', subtitle: 'Strange but Special', ink: 'sapphire', cost: 4, type: 'Character', rarity: 'rare', strength: 2, willpower: 4, lore: 1, set: 'TFC', cls: ['Storyborn','Hero','Princess'], seed: 6, illustrator: 'Alice Pisoni', image: 'assets/cards/belle-strange-special.avif' },
  { id: 'beast-hardheaded', name: 'Beast', subtitle: 'Hardheaded', ink: 'ruby', cost: 5, type: 'Character', rarity: 'super', strength: 4, willpower: 5, lore: 1, set: 'TFC', cls: ['Hero','Prince'], seed: 7 },
  { id: 'maui-hero-to-all', name: 'Maui', subtitle: 'Hero to All', ink: 'amber', cost: 6, type: 'Character', rarity: 'legendary', strength: 4, willpower: 5, lore: 2, set: 'RFB', cls: ['Hero','Deity'], seed: 8 },
  { id: 'rapunzel-gifted-with-healing', name: 'Rapunzel', subtitle: 'Gifted with Healing', ink: 'amber', cost: 3, type: 'Character', rarity: 'rare', strength: 2, willpower: 3, lore: 2, set: 'TFC', cls: ['Hero','Princess'], seed: 9 },
  { id: 'tinker-bell-tiny-tactician', name: 'Tinker Bell', subtitle: 'Tiny Tactician', ink: 'emerald', cost: 4, type: 'Character', rarity: 'rare', strength: 1, willpower: 3, lore: 2, set: 'RFB', cls: ['Hero','Ally','Fairy'], seed: 10 },
  { id: 'simba-future-king', name: 'Simba', subtitle: 'Future King', ink: 'amber', cost: 2, type: 'Character', rarity: 'common', strength: 1, willpower: 3, lore: 1, set: 'TFC', cls: ['Hero','Prince'], seed: 11 },
  { id: 'mufasa-respected-king', name: 'Mufasa', subtitle: 'Respected King', ink: 'amber', cost: 6, type: 'Character', rarity: 'legendary', strength: 5, willpower: 5, lore: 2, set: 'TFC', cls: ['Hero','King'], seed: 12 },
  { id: 'ursula-deceiver', name: 'Ursula', subtitle: 'Deceiver of All', ink: 'amethyst', cost: 10, type: 'Character', rarity: 'legendary', strength: 8, willpower: 9, lore: 4, set: 'IIH', cls: ['Villain','Sorcerer'], seed: 13 },
  { id: 'cinderella-stouthearted', name: 'Cinderella', subtitle: 'Stouthearted', ink: 'steel', cost: 2, type: 'Character', rarity: 'uncommon', strength: 2, willpower: 2, lore: 1, set: 'TFC', cls: ['Hero','Princess'], seed: 14 },
  { id: 'aurora-dreaming-guardian', name: 'Aurora', subtitle: 'Dreaming Guardian', ink: 'sapphire', cost: 5, type: 'Character', rarity: 'rare', strength: 3, willpower: 5, lore: 1, set: 'IIH', cls: ['Hero','Princess'], seed: 15 },
  { id: 'magic-broom-bucket-brigade', name: 'Magic Broom', subtitle: 'Bucket Brigade', ink: 'sapphire', cost: 1, type: 'Character', rarity: 'common', strength: 1, willpower: 1, lore: 1, set: 'TFC', cls: ['Ally','Broom'], seed: 16 },
  { id: 'a-whole-new-world', name: 'A Whole New World', ink: 'sapphire', cost: 5, type: 'Song', rarity: 'rare', set: 'TFC', seed: 17, illustrator: 'Koni', image: 'assets/cards/a-whole-new-world.avif' },
  { id: 'gantu-galactic-federation', name: 'Gantu', subtitle: 'Galactic Federation Captain', ink: 'steel', cost: 4, type: 'Character', rarity: 'uncommon', strength: 4, willpower: 4, lore: 1, set: 'RFB', cls: ['Villain','Alien'], seed: 18 },
  { id: 'go-go-go', name: 'Go, Go, Go!', ink: 'ruby', cost: 1, type: 'Action', rarity: 'common', set: 'IIH', seed: 19 },
  { id: 'snuggly-duckling-disreputable-pub', name: 'The Snuggly Duckling', subtitle: 'Disreputable Pub', ink: 'amber', cost: 3, type: 'Location', rarity: 'rare', willpower: 7, lore: 1, set: 'IIH', seed: 20 },
  { id: 'arendelle-castle', name: 'Arendelle Castle', subtitle: 'Royal Stronghold', ink: 'sapphire', cost: 3, type: 'Location', rarity: 'rare', willpower: 7, lore: 1, set: 'INK', seed: 21 },
  { id: 'merlin-shapeshifter', name: 'Merlin', subtitle: 'Shapeshifter', ink: 'emerald', cost: 5, type: 'Character', rarity: 'legendary', strength: 3, willpower: 4, lore: 2, set: 'RFB', cls: ['Hero','Sorcerer'], seed: 22 },
  { id: 'lefou-instigator', name: 'LeFou', subtitle: 'Instigator', ink: 'ruby', cost: 2, type: 'Character', rarity: 'common', strength: 2, willpower: 2, lore: 1, set: 'TFC', cls: ['Villain','Ally'], seed: 23 },
  { id: 'pluto-determined-defender', name: 'Pluto', subtitle: 'Determined Defender', ink: 'steel', cost: 4, type: 'Character', rarity: 'rare', strength: 3, willpower: 4, lore: 1, set: 'RFB', cls: ['Hero','Ally'], seed: 24 },
  { id: 'jafar-keeper-of-secrets', name: 'Jafar', subtitle: 'Keeper of Secrets', ink: 'amethyst', cost: 5, type: 'Character', rarity: 'enchanted', strength: 3, willpower: 5, lore: 2, set: 'IIH', cls: ['Villain','Sorcerer'], seed: 25 },
  { id: 'genie-on-the-job', name: 'Genie', subtitle: 'On the Job', ink: 'amethyst', cost: 2, type: 'Character', rarity: 'uncommon', strength: 2, willpower: 2, lore: 1, set: 'TFC', cls: ['Ally'], seed: 26 },
  { id: 'beast-tragic-hero', name: 'Beast', subtitle: 'Tragic Hero', ink: 'ruby', cost: 7, type: 'Character', rarity: 'legendary', strength: 5, willpower: 6, lore: 2, set: 'INK', cls: ['Hero','Prince','Floodborn'], seed: 27 },
  { id: 'aladdin-heroic-outlaw', name: 'Aladdin', subtitle: 'Heroic Outlaw', ink: 'emerald', cost: 5, type: 'Character', rarity: 'super', strength: 5, willpower: 4, lore: 2, set: 'TFC', cls: ['Hero'], seed: 28 },
  { id: 'kakamora', name: 'Kakamora', subtitle: 'Coconut Pirate', ink: 'ruby', cost: 1, type: 'Character', rarity: 'common', strength: 1, willpower: 2, lore: 1, set: 'RFB', cls: ['Villain','Pirate'], seed: 29 },
];

// Only show cards we actually have art for — no fake placeholders.
const CARDS_WITH_ART = _ALL_CARDS.filter(c => c.image);
const CARDS = CARDS_WITH_ART;

const SETS = [
  { code: 'TFC', name: 'The First Chapter',     date: 'Aug 2023', cards: 204, icon: '①' },
  { code: 'RFB', name: 'Rise of the Floodborn', date: 'Nov 2023', cards: 204, icon: '②' },
  { code: 'IIH', name: "Into the Inklands",     date: 'Mar 2024', cards: 204, icon: '③' },
  { code: 'URR', name: "Ursula's Return",       date: 'May 2024', cards: 204, icon: '④' },
  { code: 'SSK', name: "Shimmering Skies",      date: 'Aug 2024', cards: 204, icon: '⑤' },
  { code: 'AZS', name: "Azurite Sea",           date: 'Nov 2024', cards: 204, icon: '⑥' },
  { code: 'INK', name: "Reign of Jafar",        date: 'Mar 2025', cards: 204, icon: '⑦' },
];

const NEWS = [
  {
    id: 'azurite-sea-spoiler-roundup',
    cat: 'Set Spoilers',
    title: 'Azurite Sea: every card we know about so far',
    excerpt: "Ravensburger has unveiled the next big expansion, and it leans hard into seafaring stories. We round up the 38 cards revealed at Gen Con and what they tell us about where Lorcana is heading.",
    author: 'Margot Lemaire',
    date: '8 May',
    read: '12 min',
    lang: 'EN',
    cover: 'seafoam',
  },
  {
    id: 'paris-regional-recap',
    cat: 'Tournaments',
    title: 'Paris Regional report — the meta after Shimmering Skies',
    excerpt: "Sapphire/Steel control is having a moment, but Amber/Amethyst song decks held the Top 8. Our recap of every match, with deck lists.",
    author: 'Théo Reynaud',
    date: '4 May',
    read: '9 min',
    lang: 'FR',
    cover: 'rose',
  },
  {
    id: 'shift-ruling-clarification',
    cat: 'Rules',
    title: 'Shift, Bodyguard and the timing window — the latest ruling',
    excerpt: "A judges' bulletin this week clarifies an edge case that's been disputed since the first Floodborn cards. Here's what changed and why it matters at competitive REL.",
    author: 'Sam Ireton',
    date: '2 May',
    read: '6 min',
    lang: 'EN',
    cover: 'slate',
  },
  {
    id: 'budget-emerald-amber-deck',
    cat: 'Decks',
    title: 'A budget Emerald/Amber deck under €40',
    excerpt: "If you've just finished a starter deck and want a real upgrade without re-mortgaging the house, here's a 60-card list that rewards patient play and protects your Princesses.",
    author: 'Mira Okafor',
    date: '28 Apr',
    read: '11 min',
    lang: 'EN',
    cover: 'meadow',
  },
  {
    id: 'enchanted-pull-rates',
    cat: 'Set Spoilers',
    title: "What the Enchanted pull rates actually look like, 14 cases later",
    excerpt: "We cracked 14 booster cases of Reign of Jafar and tracked every Enchanted. The truth is somewhere between the rumours and the official statement.",
    author: 'Sam Ireton',
    date: '21 Apr',
    read: '8 min',
    lang: 'EN',
    cover: 'gold',
  },
  {
    id: 'lyon-locals-guide',
    cat: 'Community',
    title: 'Guide des locales Lorcana à Lyon',
    excerpt: "Une carte des boutiques qui organisent des tournois hebdomadaires, des soirées draft, et des évènements casuels en région lyonnaise.",
    author: 'Théo Reynaud',
    date: '15 Apr',
    read: '5 min',
    lang: 'FR',
    cover: 'lavender',
  },
];

Object.assign(window, { CARDS, SETS, NEWS });
