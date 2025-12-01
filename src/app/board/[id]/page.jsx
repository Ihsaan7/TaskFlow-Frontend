"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import apiConfig from "../../../../api/axios.config";
import {
  Plus,
  X,
  MoreHorizontal,
  Users,
  Tag,
  Archive,
  Clock,
  Activity,
  Layout,
  Search,
  Trash2,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CardModal from "../../components/CardModal";
import SearchModal from "../../components/SearchModal";
import BoardMembers from "../../components/BoardMembers";
import LabelsManager from "../../components/LabelsManager";
import ArchivePanel from "../../components/ArchivePanel";
import TemplatesModal from "../../components/TemplatesModal";
import ActivityLog from "../../components/ActivityLog";
import DeadlinesPanel from "../../components/DeadlinesPanel";
import { useThemeContext } from "../../provider";

function Card({ card, onClick }) {
  return (
    <div
      onClick={onClick}
      className="border-2 border-dashed border-[#8b4513] theme-surface p-4 mb-3 cursor-pointer hover:border-[#d48166] transition-all duration-300"
    >
      {card.labels && card.labels.length > 0 && (
        <div className="flex gap-2 mb-3 flex-wrap">
          {card.labels.map((label, idx) => (
            <span
              key={idx}
              className="bg-[#d48166] text-[#e6e2dd] text-xs px-2 py-1 border border-dashed border-[#8b4513] uppercase font-bold"
            >
              {label}
            </span>
          ))}
        </div>
      )}
      <p className="text-base font-black theme-text uppercase tracking-tight mb-2">{card.title}</p>
      {card.description && (
        <p className="theme-text opacity-70 text-sm mt-2 line-clamp-2">
          {card.description}
        </p>
      )}
      <div className="flex items-center gap-3 mt-2 opacity-60 text-xs">
        {card.dueDate && (
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {new Date(card.dueDate).toLocaleDateString()}
          </span>
        )}
        {card.checklist?.length > 0 && (
          <span>
            {card.checklist.filter((i) => i.isCompleted).length}/
            {card.checklist.length}
          </span>
        )}
        {card.comments?.length > 0 && <span>{card.comments.length} comments</span>}
        {card.attachments?.length > 0 && (
          <span>{card.attachments.length} files</span>
        )}
      </div>
    </div>
  );
}

function SortableList({ list, boardID, onCardClick }) {
  const queryClient = useQueryClient();
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [listTitle, setListTitle] = useState(list.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cardForm, setCardForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    labels: "",
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const { data: cards = [] } = useQuery({
    queryKey: ["cards", list._id],
    queryFn: () =>
      apiConfig
        .get(`/api/v1/cards/${list._id}/all-card`)
        .then((res) => res.data.data)
        .catch(() => []),
  });

  const createCard = useMutation({
    mutationFn: (cardData) =>
      apiConfig.post(`/api/v1/cards/${boardID}/${list._id}/create-card`, {
        title: cardData.title,
        description: cardData.description || undefined,
        dueDate: cardData.dueDate || undefined,
        labels: cardData.labels
          ? cardData.labels
              .split(",")
              .map((l) => l.trim())
              .filter(Boolean)
          : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["cards", list._id]);
      setCardForm({ title: "", description: "", dueDate: "", labels: "" });
      setIsAddingCard(false);
    },
  });

  const updateList = useMutation({
    mutationFn: (title) =>
      apiConfig.put(`/api/v1/lists/${list._id}`, { title }),
    onSuccess: () => {
      queryClient.invalidateQueries(["lists", boardID]);
      setIsEditingTitle(false);
    },
  });

  const archiveList = useMutation({
    mutationFn: () =>
      apiConfig.patch(`/api/v1/lists/${list._id}/archive`),
    onSuccess: () => queryClient.invalidateQueries(["lists", boardID]),
  });

  const deleteList = useMutation({
    mutationFn: () =>
      apiConfig.delete(`/api/v1/lists/${list._id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["lists", boardID]);
      setShowDeleteConfirm(false);
    },
  });

  return (
    <>
    {showDeleteConfirm && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] animate-fade-in p-4">
        <div className="leather-panel theme-surface p-4 sm:p-6 w-full max-w-sm animate-scale-in">
          <h3 className="text-lg font-black theme-text heading-bold uppercase mb-3">
            Delete List?
          </h3>
          <p className="theme-text text-sm mb-4">
            This will permanently delete "{list.title}" and all its cards. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => deleteList.mutate()}
              disabled={deleteList.isPending}
              className="btn-danger flex-1 flex items-center justify-center gap-2"
            >
              {deleteList.isPending ? "Deleting..." : "Delete"}
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
    <div
      ref={setNodeRef}
      style={style}
      className="border-2 border-dashed border-[#8b4513] theme-surface p-4 min-w-[280px] sm:min-w-[320px] max-w-[280px] sm:max-w-[320px] transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        {isEditingTitle ? (
          <input
            type="text"
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            onBlur={() => {
              if (listTitle.trim() && listTitle !== list.title) {
                updateList.mutate(listTitle);
              } else {
                setIsEditingTitle(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateList.mutate(listTitle);
              }
            }}
            className="w-full p-2 border-2 border-dashed border-[#8b4513] theme-surface theme-text font-bold text-base uppercase"
            autoFocus
          />
        ) : (
          <h3
            {...attributes}
            {...listeners}
            onClick={() => setIsEditingTitle(true)}
            className="font-black theme-text cursor-grab active:cursor-grabbing flex-1 text-lg uppercase tracking-tight"
          >
            {list.title}
          </h3>
        )}
        <div className="flex gap-1">
          <button
            onClick={() => archiveList.mutate()}
            className="text-[#d48166] opacity-70 hover:opacity-100 p-1 transition-opacity"
            title="Archive list"
          >
            <Archive size={14} />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-[#8b4513] opacity-70 hover:opacity-100 p-1 transition-opacity"
            title="Delete list"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="mb-3 max-h-[50vh] overflow-y-auto pr-1">
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <div key={card._id} style={{ animationDelay: `${index * 50}ms` }}>
              <Card
                card={card}
                onClick={() => onCardClick(card)}
              />
            </div>
          ))
        ) : (
          <p className="theme-text opacity-40 text-xs p-3 border-2 border-dashed border-[#d48166]/30 text-center">
            No cards yet
          </p>
        )}
      </div>

      {!isAddingCard ? (
        <button
          onClick={() => setIsAddingCard(true)}
          className="w-full text-left theme-text text-sm flex items-center gap-2 p-3 border-2 border-dashed border-[#8b4513] hover:border-[#d48166] transition-all duration-300 uppercase font-bold tracking-wide"
        >
          <Plus className="w-5 h-5" />
          Add Card
        </button>
      ) : (
        <div className="border-2 border-dashed border-[#8b4513] theme-surface p-3 space-y-2">
          <input
            type="text"
            value={cardForm.title}
            onChange={(e) =>
              setCardForm({ ...cardForm, title: e.target.value })
            }
            placeholder="Card title (required)"
            className="w-full p-2 border-2 border-dashed border-[#8b4513] theme-surface theme-text text-sm uppercase font-bold"
            autoFocus
          />
          <textarea
            value={cardForm.description}
            onChange={(e) =>
              setCardForm({ ...cardForm, description: e.target.value })
            }
            placeholder="Description (optional)"
            className="w-full p-2 border-2 border-dashed border-[#8b4513] theme-surface theme-text text-sm resize-none"
            rows={2}
          />
          <input
            type="date"
            value={cardForm.dueDate}
            onChange={(e) =>
              setCardForm({ ...cardForm, dueDate: e.target.value })
            }
            className="input-field text-sm"
          />
          <input
            type="text"
            value={cardForm.labels}
            onChange={(e) =>
              setCardForm({ ...cardForm, labels: e.target.value })
            }
            placeholder="Labels (comma separated)"
            className="input-field text-sm"
          />
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => createCard.mutate(cardForm)}
              disabled={!cardForm.title.trim()}
              className="btn-primary text-sm px-3 py-1.5 disabled:opacity-50"
            >
              Add Card
            </button>
            <button
              onClick={() => {
                setIsAddingCard(false);
                setCardForm({
                  title: "",
                  description: "",
                  dueDate: "",
                  labels: "",
                });
              }}
              className="btn-secondary text-sm px-2 py-1.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default function BoardPage() {
  const { id: boardID } = useParams();
  const queryClient = useQueryClient();
  const { isDark, mounted } = useThemeContext();
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarTab, setSidebarTab] = useState("activity");

  const { data: board } = useQuery({
    queryKey: ["board", boardID],
    queryFn: () =>
      apiConfig.get(`/api/v1/boards/${boardID}`).then((res) => res.data.data),
  });

  const { data: lists = [], isLoading } = useQuery({
    queryKey: ["lists", boardID],
    queryFn: () =>
      apiConfig
        .get(`/api/v1/lists/${boardID}/all-lists`)
        .then((res) => res.data.data)
        .catch(() => []),
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = lists.findIndex((l) => l._id === active.id);
    const newIndex = lists.findIndex((l) => l._id === over.id);
    const newOrder = arrayMove(lists, oldIndex, newIndex);

    queryClient.setQueryData(["lists", boardID], newOrder);

    apiConfig.patch(`/api/v1/lists/reorder-list`, {
      lists: newOrder.map((list, index) => ({ id: list._id, position: index })),
    });
  };

  const createList = useMutation({
    mutationFn: (title) =>
      apiConfig.post(`/api/v1/lists/${boardID}/create-list`, { title }),
    onSuccess: () => {
      queryClient.invalidateQueries(["lists", boardID]);
      setNewTitle("");
      setIsAdding(false);
    },
  });

  const isOwner = board?.owner?._id === board?.owner?._id;

  if (!mounted) return null;

  return (
    <div className="min-h-screen theme-bg transition-colors duration-300">
      <div className="min-h-[calc(100vh-64px)] relative">
        <div className="p-4 sm:p-6 border-b-2 border-dashed border-[#8b4513] theme-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div 
              className="w-6 h-12 border-2 border-dashed border-[#8b4513]"
              style={{ backgroundColor: board?.background || "#d48166" }}
            />
            <h1 className="text-3xl sm:text-4xl font-black theme-text uppercase tracking-tighter">{board?.title || "Loading..."}</h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowSearch(true)}
              className="btn-secondary p-2 text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
            >
              <Search size={14} /> <span className="hidden xs:inline">Search</span>
            </button>
            <button
              onClick={() => setShowMembers(true)}
              className="btn-secondary p-2 text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
            >
              <Users size={14} /> <span className="hidden sm:inline">Members</span>
            </button>
            <button
              onClick={() => setShowLabels(true)}
              className="btn-secondary p-2 text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
            >
              <Tag size={14} /> <span className="hidden sm:inline">Labels</span>
            </button>
            <button
              onClick={() => setShowArchive(true)}
              className="btn-secondary p-2 text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
            >
              <Archive size={14} /> <span className="hidden sm:inline">Archive</span>
            </button>
            <button
              onClick={() => setShowTemplates(true)}
              className="btn-secondary p-2 text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
            >
              <Layout size={14} /> <span className="hidden md:inline">Templates</span>
            </button>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`btn-secondary p-2 ${showSidebar ? 'bg-[#d48166] text-[#e6e2dd]' : ''}`}
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        <div className="flex">
          <div className="flex-1 p-4 sm:p-6 overflow-x-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={lists.map((l) => l._id)}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex gap-4 sm:gap-6 pb-4">
                  {isLoading ? (
                    <div className="leather-list p-4 min-w-[280px] sm:min-w-[320px] animate-pulse">
                      <div className="h-4 bg-[#d48166]/20 rounded mb-4" />
                      <div className="space-y-3">
                        <div className="h-20 bg-[#d48166]/10 rounded" />
                        <div className="h-20 bg-[#d48166]/10 rounded" />
                      </div>
                    </div>
                  ) : (
                    lists.map((list, index) => (
                      <div key={list._id} style={{ animationDelay: `${index * 100}ms` }}>
                        <SortableList
                          list={list}
                          boardID={boardID}
                          onCardClick={setSelectedCard}
                        />
                      </div>
                    ))
                  )}

                  {!isAdding ? (
                    <button
                      onClick={() => setIsAdding(true)}
                      className="leather-card theme-surface p-4 min-w-[280px] sm:min-w-[320px] h-fit flex items-center gap-3 hover:border-[#b86b52] animate-slide-up"
                    >
                      <Plus className="w-5 h-5 sm:w-6 sm:h-6 theme-text" />
                      <span className="theme-text font-semibold uppercase text-sm">Add a list</span>
                    </button>
                  ) : (
                    <div className="leather-list p-4 min-w-[280px] sm:min-w-[320px] h-fit animate-scale-in">
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newTitle.trim()) {
                            createList.mutate(newTitle);
                          }
                        }}
                        placeholder="Enter list title..."
                        className="input-field mb-3"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => createList.mutate(newTitle)}
                          disabled={!newTitle.trim()}
                          className="btn-primary text-sm disabled:opacity-50"
                        >
                          Add list
                        </button>
                        <button
                          onClick={() => {
                            setIsAdding(false);
                            setNewTitle("");
                          }}
                          className="btn-secondary p-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {showSidebar && (
            <div className="w-72 sm:w-80 leather-panel p-4 overflow-y-auto max-h-[calc(100vh-140px)] animate-slide-left">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setSidebarTab("activity")}
                  className={`flex-1 p-2 text-xs sm:text-sm font-semibold uppercase flex items-center justify-center gap-1 ${
                    sidebarTab === "activity"
                      ? "bg-[#d48166] text-[#e6e2dd] border-2 border-dashed border-[#b86b52]"
                      : "btn-secondary"
                  }`}
                >
                  <Activity size={14} /> Activity
                </button>
                <button
                  onClick={() => setSidebarTab("deadlines")}
                  className={`flex-1 p-2 text-xs sm:text-sm font-semibold uppercase flex items-center justify-center gap-1 ${
                    sidebarTab === "deadlines"
                      ? "bg-[#d48166] text-[#e6e2dd] border-2 border-dashed border-[#b86b52]"
                      : "btn-secondary"
                  }`}
                >
                  <Clock size={14} /> Deadlines
                </button>
              </div>

              {sidebarTab === "activity" && <ActivityLog boardID={boardID} />}
              {sidebarTab === "deadlines" && (
                <DeadlinesPanel boardID={boardID} />
              )}
            </div>
          )}
        </div>
      </div>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          boardID={boardID}
          onClose={() => setSelectedCard(null)}
        />
      )}

      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}

      {showMembers && (
        <BoardMembers
          boardID={boardID}
          isOwner={isOwner}
          onClose={() => setShowMembers(false)}
        />
      )}

      {showLabels && (
        <LabelsManager boardID={boardID} onClose={() => setShowLabels(false)} />
      )}

      {showArchive && (
        <ArchivePanel boardID={boardID} onClose={() => setShowArchive(false)} />
      )}

      {showTemplates && (
        <TemplatesModal
          boardID={boardID}
          onClose={() => setShowTemplates(false)}
          mode="save"
        />
      )}
    </div>
  );
}
