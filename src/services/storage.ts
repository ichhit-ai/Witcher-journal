import type { Quest, BestiaryEntry, GlossaryDoc, PlayerStats } from '../types';

const QUESTS_KEY = 'witcher_journal_quests_v3';
const BESTIARY_KEY = 'witcher_journal_bestiary_v3';
const GLOSSARY_KEY = 'witcher_journal_glossary_v3';
const STATS_KEY = 'witcher_journal_stats_v3';

export const INITIAL_STATS: PlayerStats = {
  totalXp: 260, // Level 1 (260/1000) matching screenshot
  inventoryCount: 6,
  maxInventory: 60,
  crowns: 300,
};

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest-1',
    title: 'Lilac and Gooseberries',
    locationTag: 'White Orchard',
    category: 'Main Quest',
    suggestedLevel: 1,
    status: 'Active',
    isTracked: true,
    points: 100,
    sortOrder: 1,
    loreText: `Yennefer had contacted Geralt - finally. They had not seen each other in years. And then she'd sent him a letter, smelling of lilac and gooseberries, of course, asking him to meet her in the village of Willoughby. "About a matter of great importance," she had written.\n\nSo as was his wont when it came to all things Yennefer, the witcher raced off at breakneck speed. Alas, he arrived too late. Passing armies had razed Willoughby to the ground. Yennefer was nowhere in sight. With the help of Vesemir, whom Geralt had encountered along the way, Geralt picked up her trail, which the two witchers then followed. Yen had ridden north, traversing wild lands and battlefields at great speed. She was in a hurry. Perhaps she was in trouble...`,
    subQuests: [],
    objectives: [
      { id: 'obj-1-1', text: 'Go to the tavern in White Orchard.', isCompleted: false, sortOrder: 1 },
      { id: 'obj-1-2', text: 'Kill the ghouls.', isCompleted: true, sortOrder: 2 },
      { id: 'obj-1-3', text: 'Follow Vesemir.', isCompleted: true, sortOrder: 3 },
    ],
  },
  {
    id: 'quest-2',
    title: 'In Ciri\'s Footsteps',
    locationTag: 'Velen | Multiple Locations',
    category: 'Main Quest',
    suggestedLevel: 6,
    status: 'Active',
    isTracked: false,
    points: 100,
    sortOrder: 2,
    loreText: `The trail of Ciri grew hot in the province of Velen. Reports spoke of a young woman with ash-blonde hair fleeing through the swamps and villages. Geralt knew that to track her down, he would have to investigate three distinct leads across the land.`,
    objectives: [],
    subQuests: [
      {
        id: 'sub-2-1',
        title: 'Family Matters',
        locationTag: 'CROW\'S PERCH',
        isCompleted: false,
        objectives: [
          { id: 'obj-2-1-1', text: 'Investigate all remaining leads in Velen and find the Baron\'s wife.', isCompleted: false, sortOrder: 1 },
          { id: 'obj-2-1-2', text: 'Follow the baron.', isCompleted: true, sortOrder: 2 },
          { id: 'obj-2-1-3', text: 'Find the pellar\'s hut.', isCompleted: true, sortOrder: 3 },
          { id: 'obj-2-1-4', text: 'Kill the bandits attacking the pellar.', isCompleted: true, sortOrder: 4 },
        ],
      },
      {
        id: 'sub-2-2',
        title: 'Ladies of the Wood',
        locationTag: 'CROOKBACK BOG',
        isCompleted: false,
        objectives: [
          { id: 'obj-2-2-1', text: 'Search the bog for the Trail of Treats.', isCompleted: false, sortOrder: 1 },
          { id: 'obj-2-2-2', text: 'Speak with the orphans of Crookback Bog.', isCompleted: false, sortOrder: 2 },
        ],
      },
    ],
  },
  {
    id: 'quest-3',
    title: 'Contract: Devil by the Well',
    locationTag: 'White Orchard',
    category: 'Witcher Contract',
    suggestedLevel: 2,
    status: 'Active',
    isTracked: false,
    points: 30,
    sortOrder: 1,
    loreText: `A notice posted on the board in White Orchard spoke of a spirit haunting the abandoned well in the ruined village nearby. Odolan, a local peasant, needed clean water for his sick daughter, but the spirit prevented anyone from drawing from the well.\n\nGeralt agreed to take the contract for a modest fee of crowns.`,
    subQuests: [],
    objectives: [
      { id: 'obj-3-1', text: 'Ask Odolan about the spirit by the well.', isCompleted: true, sortOrder: 1 },
      { id: 'obj-3-2', text: 'Find out what spirit haunts the well using Witcher Senses.', isCompleted: false, sortOrder: 2 },
      { id: 'obj-3-3', text: 'Read the entry about Noonwraiths in the Bestiary.', isCompleted: false, sortOrder: 3 },
      { id: 'obj-3-4', text: 'Defeat the Noonwraith and collect its trophy.', isCompleted: false, sortOrder: 4 },
    ],
  },
  {
    id: 'quest-4',
    title: 'Temerian Valuables',
    locationTag: 'White Orchard',
    category: 'Treasure Hunt',
    suggestedLevel: 4,
    status: 'Active',
    isTracked: false,
    points: 40,
    sortOrder: 1,
    loreText: `While swimming in the river near the mill, Geralt discovered a locked chest beneath the water and the body of a Temerian soldier holding a key and a waterlogged note.\n\nThe note detailed a hidden stash of Temerian military funds hidden in a nearby cellar.`,
    subQuests: [],
    objectives: [
      { id: 'obj-4-1', text: 'Read the waterlogged note.', isCompleted: true, sortOrder: 1 },
      { id: 'obj-4-2', text: 'Find the Temerian treasure using Witcher Senses.', isCompleted: false, sortOrder: 2 },
      { id: 'obj-4-3', text: 'Open the chest using the key.', isCompleted: false, sortOrder: 3 },
    ],
  },
  {
    id: 'quest-5',
    title: 'A Matter of Administrative Urgency',
    locationTag: 'Novigrad',
    category: 'Secondary Quest',
    suggestedLevel: 3,
    status: 'Active',
    isTracked: false,
    points: 50,
    sortOrder: 1,
    loreText: `Word reached the notice board of a mountain of bureaucratic ledgers and tax records troubling the guild hall. If ignored, dire financial penalties would be exacted upon the realm.\n\nGeralt resolved to sort through the records, clear all pending invoices, and file the taxes before nightfall.`,
    subQuests: [],
    objectives: [
      { id: 'obj-5-1', text: 'Gather all tax receipts and invoices from Q2.', isCompleted: true, sortOrder: 1 },
      { id: 'obj-5-2', text: 'Calculate total deductible expenses.', isCompleted: false, sortOrder: 2 },
      { id: 'obj-5-3', text: 'Submit final ledger to the Guild Council.', isCompleted: false, sortOrder: 3 },
    ],
  },
];

