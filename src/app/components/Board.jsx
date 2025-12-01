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
      className="h-48 sm:h-52 p-4 sm:p-6 relative group border-2 border-dashed border-[#8b4513] hover:border-[#d48166] transition-all duration-300 hover:-translate-y-1"
      style={{ backgroundColor: color?.startsWith("#") ? color : `#${color}` }}
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-md line-clamp-2 mb-3">
            {title}
          </h2>
          {description && (
            <p className="text-sm sm:text-base text-white/90 mt-2 line-clamp-2 drop-shadow-sm font-medium">
              {description}
            </p>
          )}
        </div>
        
        <div className="mt-3 pt-3 border-t-2 border-dashed border-white/40">
          <div className="flex items-center gap-2 text-white group-hover:text-white transition-colors">
            <span className="text-sm sm:text-base font-bold uppercase tracking-wide">Open Board</span>
            <ArrowRight 
              size={18} 
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
