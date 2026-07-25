import type { Quest, BestiaryEntry, GlossaryDoc, PlayerStats } from '../types';

const QUESTS_KEY = 'witcher_journal_quests_v4';
const BESTIARY_KEY = 'witcher_journal_bestiary_v4';
const GLOSSARY_KEY = 'witcher_journal_glossary_v4';
const STATS_KEY = 'witcher_journal_stats_v4';

export const INITIAL_STATS: PlayerStats = {
  totalXp: 0, // Clean Level 1 baseline (0 / 1000 XP)
  inventoryCount: 2,
  maxInventory: 60,
  crowns: 100,
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
    loreText: `Yennefer sent Geralt a letter smelling of lilac and gooseberries, asking to meet in White Orchard. Track her trail across the village.`,
    subQuests: [],
    objectives: [
      { id: 'obj-1-1', text: 'Go to the tavern in White Orchard.', isCompleted: false, sortOrder: 1 },
      { id: 'obj-1-2', text: 'Ask the locals about Yennefer.', isCompleted: false, sortOrder: 2 },
    ],
  },
  {
    id: 'quest-2',
    title: 'Contract: Devil by the Well',
    locationTag: 'White Orchard',
    category: 'Witcher Contract',
    suggestedLevel: 2,
    status: 'Active',
    isTracked: false,
    points: 50,
    sortOrder: 2,
    loreText: `A spirit haunts the abandoned village well. Odolan needs clean water for his family and posted a bounty on the notice board.`,
    subQuests: [],
    objectives: [
      { id: 'obj-2-1', text: 'Investigate the ruined well using Witcher Senses.', isCompleted: false, sortOrder: 1 },
      { id: 'obj-2-2', text: 'Read the entry on Noonwraiths in the Bestiary.', isCompleted: false, sortOrder: 2 },
      { id: 'obj-2-3', text: 'Defeat the Noonwraith and collect the contract reward.', isCompleted: false, sortOrder: 3 },
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
    description: `Feeds on delayed responsibilities and grows stronger when tasks are put off. Whispers tempting excuses into the ears of busy witchers.`,
    tactics: `Set a 15-minute timer and begin the smallest objective immediately to shatter the ghoul's grip.`,
    victoriesCount: 0,
    iconType: 'ghoul',
  },
];

export const INITIAL_GLOSSARY: GlossaryDoc[] = [
  {
    id: 'doc-1',
    title: 'WITCHER PATH & DAILY RULES',
    category: 'Personal Notes',
    dateCreated: '2026-07-25',
    icon: 'scroll',
    content: `1. Only track one active quest at a time.\n2. Break large tasks into small, manageable objectives.\n3. Meditate and rest when stamina or focus runs low.`,
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
