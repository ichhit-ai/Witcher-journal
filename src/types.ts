export type QuestCategory = 'Main Quest' | 'Secondary Quest' | 'Witcher Contract' | 'Treasure Hunt';

export interface Objective {
  id: string;
  text: string;
  isCompleted: boolean;
  sortOrder: number;
}

export interface SubQuest {
  id: string;
  title: string;
  locationTag?: string;
  objectives: Objective[];
  isCompleted: boolean;
}

export interface Quest {
  id: string;
  title: string;
  locationTag: string; // e.g. "White Orchard | Novigrad | Velen"
  category: QuestCategory;
  loreText: string;
  suggestedLevel?: number;
  status: 'Active' | 'Completed';
  isTracked: boolean;
  points: number; // XP reward on completion
  sortOrder: number;
  subQuests: SubQuest[]; // Nested subquests
  objectives: Objective[]; // Top-level objectives (if no subquests, or main objectives)
}

export interface BestiaryEntry {
  id: string;
  name: string;
  category: 'Relict' | 'Necrophage' | 'Specter' | 'Elementa' | 'Hybrid' | 'Vampire' | 'Habit Blocker';
  subtitle: string;
  weaknesses: string[];
  description: string;
  tactics: string;
  victoriesCount: number; // Times this habit/blocker was defeated
  iconType: string;
}

export interface GlossaryDoc {
  id: string;
  title: string;
  category: 'Lore' | 'Personal Notes' | 'Reflections' | 'Project Spec';
  content: string;
  dateCreated: string;
  icon: string;
}

export interface PlayerStats {
  totalXp: number;
  inventoryCount: number;
  maxInventory: number;
  crowns: number;
}
