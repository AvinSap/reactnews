/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useAuth } from "../../../../../utils/context/AuthContext";

const Comments = ({ newsId }) => {
  const { auth } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [newsId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/news/${newsId}/comments`
      );
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/news/${newsId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: newComment,
            userId: auth.user.id,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to post comment");
      await fetchComments();
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleEdit = async (commentId, text) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/news/${newsId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            userId: auth.user.id,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update comment");
      await fetchComments();
      setEditingComment(null);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/news/${newsId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: auth.user.id,
            isAdmin: auth.user.role === 'admin',
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete comment");
      await fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (loading) {
    return <div className="mt-8">Loading comments...</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>

      {auth ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded-lg mb-2"
            placeholder="Add a comment..."
            rows="3"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Post Comment
          </button>
        </form>
      ) : (
        <p className="mb-4 text-gray-600">
          Please{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            login
          </a>{" "}
          to comment.
        </p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{comment.user_name}</span>
              <span className="text-gray-500 text-sm">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            
            {editingComment === comment.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEdit(comment.id, e.target.text.value);
                }}
                className="mt-2"
              >
                <textarea
                  name="text"
                  defaultValue={comment.text}
                  className="w-full p-2 border rounded-lg mb-2"
                  rows="3"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingComment(null)}
                    className="bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="text-gray-700">{comment.text}</p>
                {auth && (auth.user.id === comment.user_id || auth.user.role === 'admin') && (
                  <div className="mt-2 space-x-2">
                    {auth.user.id === comment.user_id && (
                      <button
                        onClick={() => setEditingComment(comment.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
