"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiConfig from "../../../api/axios.config";
import { X, RotateCcw, Trash2, Loader2, List, FileText } from "lucide-react";

export default function ArchivePanel({ boardID, onClose }) {
  const queryClient = useQueryClient();

  const { data: archivedLists = [], isLoading: listsLoading } = useQuery({
    queryKey: ["archivedLists", boardID],
    queryFn: () =>
      apiConfig
        .get(`/api/v1/lists/${boardID}/archived-lists`)
        .then((res) => res.data.data)
        .catch(() => []),
  });

  const { data: archivedCards = [], isLoading: cardsLoading } = useQuery({
    queryKey: ["archivedCards", boardID],
    queryFn: () =>
      apiConfig
        .get(`/api/v1/cards/${boardID}/archived-cards`)
        .then((res) => res.data.data)
        .catch(() => []),
  });

  const restoreList = useMutation({
    mutationFn: (listID) =>
      apiConfig.patch(`/api/v1/lists/${listID}/restore`),
    onSuccess: () => {
      queryClient.invalidateQueries(["archivedLists", boardID]);
      queryClient.invalidateQueries(["lists", boardID]);
    },
  });

  const restoreCard = useMutation({
    mutationFn: (cardID) =>
      apiConfig.patch(`/api/v1/cards/${cardID}/restore`),
    onSuccess: () => {
      queryClient.invalidateQueries(["archivedCards", boardID]);
      queryClient.invalidateQueries(["cards"]);
    },
  });

  const isLoading = listsLoading || cardsLoading;
  const isEmpty = archivedLists.length === 0 && archivedCards.length === 0;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="leather-panel theme-surface w-full max-w-md max-h-[80vh] flex flex-col animate-scale-in">
        <div className="p-3 sm:p-4 border-b-2 border-dashed border-[#d48166]/30 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-black theme-text heading-bold uppercase">
            Archived Items
          </h2>
          <button onClick={onClose} className="theme-text hover:text-[#d48166] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#d48166]" />
            </div>
          ) : isEmpty ? (
            <p className="text-center theme-text py-8 opacity-60 text-sm">
              No archived items in this board
            </p>
          ) : (
            <div className="space-y-6">
              {archivedLists.length > 0 && (
                <div className="animate-slide-up">
                  <h3 className="label-text flex items-center gap-2 mb-3">
                    <List size={14} /> Archived Lists
                  </h3>
                  <div className="space-y-2">
                    {archivedLists.map((list, index) => (
                      <div
                        key={list._id}
                        className="flex items-center gap-3 p-3 leather-card animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold theme-text text-sm truncate">
                            {list.title}
                          </p>
                          <p className="text-xs theme-text opacity-50">
                            Archived{" "}
                            {new Date(list.archivedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => restoreList.mutate(list._id)}
                          className="btn-secondary text-xs py-1 px-2 flex items-center gap-1"
                        >
                          <RotateCcw size={12} /> Restore
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {archivedCards.length > 0 && (
                <div className="animate-slide-up stagger-2">
                  <h3 className="label-text flex items-center gap-2 mb-3">
                    <FileText size={14} /> Archived Cards
                  </h3>
                  <div className="space-y-2">
                    {archivedCards.map((card, index) => (
                      <div
                        key={card._id}
                        className="flex items-center gap-3 p-3 leather-card animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold theme-text text-sm truncate">
                            {card.title}
                          </p>
                          <p className="text-xs theme-text opacity-50">
                            from {card.list?.title || "Unknown list"} •{" "}
                            {new Date(card.archivedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => restoreCard.mutate(card._id)}
                          className="btn-secondary text-xs py-1 px-2 flex items-center gap-1"
                        >
                          <RotateCcw size={12} /> Restore
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