export const INITIAL_BESTIARY: BestiaryEntry[] = [
  {
    id: 'best-1',
    name: 'THE PROCRASTINATION GHOUL',
    category: 'Habit Blocker',
    subtitle: 'NIGHTMARE OF DEADLINES',
    weaknesses: ['25-Min Pomodoro Potion', 'Witcher Focus Sign', 'Task Chunking Sword'],
    description: `Procrastination Ghouls nest in messy workspaces and feed on delayed responsibilities. They grow stronger every hour a task is put off, whispering tempting excuses into the ears of weary scholars and witchers alike.`,
    tactics: `To slay a Procrastination Ghoul, do not attempt to engage it in full battle all at once. Strike swift and small: set a 5-minute timer and begin the smallest objective. Once bloodied, the ghoul will crumble under momentum.`,
    victoriesCount: 14,
    iconType: 'ghoul',
  },
  {
    id: 'best-2',
    name: 'DISTRACTION SIREN',
    category: 'Specter',
    subtitle: 'TEMPTRESS OF INFINITE SCROLLING',
    weaknesses: ['Notification Silence Sign', 'Website Blocker Relic', 'Deep Work Meditation'],
    description: `Distraction Sirens sing sweet, siren songs of endless social feeds, notification pings, and irrelevent videos. They drag unsuspecting witchers down into abyssal depths of lost hours.`,
    tactics: `Muffle your hearing before entering their territory. Turn off non-essential notifications and place the glowing telecommunication orb in another room.`,
    victoriesCount: 22,
    iconType: 'siren',
  },
  {
    id: 'best-3',
    name: 'BURNOUT LESHEN',
    category: 'Relict',
    subtitle: 'ANCIENT MONSTER OF OVERWORK',
    weaknesses: ['8-Hour Sleep Meditation', 'Hydration Potion', 'Nature Walk Oil'],
    description: `A ancient and terrible monster that stalk those who ignore physical fatigue and mental exhaustion. The Leshen entangles its victims in vine-like anxiety until their stamina is completely spent.`,
    tactics: `Avoid fighting the Leshen head-on when stamina is depleted. Retreat, meditate, take long walks, and rest until your vigor returns to full power.`,
    victoriesCount: 8,
    iconType: 'leshen',
  },
];

