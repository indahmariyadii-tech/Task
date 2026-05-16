'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Tag, 
  MoreVertical, 
  Trash2, 
  Edit3,
  X,
  StickyNote,
  Pin,
  FileText,
  Calendar
} from 'lucide-react';

interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned?: boolean;
  createdAt: string;
}

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Partial<Note> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      const data = await response.json();
      if (Array.isArray(data)) {
        const sorted = data.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setNotes(sorted);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePin = async (note: Note) => {
    try {
      const response = await fetch(`/api/notes/${note._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !note.isPinned }),
      });
      if (response.ok) fetchNotes();
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!currentNote?._id;
    const url = isEditing ? `/api/notes/${currentNote._id}` : '/api/notes';
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentNote),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setCurrentNote(null);
        fetchNotes();
      }
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const deleteNote = async (id: string) => {
    if (!confirm('Discard this thought permanently?')) return;
    try {
      const response = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (response.ok) fetchNotes();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="flex flex-col gap-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-white mb-2">Second Brain</h1>
            <p className="text-text-dim font-medium">Archive your insights and build your knowledge base.</p>
          </div>
          <button 
            onClick={() => {
              setCurrentNote({ title: '', content: '', tags: [] });
              setIsModalOpen(true);
            }}
            className="premium-button"
          >
            <Plus size={18} />
            <span>New Insight</span>
          </button>
        </header>

        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full max-w-xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search insights..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-border rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:border-primary/40 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="col-span-full py-24 text-center text-text-dim font-medium">Accessing archive...</div>
            ) : filteredNotes.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-24 text-center glass-card border-dashed"
              >
                <StickyNote className="mx-auto mb-4 text-text-dim" size={48} />
                <h3 className="text-white font-bold text-xl mb-1">Knowledge Void</h3>
                <p className="text-text-dim">No insights found in your second brain.</p>
              </motion.div>
            ) : (
              filteredNotes.map((note, i) => (
                <motion.div
                  key={note._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-card group flex flex-col relative min-h-[280px] ${note.isPinned ? 'border-primary/30 ring-1 ring-primary/20' : ''}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      {note.isPinned && <Pin size={14} className="text-primary fill-primary" />}
                      <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-primary-light transition-colors">{note.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-y-[-4px] group-hover:translate-y-0">
                      <button 
                        onClick={() => togglePin(note)}
                        className={`p-1.5 rounded-lg transition-colors ${note.isPinned ? 'text-primary bg-primary/10' : 'text-text-dim hover:text-white hover:bg-white/5'}`}
                      >
                        <Pin size={14} />
                      </button>
                      <button 
                        onClick={() => { setCurrentNote(note); setIsModalOpen(true); }}
                        className="p-1.5 rounded-lg text-text-dim hover:text-white hover:bg-white/5"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => deleteNote(note._id)}
                        className="p-1.5 rounded-lg text-text-dim hover:text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    <p className="text-text-dim text-sm leading-relaxed line-clamp-6 mb-6">
                      {note.content}
                    </p>
                  </div>
                  
                  <div className="mt-auto space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map((tag, j) => (
                        <span key={j} className="text-[9px] font-black uppercase tracking-wider text-text-dim bg-white/5 px-2 py-1 rounded-md border border-white/5 group-hover:border-primary/20 transition-colors">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pt-4 border-t border-border text-[10px] font-bold text-text-dim/60 uppercase">
                      <Calendar size={10} />
                      {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Note Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md z-[1000]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-[1001] px-4"
            >
              <div className="glass-card p-8 border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <FileText size={20} />
                    </div>
                    <h2 className="text-2xl font-display font-bold tracking-tight text-white">
                      {currentNote?._id ? 'Refine Insight' : 'Capture Insight'}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-xl text-text-dim hover:text-white transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim ml-1">Title</label>
                    <input
                      type="text"
                      placeholder="Give your insight a name..."
                      value={currentNote?.title || ''}
                      onChange={(e) => setCurrentNote({ ...currentNote!, title: e.target.value })}
                      className="input-premium py-3 font-semibold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim ml-1">Content</label>
                    <textarea
                      placeholder="What's on your mind? Expand your thoughts here..."
                      rows={10}
                      value={currentNote?.content || ''}
                      onChange={(e) => setCurrentNote({ ...currentNote!, content: e.target.value })}
                      className="input-premium py-4 text-sm leading-relaxed resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim ml-1">Taxonomy (Comma Separated)</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={16} />
                      <input
                        type="text"
                        placeholder="e.g. strategy, personal, future"
                        className="input-premium pl-12"
                        value={currentNote?.tags?.join(', ') || ''}
                        onChange={(e) => setCurrentNote({ 
                          ...currentNote!, 
                          tags: e.target.value.split(',').map(t => t.trim()).filter(t => t !== '') 
                        })}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="premium-button-ghost flex-1 justify-center"
                    >
                      Discard
                    </button>
                    <button type="submit" className="premium-button flex-1 justify-center">
                      {currentNote?._id ? 'Update Archive' : 'Save to Archive'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default NotesPage;

