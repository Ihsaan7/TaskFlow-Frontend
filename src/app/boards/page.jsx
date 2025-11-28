"use client";
import useAuthStore from "@/store/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import apiConfig from "../../../api/axios.config";
import { Plus } from "lucide-react";

export default function () {
  const [description, setDescription] = useState("");
  const [background, setBackground] = useState("0079BF");
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  const { data, loading } = useQuery({
    queryKey: ["boards"],
    queryFn: () =>
      apiConfig.get("/api/v1/boards/all-boards").then((res) => res.data.data),
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
      setIsOpen(false);
      setTitle("");
      setDescription("");
      setBackground("0079BF");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && description.trim())
      createMutation.mutate({ title, description, background });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1>My Boards</h1>
        {loading ? (
          <p>Loading Boards....</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <button
              onClick={() => setIsOpen(true)}
              className="bg-gray-200 hover:bg-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer transition"
            >
              <div className="text-center">
                <Plus className="w-10 h-10 mx-auto mb-2 text-gray-600" />
                <p className="text-gray-700 font-medium">Create new board</p>
              </div>
            </button>

            {data?.map((board) => {
              return (
                <a
                  key={board._id}
                  href={`/board/${board._id}`}
                  className="rounded-lg h-32 flex items-end p-4 text-white font-bold text-lg shadow-lg hover:shadow-xl transition"
                  style={{ backgroundColor: board.background || "#0079BF" }}
                >
                  {board.title}
                </a>
              );
            })}
          </div>
        )}

        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-2xl font-bold mb-4">Create Board</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter board title..."
                  className="w-full p-3 border rounded-lg mb-4"
                  autoFocus
                />
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter board description..."
                  className="w-full p-3 border rounded-lg mb-4"
                />
                <input
                  type="text"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="Background color (e.g. #0079BF)"
                  className="w-full p-3 border rounded-lg mb-4"
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="bg-gray-300 px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
