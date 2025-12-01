"use client";
import { useQuery } from "@tanstack/react-query";
import apiConfig from "../../../api/axios.config";
import { Loader2, Clock } from "lucide-react";

const actionLabels = {
  board_created: "created this board",
  board_updated: "updated the board",
  board_archived: "archived this board",
  board_restored: "restored this board",
  list_created: "created list",
  list_updated: "updated list",
  list_archived: "archived list",
  list_restored: "restored list",
  list_deleted: "deleted list",
  list_reordered: "reordered lists",
  card_created: "created card",
  card_updated: "updated card",
  card_moved: "moved card",
  card_archived: "archived card",
  card_restored: "restored card",
  card_deleted: "deleted card",
  comment_added: "commented on",
  comment_edited: "edited a comment on",
  comment_deleted: "deleted a comment from",
  member_added: "added",
  member_removed: "removed",
  label_created: "created label",
  label_updated: "updated label",
  label_deleted: "deleted label",
  checklist_item_added: "added checklist item",
  checklist_item_completed: "completed",
  checklist_item_uncompleted: "uncompleted",
  checklist_item_deleted: "removed checklist item",
  attachment_added: "attached",
  attachment_deleted: "removed attachment",
  due_date_set: "set due date for",
  due_date_removed: "removed due date from",
};

export default function ActivityLog({ boardID }) {
  const { data, isLoading } = useQuery({
    queryKey: ["activity", boardID],
    queryFn: () =>
      apiConfig
        .get(`/api/v1/activity/board/${boardID}?limit=50`)
        .then((res) => res.data.data),
  });

  const formatTime = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now - activityDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return activityDate.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#d48166]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="label-text flex items-center gap-2">
        <Clock size={14} /> Activity
      </h3>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {data?.activities?.map((activity, index) => (
          <div
            key={activity._id}
            className="flex items-start gap-3 p-3 leather-card animate-slide-up"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#d48166] border-2 border-dashed border-[#b86b52] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {activity.user?.fullName?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="theme-text text-xs sm:text-sm">
                <span className="font-semibold">
                  {activity.user?.fullName || "User"}
                </span>{" "}
                {actionLabels[activity.action] || activity.action}
                {activity.targetTitle && (
                  <span className="font-semibold text-[#d48166]"> "{activity.targetTitle}"</span>
                )}
              </p>
              <p className="text-xs theme-text opacity-50 mt-1">
                {formatTime(activity.createdAt)}
              </p>
            </div>
          </div>
        ))}

        {data?.activities?.length === 0 && (
          <p className="text-center theme-text py-4 opacity-60 text-sm">No activity yet</p>
        )}
      </div>
    </div>
  );
}
