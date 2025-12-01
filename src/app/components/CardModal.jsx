"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiConfig from "../../../api/axios.config";
import { X, MessageSquare } from "lucide-react";
import useAuthStore from "@/store/authStore";

export default function CardModal({ cardId, onClose }) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [commentText, setCommentText] = useState("");

  const { data: card } = useQuery({
    queryKey: ["card", cardId],
    queryFn: () =>
      apiConfig.get(`/api/v1/cards/${cardId}`).then((res) => res.data.data),
    enabled: !!cardId,
  });

  const addComment = useMutation({
    mutationFn: (text) =>
      apiConfig.post(`/api/v1/cards/${cardId}/comment`, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries(["card", cardId]);
      setCommentText("");
    },
  });

  if (!card) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-white">{card.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {card.description && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">
                Description
              </h3>
              <p className="text-white">{card.description}</p>
            </div>
          )}

          {card.labels && card.labels.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">
                Labels
              </h3>
              <div className="flex gap-2 flex-wrap">
                {card.labels.map((label, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-500 text-white text-sm px-3 py-1 rounded"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {card.dueDate && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">
                Due Date
              </h3>
              <p className="text-white">
                {new Date(card.dueDate).toLocaleDateString()}
              </p>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Comments
            </h3>

            <div className="space-y-3 mb-4">
              {card.comments && card.comments.length > 0 ? (
                card.comments.map((comment, idx) => (
                  <div key={idx} className="bg-gray-700 rounded p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-semibold text-white">
                        {comment.user?.username || "User"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.date).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No comments yet</p>
              )}
            </div>

            <div className="flex gap-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-gray-700 text-white p-3 rounded resize-none"
                rows={3}
              />
              <button
                onClick={() => addComment.mutate(commentText)}
                disabled={!commentText.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 rounded self-end"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
