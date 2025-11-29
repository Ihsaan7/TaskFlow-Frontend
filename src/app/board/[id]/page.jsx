"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import apiConfig from "../../../../api/axios.config";
import { Plus } from "lucide-react";

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

      <div className="flex gap-6 overflow-x-auto pb-4">
        {/* All Lists */}
        {loading ? (
          <p>Loading lists...</p>
        ) : (
          <div className="grid grid-cols-1 w-full sm:grid-cols-2 md:grid-cols-2 gap-4">
            {lists.map((list) => (
              <div
                key={list._id}
                className="bg-gray-800 rounded-lg p-4 min-w-80 min-h-30"
              >
                <h3 className="font-bold mb-3">{list.title}</h3>
                <div className="space-y-2">
                  {/* Cards will go here later */}
                  <p className="text-gray-500 text-sm">No cards yet</p>
                </div>
              </div>
            ))}
          </div>
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
          <div className="bg-white rounded-lg p-4 min-w-80">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && createList.mutate(newTitle)
              }
              placeholder="Enter list title..."
              className="w-full bg-gray-700 text-white p-3 rounded mb-3"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => createList.mutate(newTitle)}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
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
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
