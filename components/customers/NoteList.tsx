import React, { useState } from 'react';
import { FaRegStickyNote, FaPlus, FaTimes, FaTrash, FaPencilAlt, FaSave, FaUserCircle, FaClock } from 'react-icons/fa';

interface Note {
  id: number;
  content: string;
  created_at: string;
  created_by: string;
  updated_at?: string;
}

interface NoteListProps {
  customerId: number;
  notes: Note[];
  onAddNote?: (content: string) => Promise<void>;
  onUpdateNote?: (noteId: number, content: string) => Promise<void>;
  onDeleteNote?: (noteId: number) => Promise<void>;
}

const NoteList: React.FC<NoteListProps> = ({
  customerId,
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editNoteContent, setEditNoteContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddNote || !newNoteContent.trim()) return;

    try {
      setIsSubmitting(true);
      await onAddNote(newNoteContent);
      setNewNoteContent('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateNote || !editingNoteId || !editNoteContent.trim()) return;

    try {
      setIsSubmitting(true);
      await onUpdateNote(editingNoteId, editNoteContent);
      setEditingNoteId(null);
    } catch (error) {
      console.error('Error updating note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (note: Note) => {
    setEditingNoteId(note.id);
    setEditNoteContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditNoteContent('');
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Notes</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-sm flex items-center text-blue-600 hover:text-blue-800"
        >
          {showAddForm ? (
            <>
              <FaTimes className="mr-1" /> Cancel
            </>
          ) : (
            <>
              <FaPlus className="mr-1" /> Add Note
            </>
          )}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Note</h4>
          <form onSubmit={handleAddNote}>
            <div className="mb-3">
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter note content..."
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !newNoteContent.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </form>
        </div>
      )}

      {notes.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-md">
          <FaRegStickyNote className="mx-auto text-gray-400 text-3xl mb-2" />
          <p className="text-gray-500">No notes found for this customer.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Add a note
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
            >
              {editingNoteId === note.id ? (
                <div className="p-4">
                  <form onSubmit={handleUpdateNote}>
                    <div className="mb-3">
                      <textarea
                        value={editNoteContent}
                        onChange={(e) => setEditNoteContent(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="mr-2 px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !editNoteContent.trim()}
                        className="px-3 py-1 text-sm text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <div className="mb-2 text-sm text-gray-500 flex items-center">
                        <FaUserCircle className="mr-1" />
                        <span className="mr-2">{note.created_by}</span>
                        <FaClock className="mr-1" />
                        <span>{formatDate(note.created_at)}</span>
                        {note.updated_at && note.updated_at !== note.created_at && (
                          <span className="ml-2 text-xs italic">
                            (edited: {formatDate(note.updated_at)})
                          </span>
                        )}
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap break-words text-gray-800">{note.content}</p>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-shrink-0">
                      {onUpdateNote && (
                        <button
                          onClick={() => startEditing(note)}
                          className="text-gray-500 hover:text-blue-600 mr-2"
                          title="Edit Note"
                        >
                          <FaPencilAlt />
                          <span className="sr-only">Edit</span>
                        </button>
                      )}
                      {onDeleteNote && (
                        <button
                          onClick={() => onDeleteNote(note.id)}
                          className="text-gray-500 hover:text-red-600"
                          title="Delete Note"
                        >
                          <FaTrash />
                          <span className="sr-only">Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;
