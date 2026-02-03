import { Link } from "react-router-dom";
import paths from "@/utils/paths";
import pluralize from "pluralize";
import { VisibilityIcon } from "./generic";
import { CaretUp, CaretDown } from "@phosphor-icons/react";
import { useState } from "react";
import CommunityHub from "@/models/communityHub";
import showToast from "@/utils/toast";

export default function AgentSkillHubCard({ item, type }) {
  const [rating, setRating] = useState(item.rating || 0);
  const [ratingCount, setRatingCount] = useState(item.ratingCount || 0);
  const [userVote, setUserVote] = useState(item.userVote || 0);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (vote) => {
    if (isVoting) return;
    setIsVoting(true);

    try {
      // If clicking the same vote, remove it (toggle off)
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

  return (
    <>
      <div
        key={item.id}
        className="bg-black/70 light:bg-slate-100 rounded-lg p-3 hover:bg-black/60 light:hover:bg-slate-200 transition-all duration-200 cursor-pointer group border border-transparent hover:border-slate-400"
      >
        <div className="flex gap-x-2 items-center">
          <p className="text-white text-sm font-medium">{item.name}</p>
          <VisibilityIcon visibility={item.visibility} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-white/60 text-xs mt-1">{item.description}</p>

          <p className="font-mono text-xs mt-1 text-white/60">
            {item.verified ? (
              <span className="text-green-500">Verified</span>
            ) : (
              <span className="text-red-500">Unverified</span>
            )}{" "}
            Skill
          </p>
          <p className="font-mono text-xs mt-1 text-white/60">
            {item.manifest.files?.length || 0}{" "}
            {pluralize("file", item.manifest.files?.length || 0)} found
          </p>
        </div>
        <div className="flex items-center justify-between mt-3">
          {/* Rating/Voting */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleVote(1)}
              disabled={isVoting}
              className={`p-1 rounded transition-colors ${
                userVote === 1
                  ? "text-green-400 bg-green-500/20"
                  : "text-white/40 hover:text-green-400 hover:bg-green-500/10"
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
              onClick={() => handleVote(-1)}
              disabled={isVoting}
              className={`p-1 rounded transition-colors ${
                userVote === -1
                  ? "text-red-400 bg-red-500/20"
                  : "text-white/40 hover:text-red-400 hover:bg-red-500/10"
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
            to={paths.communityHub.importItem(item.importId)}
            className="text-primary-button hover:text-primary-button/80 text-sm font-medium px-3 py-1.5 rounded-md bg-black/30 light:bg-slate-200 group-hover:bg-black/50 light:group-hover:bg-slate-300 transition-all"
          >
            Import →
          </Link>
        </div>
      </div>
    </>
  );
}
