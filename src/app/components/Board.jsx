"use client";
import { Trash2, Archive, ArrowRight } from "lucide-react";

export default function BoardCard({ title, description, color, onDelete, onArchive, boardId }) {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(boardId);
    }
  };

  const handleArchive = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onArchive) {
      onArchive(boardId);
    }
  };

  return (
    <div
      className="h-36 sm:h-40 p-3 sm:p-4 relative group border-2 border-[#3d362f] dark:border-[#5a4d42] hover:border-[#d48166] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ backgroundColor: color?.startsWith("#") ? color : `#${color}` }}
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white heading-bold drop-shadow-md line-clamp-1">
            {title}
          </h2>
          {description && (
            <p className="text-xs sm:text-sm text-white/80 mt-1 line-clamp-2 drop-shadow-sm">
              {description}
            </p>
          )}
        </div>
        
        <div className="mt-2 pt-2 border-t border-dashed border-white/30">
          <div className="flex items-center gap-1 text-white/90 group-hover:text-white transition-colors">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide">Open Board</span>
            <ArrowRight 
              size={14} 
              className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" 
            />
          </div>
        </div>
      </div>
      
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-y-0 translate-y-1">
        {onArchive && (
          <button
            onClick={handleArchive}
            className="p-1.5 sm:p-2 bg-[#d48166]/90 text-white hover:bg-[#b86b52] border border-dashed border-[#b86b52] transition-all hover:scale-105"
            title="Archive board"
          >
            <Archive size={14} className="sm:w-4 sm:h-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={handleDelete}
            className="p-1.5 sm:p-2 bg-[#8b4513]/90 text-white hover:bg-[#6b3410] border border-dashed border-[#6b3410] transition-all hover:scale-105"
            title="Delete board"
          >
            <Trash2 size={14} className="sm:w-4 sm:h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
