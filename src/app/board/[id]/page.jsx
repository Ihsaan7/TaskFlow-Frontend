"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import apiConfig from "../../../../api/axios.config";
import { Plus, X } from "lucide-react";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableCard({ card }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-700 rounded p-3 mb-2 cursor-grab active:cursor-grabbing hover:bg-gray-600"
    >
      <p className="text-white text-sm font-medium">{card.title}</p>
      {card.description && (
        <p className="text-gray-400 text-xs mt-1">{card.description}</p>
      )}
      {card.labels && card.labels.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {card.labels.map((label, idx) => (
            <span
              key={idx}
              className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded"
            >
              {label}
            </span>
          ))}
        </div>
      )}
      {card.dueDate && (
        <p className="text-gray-400 text-xs mt-1">
          Due: {new Date(card.dueDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

function SortableList({ list, boardID }) {
  const queryClient = useQueryClient();
  const [isAddingCard, setIsAddingCard] = useState(false);
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-800 rounded-lg p-4 min-w-80 max-w-80"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing mb-3"
      >
        <h3 className="font-bold text-white">{list.title}</h3>
      </div>

      <div style={{ marginBottom: "12px" }}>
        {cards.length > 0 ? (
          cards.map((card) => <Card key={card._id} card={card} />)
        ) : (
          <p
            style={{
              color: "#888",
              fontSize: "12px",
              border: "1px solid #ccc",
              padding: "4px",
            }}
          >
            No cards yet
          </p>
        )}
      </div>

      {!isAddingCard ? (
        <button
          onClick={() => setIsAddingCard(true)}
          className="w-full text-left text-gray-400 hover:text-white text-sm flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
        >
          <Plus className="w-4 h-4" />
          Add a card
        </button>
      ) : (
        <div className="bg-gray-700 rounded p-3 space-y-2">
          <input
            type="text"
            value={cardForm.title}
            onChange={(e) =>
              setCardForm({ ...cardForm, title: e.target.value })
            }
            placeholder="Card title (required)"
            className="w-full bg-gray-600 text-white p-2 rounded text-sm"
            autoFocus
          />
          <textarea
            value={cardForm.description}
            onChange={(e) =>
              setCardForm({ ...cardForm, description: e.target.value })
            }
            placeholder="Description (optional)"
            className="w-full bg-gray-600 text-white p-2 rounded text-sm resize-none"
            rows={2}
          />
          <input
            type="date"
            value={cardForm.dueDate}
            onChange={(e) =>
              setCardForm({ ...cardForm, dueDate: e.target.value })
            }
            className="w-full bg-gray-600 text-white p-2 rounded text-sm"
          />
          <input
            type="text"
            value={cardForm.labels}
            onChange={(e) =>
              setCardForm({ ...cardForm, labels: e.target.value })
            }
            placeholder="Labels (comma separated)"
            className="w-full bg-gray-600 text-white p-2 rounded text-sm"
          />
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => createCard.mutate(cardForm)}
              disabled={!cardForm.title.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-3 py-1 rounded text-sm"
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
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default function BoardPage() {
  const { id: boardID } = useParams();
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const { data: board } = useQuery({
    queryKey: ["board", boardID],
    queryFn: () =>
      apiConfig.get(`/api/v1/boards/${boardID}`).then((res) => res.data.data),
  });

  const { data: lists = [], loading } = useQuery({
    queryKey: ["lists", boardID],
    queryFn: () =>
      apiConfig
        .get(`/api/v1/lists/${boardID}/all-lists`)
        .then((res) => res.data.data),
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

    // Update UI instantly
    queryClient.setQueryData(["lists", boardID], newOrder);

    // Send new order to backend
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

  return (
    <div
      className="min-h-screen text-white p-8"
      style={{ backgroundColor: board?.background || "#0079BF" }}
    >
      <h1 className="text-4xl font-bold mb-8">
        {board?.title || "Loading..."}
      </h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={lists.map((l) => l._id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-6 overflow-x-auto pb-4">
            {loading ? (
              <p>Loading lists...</p>
            ) : (
              lists.map((list) => (
                <SortableList key={list._id} list={list} boardID={boardID} />
              ))
            )}

            {/* Add List Button */}
            {!isAdding ? (
              <button
                onClick={() => setIsAdding(true)}
                className="bg-black bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 min-w-80 flex items-center gap-3"
              >
                <Plus className="w-6 h-6" />
                <span>Add a list</span>
              </button>
            ) : (
              <div className="bg-gray-800 rounded-lg p-4 min-w-80">
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
                  className="w-full bg-gray-700 text-white p-3 rounded mb-3"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => createList.mutate(newTitle)}
                    disabled={!newTitle.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded"
                  >
                    Add list
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewTitle("");
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
