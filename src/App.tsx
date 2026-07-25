import React, { useState, useEffect } from 'react';
import './App.css';
import type { Quest, BestiaryEntry, GlossaryDoc, PlayerStats } from './types';
import {
  loadQuests,
  saveQuests,
  loadBestiary,
  saveBestiary,
  loadGlossary,
  saveGlossary,
  loadStats,
  saveStats,
  INITIAL_QUESTS,
  INITIAL_BESTIARY,
  INITIAL_GLOSSARY,
  INITIAL_STATS,
} from './services/storage';
import {
  playObjectiveSound,
  playQuestCompleteSound,
  playLevelUpSound,
} from './services/soundSynth';
import { toggleBgAudio } from './services/bgAudio';
import { List, CheckSquare, BookOpen } from 'lucide-react';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useUser } from '@clerk/react';

import { HomeScreen } from './components/HomeScreen';
import { TopBar } from './components/TopBar';
import { LeftPane } from './components/LeftPane';
import { MiddlePane } from './components/MiddlePane';
import { RightPane } from './components/RightPane';
import { BestiaryView } from './components/BestiaryView';
import { JournalView } from './components/JournalView';
import { QuestEditorModal } from './components/QuestEditorModal';

export const App: React.FC = () => {
  const { isSignedIn } = useUser();

  // Convex Queries & Mutations
  const convexQuests = useQuery(api.quests.getQuests);
  const convexBestiary = useQuery(api.bestiary.getBestiary);
  const convexGlossary = useQuery(api.glossary.getGlossary);
  const convexStats = useQuery(api.stats.getStats);

  const saveQuestMutation = useMutation(api.quests.saveQuest);
  const setQuestsBatchMutation = useMutation(api.quests.setQuestsBatch);
  const saveBestiaryEntryMutation = useMutation(api.bestiary.saveBestiaryEntry);
  const setBestiaryBatchMutation = useMutation(api.bestiary.setBestiaryBatch);
  const saveGlossaryDocMutation = useMutation(api.glossary.saveGlossaryDoc);
  const setGlossaryBatchMutation = useMutation(api.glossary.setGlossaryBatch);
  const saveStatsMutation = useMutation(api.stats.saveStats);

  // Screen & Navigation state
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'QUESTS' | 'BESTIARY' | 'JOURNAL'>('QUESTS');
  const [mobilePaneTab, setMobilePaneTab] = useState<'LIST' | 'OBJECTIVES' | 'LORE'>('LIST');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Data Store State
  const [quests, setQuests] = useState<Quest[]>(loadQuests);
  const [bestiary, setBestiary] = useState<BestiaryEntry[]>(loadBestiary);
  const [glossary, setGlossary] = useState<GlossaryDoc[]>(loadGlossary);
  const [stats, setStats] = useState<PlayerStats>(loadStats);

  // Selection & Modal State
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(quests[0]?.id || null);
  const [editingQuest, setEditingQuest] = useState<Quest | null | 'NEW'>(null);

  const handleSelectQuest = (questId: string) => {
    setSelectedQuestId(questId);
    setMobilePaneTab('OBJECTIVES');
  };

  // Animations State
  const [isXpFlashing, setIsXpFlashing] = useState(false);
  const [isLevelPulsing, setIsLevelPulsing] = useState(false);

  // Sync Convex Remote Data -> Local React State when signed in
  useEffect(() => {
    if (!isSignedIn) return;
    if (convexQuests !== undefined) {
      if (convexQuests.length === 0) {
        const batch = INITIAL_QUESTS.map(q => ({
          customId: q.id,
          title: q.title,
          locationTag: q.locationTag,
          category: q.category,
          loreText: q.loreText,
          suggestedLevel: q.suggestedLevel,
          status: q.status,
          isTracked: q.isTracked,
          points: q.points,
          sortOrder: q.sortOrder,
          subQuests: q.subQuests,
          objectives: q.objectives,
        }));
        setQuestsBatchMutation({ quests: batch }).catch(console.error);
      } else {
        const mapped: Quest[] = convexQuests.map(q => ({
          id: q.customId,
          title: q.title,
          locationTag: q.locationTag,
          category: q.category as any,
          loreText: q.loreText,
          suggestedLevel: q.suggestedLevel,
          status: q.status as any,
          isTracked: q.isTracked,
          points: q.points,
          sortOrder: q.sortOrder,
          subQuests: q.subQuests,
          objectives: q.objectives,
        }));
        setQuests(mapped);
      }
    }
  }, [isSignedIn, convexQuests]);

  useEffect(() => {
    if (!isSignedIn) return;
    if (convexBestiary !== undefined) {
      if (convexBestiary.length === 0) {
        const batch = INITIAL_BESTIARY.map(b => ({
          customId: b.id,
          name: b.name,
          category: b.category,
          subtitle: b.subtitle,
          weaknesses: b.weaknesses,
          description: b.description,
          tactics: b.tactics,
          victoriesCount: b.victoriesCount,
          iconType: b.iconType,
        }));
        setBestiaryBatchMutation({ entries: batch }).catch(console.error);
      } else {
        const mapped: BestiaryEntry[] = convexBestiary.map(b => ({
          id: b.customId,
          name: b.name,
          category: b.category as any,
          subtitle: b.subtitle,
          weaknesses: b.weaknesses,
          description: b.description,
          tactics: b.tactics,
          victoriesCount: b.victoriesCount,
          iconType: b.iconType,
        }));
        setBestiary(mapped);
      }
    }
  }, [isSignedIn, convexBestiary]);

  useEffect(() => {
    if (!isSignedIn) return;
    if (convexGlossary !== undefined) {
      if (convexGlossary.length === 0) {
        const batch = INITIAL_GLOSSARY.map(g => ({
          customId: g.id,
          title: g.title,
          category: g.category,
          content: g.content,
          dateCreated: g.dateCreated,
          icon: g.icon,
        }));
        setGlossaryBatchMutation({ docs: batch }).catch(console.error);
      } else {
        const mapped: GlossaryDoc[] = convexGlossary.map(g => ({
          id: g.customId,
          title: g.title,
          category: g.category as any,
          content: g.content,
          dateCreated: g.dateCreated,
          icon: g.icon,
        }));
        setGlossary(mapped);
      }
    }
  }, [isSignedIn, convexGlossary]);

  useEffect(() => {
    if (!isSignedIn) return;
    if (convexStats !== undefined) {
      if (convexStats === null) {
        saveStatsMutation(INITIAL_STATS).catch(console.error);
      } else {
        setStats({
          totalXp: convexStats.totalXp,
          inventoryCount: convexStats.inventoryCount,
          maxInventory: convexStats.maxInventory,
          crowns: convexStats.crowns,
        });
      }
    }
  }, [isSignedIn, convexStats]);

  // Derived
  const currentLevel = Math.floor(stats.totalXp / 1000) + 1;
  const totalQuestsCount = quests.length;
  const completedQuestsCount = quests.filter((q) => q.status === 'Completed').length;
  const selectedQuest = quests.find((q) => q.id === selectedQuestId) || quests[0] || null;

  // Keyboard shortcuts: ESC to close, Space to track
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'Escape') {
        if (editingQuest) {
          setEditingQuest(null);
        } else if (isJournalOpen) {
          setIsJournalOpen(false);
        }
      }

      if (e.key === ' ' && isJournalOpen && activeTab === 'QUESTS' && selectedQuest && !editingQuest) {
        e.preventDefault();
        handleToggleTrack(selectedQuest.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isJournalOpen, editingQuest, selectedQuest, activeTab]);

  // Local Storage Fallback
  useEffect(() => { saveQuests(quests); }, [quests]);
  useEffect(() => { saveBestiary(bestiary); }, [bestiary]);
  useEffect(() => { saveGlossary(glossary); }, [glossary]);
  useEffect(() => {
    saveStats(stats);
    if (isSignedIn) {
      saveStatsMutation(stats).catch(console.error);
    }
  }, [stats, isSignedIn]);

  // Toggle Objective Completion & XP Calculation
  const handleToggleObjective = (questId: string, objectiveId: string, subQuestId?: string) => {
    const prevLevel = Math.floor(stats.totalXp / 1000) + 1;

    setQuests((prevQuests) => {
      const updatedList = prevQuests.map((q) => {
        if (q.id !== questId) return q;

        let updatedObjectives = [...q.objectives];
        let updatedSubQuests = q.subQuests ? [...q.subQuests] : [];

        if (subQuestId) {
          updatedSubQuests = updatedSubQuests.map((sq) => {
            if (sq.id !== subQuestId) return sq;
            const newObj = sq.objectives.map((o) =>
              o.id === objectiveId ? { ...o, isCompleted: !o.isCompleted } : o
            );
            const isSubDone = newObj.every((o) => o.isCompleted);
            return { ...sq, objectives: newObj, isCompleted: isSubDone };
          });
        } else {
          updatedObjectives = updatedObjectives.map((o) =>
            o.id === objectiveId ? { ...o, isCompleted: !o.isCompleted } : o
          );
        }

        const areTopObjsDone = updatedObjectives.length === 0 || updatedObjectives.every((o) => o.isCompleted);
        const areSubQuestsDone = updatedSubQuests.length === 0 || updatedSubQuests.every((sq) => sq.isCompleted);
        const isNowCompleted = areTopObjsDone && areSubQuestsDone;
        const wasCompleted = q.status === 'Completed';
        const xpReward = q.points || 100;

        if (!wasCompleted && isNowCompleted) {
          const newTotalXp = stats.totalXp + xpReward;
          const newLevel = Math.floor(newTotalXp / 1000) + 1;
          setStats((s) => ({ ...s, totalXp: newTotalXp }));
          setIsXpFlashing(true);
          setTimeout(() => setIsXpFlashing(false), 600);
          if (newLevel > prevLevel) {
            setIsLevelPulsing(true);
            setTimeout(() => setIsLevelPulsing(false), 900);
            playLevelUpSound();
          } else {
            playQuestCompleteSound();
          }
        } else if (wasCompleted && !isNowCompleted) {
          const newTotalXp = Math.max(0, stats.totalXp - xpReward);
          setStats((s) => ({ ...s, totalXp: newTotalXp }));
          playObjectiveSound();
        } else {
          playObjectiveSound();
        }

        const updatedQuest: Quest = {
          ...q,
          objectives: updatedObjectives,
          subQuests: updatedSubQuests,
          status: isNowCompleted ? 'Completed' : 'Active',
        };

        if (isSignedIn) {
          saveQuestMutation({
            customId: updatedQuest.id,
            title: updatedQuest.title,
            locationTag: updatedQuest.locationTag,
            category: updatedQuest.category,
            loreText: updatedQuest.loreText,
            suggestedLevel: updatedQuest.suggestedLevel,
            status: updatedQuest.status,
            isTracked: updatedQuest.isTracked,
            points: updatedQuest.points,
            sortOrder: updatedQuest.sortOrder,
            subQuests: updatedQuest.subQuests,
            objectives: updatedQuest.objectives,
          }).catch(console.error);
        }

        return updatedQuest;
      });
      return updatedList;
    });
  };

  const handleToggleTrack = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) => ({
        ...q,
        isTracked: q.id === questId ? !q.isTracked : false,
      }))
    );
  };

  const handleSaveQuest = (savedQuest: Quest) => {
    setQuests((prev) => {
      const exists = prev.some((q) => q.id === savedQuest.id);
      if (exists) {
        return prev.map((q) => (q.id === savedQuest.id ? savedQuest : q));
      } else {
        return [savedQuest, ...prev];
      }
    });
    setSelectedQuestId(savedQuest.id);
    if (isSignedIn) {
      saveQuestMutation({
        customId: savedQuest.id,
        title: savedQuest.title,
        locationTag: savedQuest.locationTag,
        category: savedQuest.category,
        loreText: savedQuest.loreText,
        suggestedLevel: savedQuest.suggestedLevel,
        status: savedQuest.status,
        isTracked: savedQuest.isTracked,
        points: savedQuest.points,
        sortOrder: savedQuest.sortOrder,
        subQuests: savedQuest.subQuests,
        objectives: savedQuest.objectives,
      }).catch(console.error);
    }
  };

  const handleDefeatMonster = (entryId: string) => {
    setBestiary((prev) => {
      const updated = prev.map((b) => (b.id === entryId ? { ...b, victoriesCount: b.victoriesCount + 1 } : b));
      if (isSignedIn) {
        const target = updated.find(b => b.id === entryId);
        if (target) {
          saveBestiaryEntryMutation({
            customId: target.id,
            name: target.name,
            category: target.category,
            subtitle: target.subtitle,
            weaknesses: target.weaknesses,
            description: target.description,
            tactics: target.tactics,
            victoriesCount: target.victoriesCount,
            iconType: target.iconType,
          }).catch(console.error);
        }
      }
      return updated;
    });
    setStats((s) => ({ ...s, crowns: s.crowns + 15 }));
  };

  const handleAddBestiaryEntry = (newEntry: BestiaryEntry) => {
    setBestiary((prev) => [newEntry, ...prev]);
    if (isSignedIn) {
      saveBestiaryEntryMutation({
        customId: newEntry.id,
        name: newEntry.name,
        category: newEntry.category,
        subtitle: newEntry.subtitle,
        weaknesses: newEntry.weaknesses,
        description: newEntry.description,
        tactics: newEntry.tactics,
        victoriesCount: newEntry.victoriesCount,
        iconType: newEntry.iconType,
      }).catch(console.error);
    }
  };

  const handleAddGlossaryDoc = (newDoc: GlossaryDoc) => {
    setGlossary((prev) => [newDoc, ...prev]);
    if (isSignedIn) {
      saveGlossaryDocMutation({
        customId: newDoc.id,
        title: newDoc.title,
        category: newDoc.category,
        content: newDoc.content,
        dateCreated: newDoc.dateCreated,
        icon: newDoc.icon,
      }).catch(console.error);
    }
  };

  const handleToggleAudio = () => {
    const nextState = !isAudioPlaying;
    setIsAudioPlaying(nextState);
    toggleBgAudio(nextState);
  };

  const trackedQuest = quests.find((q) => q.isTracked) || null;

  return (
    <div className="app-container">
      <HomeScreen
        onOpenJournal={() => setIsJournalOpen(true)}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
        trackedQuest={trackedQuest}
        playerLevel={currentLevel}
        crowns={stats.crowns}
        completedQuestsCount={completedQuestsCount}
        totalQuestsCount={totalQuestsCount}
      />

      {isJournalOpen && (
        <div className="journal-overlay">
          <TopBar
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onClose={() => setIsJournalOpen(false)}
            onOpenEditor={() => setEditingQuest('NEW')}
            completedQuestsCount={completedQuestsCount}
            totalQuestsCount={totalQuestsCount}
            isXpFlashing={isXpFlashing}
            isLevelPulsing={isLevelPulsing}
            isAudioPlaying={isAudioPlaying}
            onToggleAudio={handleToggleAudio}
          />

          {activeTab === 'QUESTS' && (
            <>
              {/* Mobile Segmented Sub-Navigation Switcher */}
              <div className="mobile-pane-switcher">
                <button
                  className={`mobile-tab-btn ${mobilePaneTab === 'LIST' ? 'active' : ''}`}
                  onClick={() => setMobilePaneTab('LIST')}
                >
                  <List size={14} /> QUESTS ({quests.length})
                </button>
                <button
                  className={`mobile-tab-btn ${mobilePaneTab === 'OBJECTIVES' ? 'active' : ''}`}
                  onClick={() => setMobilePaneTab('OBJECTIVES')}
                >
                  <CheckSquare size={14} /> OBJECTIVES
                </button>
                <button
                  className={`mobile-tab-btn ${mobilePaneTab === 'LORE' ? 'active' : ''}`}
                  onClick={() => setMobilePaneTab('LORE')}
                >
                  <BookOpen size={14} /> STORY
                </button>
              </div>

              <div className={`journal-body mobile-view-${mobilePaneTab.toLowerCase()}`}>
                <LeftPane
                  quests={quests}
                  selectedQuestId={selectedQuestId}
                  onSelectQuest={handleSelectQuest}
                  onOpenEditor={() => setEditingQuest('NEW')}
                  playerLevel={currentLevel}
                />
                <MiddlePane
                  quest={selectedQuest}
                  onToggleObjective={handleToggleObjective}
                  onEditQuest={(q) => setEditingQuest(q)}
                />
                <RightPane quest={selectedQuest} />
              </div>
            </>
          )}

          {activeTab === 'BESTIARY' && (
            <BestiaryView
              entries={bestiary}
              onDefeatMonster={handleDefeatMonster}
              onAddEntry={handleAddBestiaryEntry}
            />
          )}

          {activeTab === 'JOURNAL' && (
            <JournalView
              docs={glossary}
              onAddDoc={handleAddGlossaryDoc}
            />
          )}
        </div>
      )}

      {editingQuest && (
        <QuestEditorModal
          questToEdit={editingQuest === 'NEW' ? null : editingQuest}
          onSave={handleSaveQuest}
          onClose={() => setEditingQuest(null)}
        />
      )}
    </div>
  );
};

export default App;
