// In-memory data store for fallback when MongoDB is not available
export let tasks = [
  { _id: '1', title: 'Welcome to Flow!', category: 'General', status: 'todo', priority: 3, createdAt: new Date() },
  { _id: '2', title: 'Check out the Analytics', category: 'Work', status: 'done', priority: 5, createdAt: new Date() },
];

export let notes = [
  { _id: '1', title: 'Project Ideas', content: 'Build a premium task manager with glassmorphism.', tags: ['ideas', 'flow'], createdAt: new Date() },
];

export const addTask = (task: any) => {
  const newTask = { ...task, _id: Math.random().toString(36).substr(2, 9), createdAt: new Date() };
  tasks.push(newTask);
  return newTask;
};

export const updateTask = (id: string, updates: any) => {
  const index = tasks.findIndex(t => t._id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates };
    return tasks[index];
  }
  return null;
};

export const deleteTask = (id: string) => {
  tasks = tasks.filter(t => t._id !== id);
};

export const addNote = (note: any) => {
  const newNote = { ...note, _id: Math.random().toString(36).substr(2, 9), createdAt: new Date() };
  notes.push(newNote);
  return newNote;
};

export const updateNote = (id: string, updates: any) => {
  const index = notes.findIndex(n => n._id === id);
  if (index !== -1) {
    notes[index] = { ...notes[index], ...updates };
    return notes[index];
  }
  return null;
};

export const deleteNote = (id: string) => {
  notes = notes.filter(n => n._id !== id);
};
