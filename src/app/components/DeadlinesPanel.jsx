"use client";
import { useQuery } from "@tanstack/react-query";
import apiConfig from "../../../api/axios.config";
import { Clock, AlertCircle, Calendar, Loader2 } from "lucide-react";

export default function DeadlinesPanel({ boardID }) {
  const { data, isLoading } = useQuery({
    queryKey: ["boardDeadlines", boardID],
    queryFn: () =>
      apiConfig
        .get(`/api/v1/reminders/board/${boardID}`)
        .then((res) => res.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#d48166]" />
      </div>
    );
  }

  const overdueCards = data?.categorized?.overdue || [];
  const upcomingCards = data?.categorized?.upcoming || [];

  const formatDueDate = (date) => {
    const dueDate = new Date(date);
    const now = new Date();
    const diffMs = dueDate - now;
    const diffDays = Math.ceil(diffMs / 86400000);

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `Due in ${diffDays} days`;
  };

  return (
    <div className="space-y-6">
      {overdueCards.length > 0 && (
        <div className="animate-slide-up">
          <h3 className="label-text flex items-center gap-2 mb-3 text-red-500">
            <AlertCircle size={14} /> Overdue ({overdueCards.length})
          </h3>
          <div className="space-y-2">
            {overdueCards.map((card, index) => (
              <div
                key={card._id}
                className="p-3 border-2 border-dashed border-red-500 bg-red-50 dark:bg-red-900/20 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <p className="font-semibold theme-text text-sm">{card.title}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-red-600">
                  <Clock size={12} />
                  {formatDueDate(card.dueDate)}
                </div>
                <p className="text-xs theme-text opacity-50 mt-1">
                  in {card.list?.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {upcomingCards.length > 0 && (
        <div className="animate-slide-up stagger-2">
          <h3 className="label-text flex items-center gap-2 mb-3">
            <Calendar size={14} /> Upcoming ({upcomingCards.length})
          </h3>
          <div className="space-y-2">
            {upcomingCards.map((card, index) => (
              <div
                key={card._id}
                className="p-3 leather-card animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <p className="font-semibold theme-text text-sm">{card.title}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-[#d48166]">
                  <Clock size={12} />
                  {formatDueDate(card.dueDate)}
                </div>
                <p className="text-xs theme-text opacity-50 mt-1">
                  in {card.list?.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {overdueCards.length === 0 && upcomingCards.length === 0 && (
        <p className="text-center theme-text py-8 opacity-60 text-sm">
          No cards with due dates in this board
        </p>
      )}
    </div>
  );
}
