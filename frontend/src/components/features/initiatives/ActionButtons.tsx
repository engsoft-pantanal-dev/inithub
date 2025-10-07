import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Heart, MessageCircle, Share2, Settings } from "lucide-react";
import { initiativesService } from "@/services/initiatives";
import { useAuth } from "@/hooks/useAuth"; 
import { getLikeButtonStyles } from "@/utils/functions/functionsInitiative";
import type { Initiative } from "@/types/initiative";

interface ActionButtonsProps {
  initiative: Initiative;
  onToggleComments: () => void;
  isManaged?: boolean;
}

const ActionButtons = ({ initiative, onToggleComments, isManaged = false }: ActionButtonsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  
  const userId = user ? user.id : null;

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initiative.likes.length ?? 0);

  useEffect(() => {
    if (userId) {
      const isLiked = initiative.likes.some(l => l.userId === userId);
      setLiked(isLiked);
    }
    setLikesCount(initiative.likes.length ?? 0);
  }, [initiative.likes, userId]);

  const handleProgressClick = () => {
    navigate(`/initiatives/${initiative.id}/progress`);
  };

  const handleLikeClick = () => {
    // Garante que apenas usuários logados possam curtir
    if (!userId) {
      alert("Você precisa estar logado para curtir uma iniciativa.");
      return;
    }

    if (liked) {
      setLiked(false);
      setLikesCount(c => Math.max(0, c - 1));
      initiativesService.unlikeInitiative(initiative.id, userId).catch((err) => {
        console.warn('Failed to unlike initiative, reverting', err);
        setLiked(true);
        setLikesCount(c => c + 1);
      });
    } else {
      setLiked(true);
      setLikesCount(c => c + 1);
      initiativesService.likeInitiative(initiative.id, userId).catch((err) => {
        console.warn('Failed to like initiative, reverting', err);
        setLiked(false);
        setLikesCount(c => Math.max(0, c - 1));
      });
    }
  };

  return (
    <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-6">
            <button
                className={getLikeButtonStyles(liked)}
                onClick={handleLikeClick}
            >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                <span className="text-sm">{likesCount}</span>
            </button>

            <button 
                onClick={onToggleComments}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{initiative.comments.length}</span>
            </button>

            <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="text-sm hidden md:inline">Compartilhar</span>
            </button>
        </div>

        {initiative.status === "IN_EXECUTION" && (
            <button 
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 font-medium text-sm transition-colors"
                onClick={handleProgressClick}
            >
                {isManaged ? (
                    <>
                        <span>Gerenciar</span>
                        <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                    </>
                ) : (
                    <>
                        <span>Progresso</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </>
                )}
            </button>
        )}
    </div>
  );
};

export default ActionButtons;