import paths from "@/utils/paths";
import { Eye, LockSimple, CaretUp, CaretDown } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { useState } from "react";
import CommunityHub from "@/models/communityHub";
import showToast from "@/utils/toast";
import HubItemModal from "@/components/CommunityHub/HubItemModal";

const CATEGORY_COLORS = {
  "Productivity": "bg-blue-500/20 text-blue-400",
  "Development": "bg-green-500/20 text-green-400",
  "Creative Writing": "bg-purple-500/20 text-purple-400",
  "Data Analysis": "bg-orange-500/20 text-orange-400",
  "Business": "bg-yellow-500/20 text-yellow-400",
  "Education": "bg-pink-500/20 text-pink-400",
  "Language": "bg-cyan-500/20 text-cyan-400",
  "General": "bg-gray-500/20 text-gray-400",
};

export default function GenericHubCard({ item, type }) {
  const categoryColor = CATEGORY_COLORS[item.category] || CATEGORY_COLORS["General"];
  const [rating, setRating] = useState(item.rating || 0);
  const [ratingCount, setRatingCount] = useState(item.ratingCount || 0);
  const [userVote, setUserVote] = useState(item.userVote || 0);
  const [isVoting, setIsVoting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVote = async (vote) => {
    if (isVoting) return;
    setIsVoting(true);

    try {
      const finalVote = userVote === vote ? 0 : vote;
      const { success, item: updatedItem, error } = await CommunityHub.voteItem(type, item.id, finalVote);
      
      if (success && updatedItem) {
        setRating(updatedItem.rating || 0);
        setRatingCount(updatedItem.ratingCount || 0);
        setUserVote(updatedItem.userVote || 0);
      } else {
        showToast(error || "Failed to vote", "error");
      }
    } catch (e) {
      showToast("Failed to vote", "error");
    } finally {
      setIsVoting(false);
    }
  };

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        key={item.id}
        onClick={handleCardClick}
        className="bg-zinc-800 light:bg-slate-100 rounded-lg p-3 hover:bg-zinc-700 light:hover:bg-slate-200 transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-white text-sm font-medium flex-1">{item.name}</p>
          {item.category && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${categoryColor}`}>
              {item.category}
            </span>
          )}
        </div>
        <p className="text-white/60 text-xs mt-1">{item.description}</p>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); handleVote(1); }}
              disabled={isVoting}
              className={`p-1 rounded transition-colors ${
                userVote === 1 ? "text-green-400 bg-green-500/20" : "text-white/40 hover:text-green-400 hover:bg-green-500/10"
              } ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <CaretUp size={16} weight="bold" />
            </button>
            
            <span className={`text-sm font-semibold min-w-[1.5rem] text-center ${
              rating > 0 ? "text-green-400" : rating < 0 ? "text-red-400" : "text-white/60"
            }`}>
              {rating > 0 ? `+${rating}` : rating}
            </span>
            
            <button
              onClick={(e) => { e.stopPropagation(); handleVote(-1); }}
              disabled={isVoting}
              className={`p-1 rounded transition-colors ${
                userVote === -1 ? "text-red-400 bg-red-500/20" : "text-white/40 hover:text-red-400 hover:bg-red-500/10"
              } ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <CaretDown size={16} weight="bold" />
            </button>
            
            {ratingCount > 0 && (
              <span className="text-[10px] text-white/40 ml-1">
                ({ratingCount} {ratingCount === 1 ? 'vote' : 'votes'})
              </span>
            )}
          </div>

          <Link
            onClick={(e) => e.stopPropagation()}
            className="text-primary-button hover:text-primary-button/80 text-xs"
            to={paths.communityHub.importItem(item.importId)}
          >
            Import →
          </Link>
        </div>
      </div>

      <HubItemModal
        item={{...item, rating, ratingCount}}
        type={type}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export function VisibilityIcon({ visibility = "public" }) {
  const Icon = visibility === "private" ? LockSimple : Eye;

  return (
    <>
      <div
        data-tooltip-id="visibility-icon"
        data-tooltip-content={`This item is ${visibility === "private" ? "private" : "public"}`}
      >
        <Icon className="w-4 h-4 text-white/60" />
      </div>
      <Tooltip
        id="visibility-icon"
        place="top"
        delayShow={300}
        className="allm-tooltip !allm-text-xs"
      />
    </>
  );
}