export const INITIAL_GLOSSARY: GlossaryDoc[] = [
  {
    id: 'doc-1',
    title: 'THE WHITE FROST',
    category: 'Lore',
    dateCreated: '1272-05-19',
    icon: 'book',
    content: `dust that blocks the incoming light of the sun? Perhaps infinitesimal particles of the sort postulated by Democritus of Ban Ard, with the unusual property of sucking up warmth as a sponge does water?\n\nWe know for a certainty however, that, thanks to the telescopic observations of elven astronomers, the White Frost, whatever it is, has already destroyed a great many worlds. The star systems in which it appears perish into lifeless hunks of ice over the course of a few decades. Furthermore, each scholar is agreed that the White Frost will one day come to our world. Ithlinne's Prophecy, though based on magic intuition and not scientific observation, thus appears to foretell the truth.\n\nMany mages are skeptical about the theses presented here. I recommend they carry out the same experiment I have conducted in my own laboratory. Using the spell Portus Asterum, open a microscopic portal for three and a half seconds to the coordinates 03 31 48 90, 89 27 09 34. Yet before you do, dress in your warmest furs and ready an axe for breaking through thick ice.`,
  },
  {
    id: 'doc-2',
    title: 'WITCHER PATH & PERSONAL RULES',
    category: 'Personal Notes',
    dateCreated: '2026-07-21',
    icon: 'scroll',
    content: `1. Only track one quest at a time. Multi-tasking is the ruin of both swordplay and productivity.\n\n2. Break large monster hunts into small objectives. A griffin is not slain in a single blow, but by step-by-step preparation, potions, and dodges.\n\n3. Rest and meditate when stamina drops low. Even Gwynbleidd must sleep.`,
  },
];

// Persistence Handlers
export function loadQuests(): Quest[] {
  const data = localStorage.getItem(QUESTS_KEY);
  if (!data) return INITIAL_QUESTS;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse quests from storage', e);
    return INITIAL_QUESTS;
  }
}

export function saveQuests(quests: Quest[]) {
  localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
}

export function loadBestiary(): BestiaryEntry[] {
  const data = localStorage.getItem(BESTIARY_KEY);
  if (!data) return INITIAL_BESTIARY;
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_BESTIARY;
  }
}

export function saveBestiary(bestiary: BestiaryEntry[]) {
  localStorage.setItem(BESTIARY_KEY, JSON.stringify(bestiary));
}

export function loadGlossary(): GlossaryDoc[] {
  const data = localStorage.getItem(GLOSSARY_KEY);
  if (!data) return INITIAL_GLOSSARY;
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_GLOSSARY;
  }
}

export function saveGlossary(glossary: GlossaryDoc[]) {
  localStorage.setItem(GLOSSARY_KEY, JSON.stringify(glossary));
}

export function loadStats(): PlayerStats {
  const data = localStorage.getItem(STATS_KEY);
  if (!data) return INITIAL_STATS;
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_STATS;
  }
}

export function saveStats(stats: PlayerStats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}
