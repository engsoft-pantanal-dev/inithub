import { useEffect, useState } from "react";
import InitiativeHeader from "@/components/features/initiatives/InitiativeHeader";
import InitiativeContent from "@/components/features/initiatives/InitiativeContent";
import ProgressBar from "@/components/features/initiatives/ProgressBar";
import CommentsSection from "@/components/features/comments/CommentSection";
import ActionButtons from "./ActionButtons";
import type { Initiative } from "@/types/initiative";

interface InitiativeCardProps {
  initiative: Initiative;
  isManaged?: boolean;
  canEdit?: boolean;
  onEdit?: (initiative: Initiative) => void;
}

const InitiativeCard = ({ initiative, isManaged = false, canEdit = false, onEdit }: InitiativeCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [localInitiative, setLocalInitiative] = useState(initiative);

  useEffect(() => {
    setLocalInitiative(initiative);
  }, [initiative]);

  const handleEdit = () => {
    if (!onEdit) return;
    onEdit(localInitiative);
  };

  return (
    <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4">
        <InitiativeHeader initiative={initiative} />
        <InitiativeContent initiative={initiative} />
        <ProgressBar initiative={initiative} />

        {showComments && (
          <>
            <div className="pt-3 sm:pt-4 border-t border-gray-100">
              <CommentsSection
                initiative={localInitiative}
                onCommentAdded={(comment) => {
                  setLocalInitiative((prev) => ({
                    ...prev,
                    comments: [...prev.comments, comment],
                    commentsCount: (prev.commentsCount ?? 0) + 1,
                  }));
                }}
              />
            </div>
          </>
        )}
      </div>

      <ActionButtons 
        initiative={localInitiative} 
        onToggleComments={() => setShowComments(!showComments)}
        isManaged={isManaged}
        canEdit={canEdit}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default InitiativeCard;