// src/components/Notes.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  // console.log(notes);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_GET_NOTE);

      if (response.status == 200) {
        if (response.data.length) {
          setNotes(response.data);
        }
      }
      // console.log(response.data.length);
    } catch (error) {
      setError("Failed to fetch notes");
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingNote) {
        const res=await axios.put(`${import.meta.env.VITE_UPDATE_NOTE}${editingNote._id}`, { title, content });
        // console.log(res);
        
        setEditingNote(null);
      } else {
        await axios.post(import.meta.env.VITE_CREATE_NOTE, { title, content });
      }

      setTitle("");
      setContent("");
      fetchNotes();
    } catch (error) {
      if (error.response?.status === 403) {
        setError("Free plan limit reached. Upgrade to create more notes.");
      } else {
        setError("Failed to save note");
        console.log(error);
        
      }
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    // console.log(id);

    try {
      await axios.delete(`${import.meta.env.VITE_DEL_NOTE}${id}`, {
  withCredentials: true
});
      fetchNotes();
    } catch (error) {
      setError("Failed to delete note");
    }
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-center items-center h-40">
            <p>Loading notes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Notes</h1>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              rows="4"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingNote ? "Update Note" : "Create Note"}
            </button>

            {editingNote && (
              <button
                type="button"
                onClick={cancelEdit}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Notes ({notes.length})
          </h2>

          {notes.length === 0 ? (
            <p className="text-gray-500">You haven't created any notes yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {note.title}
                  </h3>
                  <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                    {note.content}
                  </p>
                  <div className="flex justify-center space-x-2">
                    <div>
                     
                      {note.createdBy?.email === user.email ? (
                        
                        <span>  created by:{" "} YOU</span>
                      ) : (
                        <span>
                          {note.createdBy?.email} {note.createdBy?.name}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleEdit(note)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
