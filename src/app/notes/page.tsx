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
  PinOff
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
        // Sort: Pinned first, then by date
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
      if (response.ok) {
        fetchNotes();
      }
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
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchNotes();
      }
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
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">Personal Notes</h1>
          <p className="text-text-muted">Capture your thoughts and ideas</p>
        </div>
        <button 
          onClick={() => {
            setCurrentNote({ title: '', content: '', tags: [] });
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus size={20} />
          Create Note
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
        <input 
          type="text" 
          placeholder="Search your notes..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 w-full max-w-xl"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-20 text-text-muted">Loading your notes...</div>
        ) : filteredNotes.length === 0 ? (
          <div className="col-span-full card glass text-center py-20">
            <StickyNote className="mx-auto mb-4 text-text-muted" size={48} />
            <p className="text-text-muted">No notes found. Start by creating one!</p>
          </div>
        ) : (
          filteredNotes.map((note, i) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`card glass flex flex-col group relative overflow-visible ${note.isPinned ? 'border-primary/30 bg-primary/5' : ''}`}
            >
              {note.isPinned && (
                <div className="absolute -top-3 -left-3 bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/40 z-10">
                  <Pin size={14} fill="white" />
                </div>
              )}
              
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">{note.title}</h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-y-[-4px] group-hover:translate-y-0">
                  <button 
                    onClick={() => togglePin(note)}
                    className={`p-2 rounded-xl transition-colors ${note.isPinned ? 'text-primary bg-primary/10' : 'text-text-muted hover:bg-white/5 hover:text-white'}`}
                  >
                    {note.isPinned ? <Pin size={16} /> : <Pin size={16} className="rotate-45" />}
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentNote(note);
                      setIsModalOpen(true);
                    }}
                    className="p-2 hover:bg-white/5 rounded-xl text-text-muted hover:text-white"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => deleteNote(note._id)}
                    className="p-2 hover:bg-red-500/10 rounded-xl text-text-muted hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <p className="text-text-muted text-sm leading-relaxed line-clamp-4 mb-8 flex-1">
                {note.content}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {note.tags.map((tag, j) => (
                  <span key={j} className="text-[10px] bg-white/5 text-text-muted border border-white/5 px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider group-hover:border-primary/20 transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="pt-4 border-t border-white/5 text-[10px] text-text-muted/40 font-medium">
                Created on {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </motion.div>
          ))

        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-[1001] px-4"
            >
              <div className="card glass p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{currentNote?._id ? 'Edit Note' : 'New Note'}</h2>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-glass-bg rounded-lg text-text-muted transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-muted">Title</label>
                    <input
                      type="text"
                      placeholder="Note Title"
                      value={currentNote?.title || ''}
                      onChange={(e) => setCurrentNote({ ...currentNote!, title: e.target.value })}
                      className="w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-muted">Content</label>
                    <textarea
                      placeholder="Write your thoughts..."
                      rows={8}
                      value={currentNote?.content || ''}
                      onChange={(e) => setCurrentNote({ ...currentNote!, content: e.target.value })}
                      className="w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-muted">Tags (comma separated)</label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                      <input
                        type="text"
                        placeholder="ideas, project, reminder"
                        className="pl-10 w-full"
                        value={currentNote?.tags?.join(', ') || ''}
                        onChange={(e) => setCurrentNote({ 
                          ...currentNote!, 
                          tags: e.target.value.split(',').map(t => t.trim()).filter(t => t !== '') 
                        })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full justify-center mt-4">
                    {currentNote?._id ? 'Update Note' : 'Create Note'}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-4 { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
        .pl-10 { padding-left: 2.5rem; }
        .pl-12 { padding-left: 3rem; }
        .fixed { position: fixed; }
        .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
        .z-\[1000\] { z-index: 1000; }
        .z-\[1001\] { z-index: 1001; }
        .bg-black\/60 { background-color: rgba(0, 0, 0, 0.6); }
        .backdrop-blur-sm { backdrop-filter: blur(4px); }
        .left-1\/2 { left: 50%; }
        .top-1\/2 { top: 50%; }
        .-translate-x-1\/2 { transform: translateX(-50%); }
        .-translate-y-1\/2 { transform: translateY(-50%); }
        .max-w-xl { max-width: 36rem; }
        .max-w-2xl { max-width: 42rem; }
      `}</style>
    </AppLayout>
  );
};

export default NotesPage;
