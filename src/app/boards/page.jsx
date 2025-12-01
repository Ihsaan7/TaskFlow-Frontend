"use client";
import useAuthStore from "@/store/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import apiConfig from "../../../api/axios.config";
import { Plus, X, Loader2, Archive, RotateCcw, Trash2 } from "lucide-react";
import BoardCard from "../components/Board";
import { useThemeContext } from "../provider";

const colorPalette = [
  "#0079BF",
  "#00C2E0", 
  "#51E898",
  "#FFAB4A",
  "#FF6F61",
  "#C377E0",
  "#344563",
  "#d48166",
];

export default function BoardsPage() {
  const [description, setDescription] = useState("");
  const [background, setBackground] = useState("#0079BF");
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const queryClient = useQueryClient();
  const { mounted } = useThemeContext();

  const { data, isLoading } = useQuery({
    queryKey: ["boards"],
    queryFn: () =>
      apiConfig.get("/api/v1/boards/all-boards").then((res) => res.data.data),
  });

  const { data: archivedBoards, isLoading: archivedLoading } = useQuery({
    queryKey: ["archivedBoards"],
    queryFn: () =>
      apiConfig.get("/api/v1/boards/archived").then((res) => res.data.data),
    enabled: showArchived,
  });

  const createMutation = useMutation({
    mutationFn: ({ title, description, background }) =>
      apiConfig.post("/api/v1/boards/create-board", {
        title,
        description,
        background,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (boardId) =>
      apiConfig.delete(`/api/v1/boards/${boardId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
      queryClient.invalidateQueries(["archivedBoards"]);
      setDeleteConfirm(null);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (boardId) =>
      apiConfig.patch(`/api/v1/boards/${boardId}/archive`),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
      queryClient.invalidateQueries(["archivedBoards"]);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (boardId) =>
      apiConfig.patch(`/api/v1/boards/${boardId}/restore`),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
      queryClient.invalidateQueries(["archivedBoards"]);
    },
  });

  const closeModal = () => {
    setIsOpen(false);
    setTitle("");
    setDescription("");
    setBackground("#0079BF");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      createMutation.mutate({ title, description, background });
    }
  };

  const handleDelete = (boardId) => {
    setDeleteConfirm(boardId);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteMutation.mutate(deleteConfirm);
    }
  };

  if (!mounted) return null;

  const handleArchive = (boardId) => {
    archiveMutation.mutate(boardId);
  };

  const handleRestore = (boardId) => {
    restoreMutation.mutate(boardId);
  };

  return (
    <div className="min-h-screen theme-bg p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black theme-text heading-bold uppercase tracking-wide animate-slide-up">
            {showArchived ? "Archived Boards" : "My Boards"}
          </h1>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="btn-secondary flex items-center gap-2 animate-slide-up"
          >
            {showArchived ? (
              <>
                <RotateCcw className="w-4 h-4" />
                <span className="font-semibold uppercase text-xs sm:text-sm">View Active</span>
              </>
            ) : (
              <>
                <Archive className="w-4 h-4" />
                <span className="font-semibold uppercase text-xs sm:text-sm">View Archived</span>
              </>
            )}
          </button>
        </div>

        {showArchived ? (
          archivedLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#d48166]" />
            </div>
          ) : archivedBoards?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {archivedBoards.map((board, index) => (
                <div
                  key={board._id}
                  className="relative h-28 sm:h-32 p-4 flex flex-col justify-between animate-slide-up leather-card"
                  style={{ 
                    backgroundColor: board.background,
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <h3 className="text-white font-bold text-base sm:text-lg truncate drop-shadow-md">
                    {board.title}
                  </h3>
                  <p className="text-white/80 text-xs">
                    Archived {new Date(board.archivedAt).toLocaleDateString()}
                  </p>
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleRestore(board._id)}
                      disabled={restoreMutation.isPending}
                      className="p-2 bg-white/20 hover:bg-white/40 transition-colors border border-dashed border-white/30"
                      title="Restore Board"
                    >
                      <RotateCcw className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(board._id)}
                      className="p-2 bg-red-500/80 hover:bg-red-600 transition-colors border border-dashed border-red-400"
                      title="Delete Permanently"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-20 theme-text opacity-60 animate-fade-in">
              <Archive className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" />
              <p className="text-base sm:text-lg font-semibold">No archived boards</p>
              <p className="text-sm">Boards you archive will appear here</p>
            </div>
          )
        ) : isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#d48166]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            <button
              onClick={() => setIsOpen(true)}
              className="leather-card h-28 sm:h-32 flex items-center justify-center cursor-pointer theme-surface hover:border-[#b86b52] animate-slide-up group"
            >
              <div className="text-center">
                <Plus className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-[#d48166] group-hover:scale-110 transition-transform" />
                <p className="theme-text font-semibold uppercase text-xs sm:text-sm tracking-wide">
                  Create New Board
                </p>
              </div>
            </button>

            {data?.map((board, index) => (
              <a 
                href={`/board/${board._id}`} 
                key={board._id}
                className="animate-slide-up"
                style={{ animationDelay: `${(index + 1) * 50}ms` }}
              >
                <BoardCard
                  title={board.title}
                  description={board.description}
                  color={board.background}
                  boardId={board._id}
                  onDelete={handleDelete}
                  onArchive={handleArchive}
                />
              </a>
            ))}
          </div>
        )}

        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="leather-panel p-4 sm:p-6 w-full max-w-md animate-scale-in theme-surface">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-black theme-text heading-bold uppercase">
                  Create Board
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 theme-text hover:text-[#d48166] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="label-text">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter board title..."
                    className="input-field"
                    autoFocus
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="label-text">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter board description..."
                    className="input-field"
                  />
                </div>

                <div className="mb-6">
                  <label className="label-text">Background Color</label>
                  <div className="flex flex-wrap gap-2">
                    {colorPalette.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setBackground(hex)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 border-2 border-dashed transition-all hover:scale-110 ${
                          background === hex
                            ? "border-[#373a36] dark:border-[#e6e2dd] ring-2 ring-[#d48166] ring-offset-2"
                            : "border-transparent hover:border-[#d48166]"
                        }`}
                        style={{ backgroundColor: hex }}
                        title={hex}
                      >
                        {background === hex && (
                          <span className="text-white text-sm sm:text-lg font-bold drop-shadow-md">
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {createMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Create"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="leather-panel p-4 sm:p-6 w-full max-w-md animate-scale-in theme-surface">
              <h2 className="text-lg sm:text-xl font-black theme-text heading-bold uppercase mb-4">
                Delete Board?
              </h2>
              <p className="theme-text mb-6 text-sm sm:text-base">
                This action cannot be undone. All lists and cards in this board will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                  className="btn-danger flex-1 flex items-center justify-center gap-2"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
