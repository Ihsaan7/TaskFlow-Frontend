"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiConfig from "../../../api/axios.config";
import {
  X,
  Calendar,
  Tag,
  Users,
  Paperclip,
  CheckSquare,
  MessageSquare,
  Archive,
  Trash2,
  Clock,
  Plus,
  Edit2,
  Check,
  Link,
} from "lucide-react";

export default function CardModal({ card, boardID, onClose }) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState({
    title: card.title,
    description: card.description || "",
    dueDate: card.dueDate ? card.dueDate.split("T")[0] : "",
  });
  const [newComment, setNewComment] = useState("");
  const [newCheckItem, setNewCheckItem] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");

  const { data: cardDetails } = useQuery({
    queryKey: ["card", card._id],
    queryFn: () =>
      apiConfig.get(`/api/v1/cards/${card._id}`).then((res) => res.data.data),
    initialData: card,
  });

  const { data: boardLabels = [] } = useQuery({
    queryKey: ["boardLabels", boardID],
    queryFn: () =>
      apiConfig.get(`/api/v1/labels/board/${boardID}`).then((res) => res.data.data),
  });

  const updateCard = useMutation({
    mutationFn: (data) => apiConfig.put(`/api/v1/cards/${card._id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["card", card._id]);
      queryClient.invalidateQueries(["cards"]);
      setIsEditing(false);
    },
  });

  const addComment = useMutation({
    mutationFn: (text) =>
      apiConfig.post(`/api/v1/comments/card/${card._id}`, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries(["card", card._id]);
      setNewComment("");
    },
  });

  const addCheckItem = useMutation({
    mutationFn: (text) =>
      apiConfig.post(`/api/v1/checklist/card/${card._id}`, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries(["card", card._id]);
      setNewCheckItem("");
    },
  });

  const toggleCheckItem = useMutation({
    mutationFn: ({ itemId, isCompleted }) =>
      apiConfig.patch(`/api/v1/checklist/card/${card._id}/${itemId}`, {
        isCompleted,
      }),
    onSuccess: () => queryClient.invalidateQueries(["card", card._id]),
  });

  const deleteCheckItem = useMutation({
    mutationFn: (itemId) =>
      apiConfig.delete(`/api/v1/checklist/card/${card._id}/${itemId}`),
    onSuccess: () => queryClient.invalidateQueries(["card", card._id]),
  });

  const addLabelToCard = useMutation({
    mutationFn: (label) =>
      apiConfig.post(`/api/v1/labels/card/${card._id}/add`, { label }),
    onSuccess: () => queryClient.invalidateQueries(["card", card._id]),
  });

  const removeLabelFromCard = useMutation({
    mutationFn: (label) =>
      apiConfig.post(`/api/v1/labels/card/${card._id}/remove`, { label }),
    onSuccess: () => queryClient.invalidateQueries(["card", card._id]),
  });

  const addUrlAttachment = useMutation({
    mutationFn: ({ url, filename }) =>
      apiConfig.post(`/api/v1/attachments/card/${card._id}/url`, {
        url,
        filename,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["card", card._id]);
      setAttachmentUrl("");
    },
  });

  const deleteAttachment = useMutation({
    mutationFn: (attachmentId) =>
      apiConfig.delete(`/api/v1/attachments/card/${card._id}/${attachmentId}`),
    onSuccess: () => queryClient.invalidateQueries(["card", card._id]),
  });

  const archiveCard = useMutation({
    mutationFn: () =>
      apiConfig.patch(`/api/v1/cards/${card._id}/archive`),
    onSuccess: () => {
      queryClient.invalidateQueries(["cards"]);
      onClose();
    },
  });

  const deleteCard = useMutation({
    mutationFn: () =>
      apiConfig.delete(`/api/v1/cards/${card._id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["cards"]);
      onClose();
    },
  });

  const handleSave = () => {
    updateCard.mutate(editForm);
  };

  const checklist = cardDetails?.checklist || [];
  const comments = cardDetails?.comments || [];
  const attachments = cardDetails?.attachments || [];
  const cardLabels = cardDetails?.labels || [];

  const checklistProgress =
    checklist.length > 0
      ? Math.round(
          (checklist.filter((i) => i.isCompleted).length / checklist.length) *
            100
        )
      : 0;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 overflow-y-auto py-4 sm:py-8 px-4 animate-fade-in">
      <div className="leather-panel theme-surface w-full max-w-2xl animate-scale-in relative my-auto">
        <button
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 theme-text hover:text-[#d48166] transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-4 sm:p-6">
          {isEditing ? (
            <div className="mb-4">
              <input
                type="text"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                className="input-field text-lg sm:text-xl font-bold"
              />
            </div>
          ) : (
            <h2 className="text-xl sm:text-2xl font-black theme-text heading-bold mb-4 pr-8">
              {cardDetails?.title}
            </h2>
          )}

          {cardLabels.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {cardLabels.map((label, idx) => {
                const boardLabel = boardLabels.find((l) => l.name === label);
                return (
                  <span
                    key={idx}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-white border border-dashed border-white/30"
                    style={{ backgroundColor: boardLabel?.color || "#61BD4F" }}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          )}

          <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 border-b-2 border-dashed border-[#d48166]/30 pb-3 sm:pb-4 overflow-x-auto">
            {["details", "checklist", "comments", "attachments", "labels"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold uppercase whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? "bg-[#d48166] text-[#e6e2dd] border-2 border-dashed border-[#b86b52]"
                      : "theme-text border-2 border-dashed border-transparent hover:border-[#d48166]"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {activeTab === "details" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="label-text flex items-center gap-2">
                  <Calendar size={14} /> Due Date
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editForm.dueDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, dueDate: e.target.value })
                    }
                    className="input-field"
                  />
                ) : (
                  <p className="theme-text">
                    {cardDetails?.dueDate
                      ? new Date(cardDetails.dueDate).toLocaleDateString()
                      : "No due date set"}
                  </p>
                )}
              </div>

              <div>
                <label className="label-text">Description</label>
                {isEditing ? (
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="input-field min-h-[100px]"
                    placeholder="Add a description..."
                  />
                ) : (
                  <p className="theme-text whitespace-pre-wrap text-sm sm:text-base">
                    {cardDetails?.description || "No description"}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 border-t-2 border-dashed border-[#d48166]/30">
                {isEditing ? (
                  <>
                    <button onClick={handleSave} className="btn-primary text-sm">
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-primary flex items-center gap-2 text-sm"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => archiveCard.mutate()}
                      className="btn-secondary flex items-center gap-2 text-sm"
                    >
                      <Archive size={14} /> Archive
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="btn-danger flex items-center gap-2 text-sm"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === "checklist" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <CheckSquare size={18} className="theme-text" />
                <div className="flex-1 bg-[#d48166]/20 h-3 border border-dashed border-[#d48166]/40">
                  <div
                    className="bg-[#d48166] h-full transition-all duration-300"
                    style={{ width: `${checklistProgress}%` }}
                  />
                </div>
                <span className="theme-text text-sm font-bold">{checklistProgress}%</span>
              </div>

              <div className="space-y-2">
                {checklist.map((item, index) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 p-2 sm:p-3 leather-card animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <button
                      onClick={() =>
                        toggleCheckItem.mutate({
                          itemId: item._id,
                          isCompleted: !item.isCompleted,
                        })
                      }
                      className={`w-5 h-5 border-2 border-dashed flex items-center justify-center transition-all ${
                        item.isCompleted
                          ? "bg-[#d48166] border-[#b86b52]"
                          : "border-[#d48166]"
                      }`}
                    >
                      {item.isCompleted && (
                        <Check size={12} className="text-white" />
                      )}
                    </button>
                    <span
                      className={`flex-1 theme-text text-sm ${
                        item.isCompleted ? "line-through opacity-50" : ""
                      }`}
                    >
                      {item.text}
                    </span>
                    <button
                      onClick={() => deleteCheckItem.mutate(item._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCheckItem}
                  onChange={(e) => setNewCheckItem(e.target.value)}
                  placeholder="Add checklist item..."
                  className="input-field flex-1 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newCheckItem.trim()) {
                      addCheckItem.mutate(newCheckItem);
                    }
                  }}
                />
                <button
                  onClick={() => addCheckItem.mutate(newCheckItem)}
                  disabled={!newCheckItem.trim()}
                  className="btn-primary disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}

          {activeTab === "comments" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex gap-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="input-field flex-1 min-h-[80px] text-sm"
                />
              </div>
              <button
                onClick={() => addComment.mutate(newComment)}
                disabled={!newComment.trim()}
                className="btn-primary text-sm disabled:opacity-50"
              >
                Add Comment
              </button>

              <div className="space-y-3 mt-4">
                {comments.map((comment, index) => (
                  <div
                    key={comment._id}
                    className="p-3 leather-card animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#d48166] border-2 border-dashed border-[#b86b52] flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                        {comment.user?.fullName?.[0] || "U"}
                      </div>
                      <div>
                        <p className="font-semibold theme-text text-sm">
                          {comment.user?.fullName || "User"}
                        </p>
                        <p className="text-xs theme-text opacity-50">
                          {new Date(comment.date).toLocaleString()}
                          {comment.editedAt && " (edited)"}
                        </p>
                      </div>
                    </div>
                    <p className="theme-text text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "attachments" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  placeholder="Paste a link URL..."
                  className="input-field flex-1 text-sm"
                />
                <button
                  onClick={() =>
                    addUrlAttachment.mutate({ url: attachmentUrl })
                  }
                  disabled={!attachmentUrl.trim()}
                  className="btn-primary flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  <Link size={14} /> Add Link
                </button>
              </div>

              <div className="space-y-2">
                {attachments.map((attachment, index) => (
                  <div
                    key={attachment._id}
                    className="flex items-center gap-3 p-3 leather-card animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Paperclip size={16} className="theme-text flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#d48166] hover:underline font-medium text-sm truncate block"
                      >
                        {attachment.filename}
                      </a>
                      <p className="text-xs theme-text opacity-50">
                        {attachment.type === "link"
                          ? "Link"
                          : attachment.type || "File"}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteAttachment.mutate(attachment._id)}
                      className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "labels" && (
            <div className="space-y-4 animate-fade-in">
              <p className="label-text">Available Labels</p>
              <div className="flex flex-wrap gap-2">
                {boardLabels.map((label) => {
                  const isActive = cardLabels.includes(label.name);
                  return (
                    <button
                      key={label._id}
                      onClick={() =>
                        isActive
                          ? removeLabelFromCard.mutate(label.name)
                          : addLabelToCard.mutate(label.name)
                      }
                      className={`px-3 sm:px-4 py-2 text-white font-medium flex items-center gap-2 text-sm border-2 border-dashed transition-all hover:scale-105 ${
                        isActive ? "border-white ring-2 ring-[#d48166] ring-offset-2" : "border-transparent"
                      }`}
                      style={{ backgroundColor: label.color }}
                    >
                      {isActive && <Check size={14} />}
                      {label.name}
                    </button>
                  );
                })}
              </div>
              {boardLabels.length === 0 && (
                <p className="theme-text text-sm opacity-60">
                  No labels available. Create labels in board settings.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] animate-fade-in p-4">
          <div className="leather-panel theme-surface p-4 sm:p-6 w-full max-w-sm animate-scale-in">
            <h3 className="text-lg font-black theme-text heading-bold uppercase mb-3">
              Delete Card?
            </h3>
            <p className="theme-text text-sm mb-4">
              This action cannot be undone. The card and all its contents will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteCard.mutate()}
                disabled={deleteCard.isPending}
                className="btn-danger flex-1 flex items-center justify-center gap-2"
              >
                {deleteCard.isPending ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
