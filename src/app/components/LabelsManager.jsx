"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiConfig from "../../../api/axios.config";
import { X, Plus, Edit2, Trash2, Check, Loader2 } from "lucide-react";

const colorOptions = [
  "#61BD4F",
  "#F2D600",
  "#FF9F1A",
  "#EB5A46",
  "#C377E0",
  "#0079BF",
  "#00C2E0",
  "#51E898",
  "#FF78CB",
  "#344563",
];

export default function LabelsManager({ boardID, onClose }) {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", color: "#61BD4F" });

  const { data: labels = [], isLoading } = useQuery({
    queryKey: ["boardLabels", boardID],
    queryFn: () =>
      apiConfig
        .get(`/api/v1/labels/board/${boardID}`)
        .then((res) => res.data.data),
  });

  const createLabel = useMutation({
    mutationFn: (data) =>
      apiConfig.post(`/api/v1/labels/board/${boardID}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["boardLabels", boardID]);
      setIsCreating(false);
      setForm({ name: "", color: "#61BD4F" });
    },
  });

  const updateLabel = useMutation({
    mutationFn: ({ labelID, data }) =>
      apiConfig.put(`/api/v1/labels/board/${boardID}/${labelID}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["boardLabels", boardID]);
      setEditingId(null);
      setForm({ name: "", color: "#61BD4F" });
    },
  });

  const deleteLabel = useMutation({
    mutationFn: (labelID) =>
      apiConfig.delete(`/api/v1/labels/board/${boardID}/${labelID}`),
    onSuccess: () => queryClient.invalidateQueries(["boardLabels", boardID]),
  });

  const handleSubmit = () => {
    if (!form.name.trim()) return;

    if (editingId) {
      updateLabel.mutate({ labelID: editingId, data: form });
    } else {
      createLabel.mutate(form);
    }
  };

  const startEditing = (label) => {
    setEditingId(label._id);
    setForm({ name: label.name, color: label.color });
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="leather-panel theme-surface w-full max-w-md animate-scale-in">
        <div className="p-3 sm:p-4 border-b-2 border-dashed border-[#d48166]/30 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-black theme-text heading-bold uppercase">
            Manage Labels
          </h2>
          <button onClick={onClose} className="theme-text hover:text-[#d48166] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-3 sm:p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#d48166]" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {labels.map((label, index) => (
                  <div
                    key={label._id}
                    className="flex items-center gap-2 sm:gap-3 p-2 leather-card animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className="flex-1 h-8 border-2 border-dashed border-white/20 flex items-center px-3 text-white font-medium text-sm"
                      style={{ backgroundColor: label.color }}
                    >
                      {label.name}
                    </div>
                    <button
                      onClick={() => startEditing(label)}
                      className="theme-text hover:text-[#d48166] p-1 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteLabel.mutate(label._id)}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {(isCreating || editingId) && (
                <div className="space-y-3 p-3 leather-card animate-scale-in">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Label name..."
                    className="input-field text-sm"
                    autoFocus
                  />

                  <div>
                    <label className="label-text mb-2">Color</label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          onClick={() => setForm({ ...form, color })}
                          className={`w-7 h-7 sm:w-8 sm:h-8 border-2 border-dashed transition-all hover:scale-110 ${
                            form.color === color
                              ? "border-[#d48166] ring-2 ring-[#d48166] ring-offset-2"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                        >
                          {form.color === color && (
                            <Check size={14} className="text-white mx-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={handleSubmit} className="btn-primary text-sm">
                      {editingId ? "Update" : "Create"}
                    </button>
                    <button
                      onClick={() => {
                        setIsCreating(false);
                        setEditingId(null);
                        setForm({ name: "", color: "#61BD4F" });
                      }}
                      className="btn-secondary text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!isCreating && !editingId && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
                >
                  <Plus size={16} /> Create New Label
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
