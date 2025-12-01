"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiConfig from "../../../api/axios.config";
import { X, Search, Loader2, FileText, List, Layout } from "lucide-react";

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("");

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", query, searchType],
    queryFn: () =>
      apiConfig
        .get(`/api/v1/search?query=${encodeURIComponent(query)}${searchType ? `&type=${searchType}` : ""}`)
        .then((res) => res.data.data),
    enabled: query.length >= 2,
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 pt-10 sm:pt-20 px-4 animate-fade-in">
      <div className="leather-panel theme-surface w-full max-w-2xl animate-scale-in">
        <div className="p-3 sm:p-4 border-b-2 border-dashed border-[#d48166]/30 flex items-center gap-3">
          <Search size={20} className="text-[#d48166] flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search boards, lists, and cards..."
            className="flex-1 bg-transparent outline-none theme-text text-base sm:text-lg"
            autoFocus
          />
          <button onClick={onClose} className="theme-text hover:text-[#d48166] transition-colors flex-shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="p-3 sm:p-4 border-b-2 border-dashed border-[#d48166]/30 flex gap-1 sm:gap-2 overflow-x-auto">
          {["", "boards", "lists", "cards"].map((type) => (
            <button
              key={type}
              onClick={() => setSearchType(type)}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold uppercase whitespace-nowrap transition-all ${
                searchType === type
                  ? "bg-[#d48166] text-[#e6e2dd] border-2 border-dashed border-[#b86b52]"
                  : "theme-text border-2 border-dashed border-transparent hover:border-[#d48166]"
              }`}
            >
              {type || "All"}
            </button>
          ))}
        </div>

        <div className="max-h-80 sm:max-h-96 overflow-y-auto p-3 sm:p-4">
          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#d48166]" />
            </div>
          )}

          {!isLoading && query.length < 2 && (
            <p className="text-center theme-text py-8 text-sm sm:text-base opacity-60">
              Type at least 2 characters to search
            </p>
          )}

          {!isLoading && query.length >= 2 && results && (
            <div className="space-y-6">
              {results.results?.boards?.length > 0 && (
                <div className="animate-slide-up">
                  <h3 className="label-text flex items-center gap-2 mb-3">
                    <Layout size={14} /> Boards
                  </h3>
                  <div className="space-y-2">
                    {results.results.boards.map((board, index) => (
                      <a
                        key={board._id}
                        href={`/board/${board._id}`}
                        className="block p-3 leather-card hover:border-[#b86b52] animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={onClose}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 border-2 border-dashed border-[#d48166]/50 flex-shrink-0"
                            style={{ backgroundColor: board.background }}
                          />
                          <div className="min-w-0">
                            <p className="font-semibold theme-text text-sm truncate">
                              {board.title}
                            </p>
                            {board.description && (
                              <p className="text-xs theme-text opacity-50 truncate">
                                {board.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {results.results?.lists?.length > 0 && (
                <div className="animate-slide-up stagger-2">
                  <h3 className="label-text flex items-center gap-2 mb-3">
                    <List size={14} /> Lists
                  </h3>
                  <div className="space-y-2">
                    {results.results.lists.map((list, index) => (
                      <a
                        key={list._id}
                        href={`/board/${list.board?._id}`}
                        className="block p-3 leather-card hover:border-[#b86b52] animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={onClose}
                      >
                        <p className="font-semibold theme-text text-sm">{list.title}</p>
                        <p className="text-xs theme-text opacity-50">
                          in {list.board?.title}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {results.results?.cards?.length > 0 && (
                <div className="animate-slide-up stagger-3">
                  <h3 className="label-text flex items-center gap-2 mb-3">
                    <FileText size={14} /> Cards
                  </h3>
                  <div className="space-y-2">
                    {results.results.cards.map((card, index) => (
                      <a
                        key={card._id}
                        href={`/board/${card.board?._id}`}
                        className="block p-3 leather-card hover:border-[#b86b52] animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={onClose}
                      >
                        <p className="font-semibold theme-text text-sm">{card.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs theme-text opacity-50">
                          <span>in {card.list?.title}</span>
                          <span>•</span>
                          <span>{card.board?.title}</span>
                        </div>
                        {card.labels?.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {card.labels.slice(0, 3).map((label, idx) => (
                              <span
                                key={idx}
                                className="bg-[#d48166] text-white text-xs px-2 py-0.5 border border-dashed border-[#b86b52]"
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {results.totalResults === 0 && (
                <p className="text-center theme-text py-8 opacity-60">
                  No results found for "{query}"
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
