"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import apiConfig from "../../../api/axios.config";
import { X, Plus, Loader2, Layout, Globe, Lock, Trash2 } from "lucide-react";

export default function TemplatesModal({ boardID, onClose, mode = "save" }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(mode === "save" ? "save" : "my");
  const [saveForm, setSaveForm] = useState({
    name: "",
    description: "",
    isPublic: false,
    category: "other",
  });
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const { data: myTemplates = [], isLoading: myLoading } = useQuery({
    queryKey: ["myTemplates"],
    queryFn: () =>
      apiConfig.get("/api/v1/templates").then((res) => res.data.data),
    enabled: activeTab === "my" || activeTab === "use",
  });

  const { data: publicTemplates = [], isLoading: publicLoading } = useQuery({
    queryKey: ["publicTemplates"],
    queryFn: () =>
      apiConfig.get("/api/v1/templates/public").then((res) => res.data.data),
    enabled: activeTab === "public",
  });

  const saveTemplate = useMutation({
    mutationFn: (data) =>
      apiConfig.post(`/api/v1/templates/save/${boardID}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["myTemplates"]);
      onClose();
    },
  });

  const createFromTemplate = useMutation({
    mutationFn: ({ templateID, title }) =>
      apiConfig.post(`/api/v1/templates/create/${templateID}`, { title }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["boards"]);
      router.push(`/board/${res.data.data._id}`);
      onClose();
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: (templateID) =>
      apiConfig.delete(`/api/v1/templates/${templateID}`),
    onSuccess: () => queryClient.invalidateQueries(["myTemplates"]),
  });

  const handleSave = () => {
    if (!saveForm.name.trim()) return;
    saveTemplate.mutate(saveForm);
  };

  const handleCreate = () => {
    if (!selectedTemplate || !newBoardTitle.trim()) return;
    createFromTemplate.mutate({
      templateID: selectedTemplate._id,
      title: newBoardTitle,
    });
  };

  const categories = [
    "personal",
    "work",
    "project",
    "marketing",
    "sales",
    "engineering",
    "other",
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="leather-panel theme-surface w-full max-w-lg max-h-[80vh] flex flex-col animate-scale-in">
        <div className="p-3 sm:p-4 border-b-2 border-dashed border-[#d48166]/30 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-black theme-text heading-bold uppercase">
            Board Templates
          </h2>
          <button onClick={onClose} className="theme-text hover:text-[#d48166] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b-2 border-dashed border-[#d48166]/30 overflow-x-auto">
          {boardID && (
            <button
              onClick={() => setActiveTab("save")}
              className={`flex-1 p-2 sm:p-3 text-xs sm:text-sm font-semibold uppercase whitespace-nowrap transition-all ${
                activeTab === "save"
                  ? "bg-[#d48166] text-[#e6e2dd]"
                  : "theme-text hover:bg-[var(--surface-hover)]"
              }`}
            >
              Save Template
            </button>
          )}
          <button
            onClick={() => setActiveTab("my")}
            className={`flex-1 p-2 sm:p-3 text-xs sm:text-sm font-semibold uppercase whitespace-nowrap transition-all ${
              activeTab === "my"
                ? "bg-[#d48166] text-[#e6e2dd]"
                : "theme-text hover:bg-[var(--surface-hover)]"
            }`}
          >
            My Templates
          </button>
          <button
            onClick={() => setActiveTab("public")}
            className={`flex-1 p-2 sm:p-3 text-xs sm:text-sm font-semibold uppercase whitespace-nowrap transition-all ${
              activeTab === "public"
                ? "bg-[#d48166] text-[#e6e2dd]"
                : "theme-text hover:bg-[var(--surface-hover)]"
            }`}
          >
            Public
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {activeTab === "save" && boardID && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="label-text">Template Name</label>
                <input
                  type="text"
                  value={saveForm.name}
                  onChange={(e) =>
                    setSaveForm({ ...saveForm, name: e.target.value })
                  }
                  placeholder="My awesome template..."
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="label-text">Description</label>
                <textarea
                  value={saveForm.description}
                  onChange={(e) =>
                    setSaveForm({ ...saveForm, description: e.target.value })
                  }
                  placeholder="Describe what this template is for..."
                  className="input-field min-h-[80px] text-sm"
                />
              </div>

              <div>
                <label className="label-text">Category</label>
                <select
                  value={saveForm.category}
                  onChange={(e) =>
                    setSaveForm({ ...saveForm, category: e.target.value })
                  }
                  className="input-field text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer leather-card p-3">
                <input
                  type="checkbox"
                  checked={saveForm.isPublic}
                  onChange={(e) =>
                    setSaveForm({ ...saveForm, isPublic: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#d48166]"
                />
                <span className="theme-text text-sm">
                  Make this template public
                </span>
              </label>

              <button
                onClick={handleSave}
                disabled={!saveForm.name.trim() || saveTemplate.isPending}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saveTemplate.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Layout size={16} /> Save Template
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === "my" && (
            <div className="space-y-3 animate-fade-in">
              {myLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#d48166]" />
                </div>
              ) : myTemplates.length === 0 ? (
                <p className="text-center theme-text py-8 opacity-60 text-sm">
                  No templates yet. Save a board as a template to get started!
                </p>
              ) : (
                myTemplates.map((template, index) => (
                  <div
                    key={template._id}
                    className={`p-3 sm:p-4 leather-card cursor-pointer animate-slide-up ${
                      selectedTemplate?._id === template._id
                        ? "border-[#b86b52] ring-2 ring-[#d48166]"
                        : ""
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold theme-text text-sm truncate">
                            {template.name}
                          </p>
                          {template.isPublic ? (
                            <Globe size={12} className="text-green-500 flex-shrink-0" />
                          ) : (
                            <Lock size={12} className="text-gray-500 flex-shrink-0" />
                          )}
                        </div>
                        {template.description && (
                          <p className="text-xs theme-text opacity-50 mt-1 line-clamp-2">
                            {template.description}
                          </p>
                        )}
                        <p className="text-xs theme-text opacity-40 mt-2">
                          {template.lists?.length || 0} lists • Used{" "}
                          {template.usageCount} times
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTemplate.mutate(template._id);
                        }}
                        className="text-red-500 hover:text-red-700 p-1 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}

              {selectedTemplate && (
                <div className="pt-4 border-t-2 border-dashed border-[#d48166]/30 space-y-3 animate-slide-up">
                  <input
                    type="text"
                    value={newBoardTitle}
                    onChange={(e) => setNewBoardTitle(e.target.value)}
                    placeholder="New board title..."
                    className="input-field text-sm"
                  />
                  <button
                    onClick={handleCreate}
                    disabled={
                      !newBoardTitle.trim() || createFromTemplate.isPending
                    }
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {createFromTemplate.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Plus size={16} /> Create Board
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "public" && (
            <div className="space-y-3 animate-fade-in">
              {publicLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#d48166]" />
                </div>
              ) : publicTemplates.length === 0 ? (
                <p className="text-center theme-text py-8 opacity-60 text-sm">
                  No public templates available yet.
                </p>
              ) : (
                publicTemplates.map((template, index) => (
                  <div
                    key={template._id}
                    className={`p-3 sm:p-4 leather-card cursor-pointer animate-slide-up ${
                      selectedTemplate?._id === template._id
                        ? "border-[#b86b52] ring-2 ring-[#d48166]"
                        : ""
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <p className="font-semibold theme-text text-sm">{template.name}</p>
                    {template.description && (
                      <p className="text-xs theme-text opacity-50 mt-1 line-clamp-2">
                        {template.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs theme-text opacity-40">
                      <span>by {template.createdBy?.fullName}</span>
                      <span>•</span>
                      <span>{template.lists?.length || 0} lists</span>
                      <span>•</span>
                      <span>Used {template.usageCount} times</span>
                    </div>
                  </div>
                ))
              )}

              {selectedTemplate && (
                <div className="pt-4 border-t-2 border-dashed border-[#d48166]/30 space-y-3 animate-slide-up">
                  <input
                    type="text"
                    value={newBoardTitle}
                    onChange={(e) => setNewBoardTitle(e.target.value)}
                    placeholder="New board title..."
                    className="input-field text-sm"
                  />
                  <button
                    onClick={handleCreate}
                    disabled={
                      !newBoardTitle.trim() || createFromTemplate.isPending
                    }
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {createFromTemplate.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Plus size={16} /> Create Board
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
