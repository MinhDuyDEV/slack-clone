import { useState } from "react";
import { AlertTriangle, Loader, XIcon } from "lucide-react";

import Message from "@/components/message";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";

import { useGetMessage } from "../api/use-get-message";
import { Id } from "../../../../convex/_generated/dataModel";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkspaceId();
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: loadingMessage } = useGetMessage({
    id: messageId,
  });

  if (loadingMessage || !message)
    return (
      <div className='h-full flex flex-col'>
        <div className='flex justify-between items-center h-[49px] px-4 border-b'>
          <p className='text-lg font-bold'>Thread</p>
          <Button onClick={onClose} size='iconSm' variant='ghost'>
            <XIcon className='size-5 stroke-[1.5]' />
          </Button>
        </div>
        {loadingMessage ? (
          <div className='flex items-center justify-center h-full'>
            <Loader className='size-5 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <div className='flex flex-col gap-y-2 items-center justify-center h-full'>
            <AlertTriangle className='size-5 text-muted-foreground' />
            <p className='text-sm text-muted-foreground'>Message not found</p>
          </div>
        )}
      </div>
    );

  return (
    <div className='h-full flex flex-col'>
      <div className='flex justify-between items-center h-[49px] px-4 border-b'>
        <p className='text-lg font-bold'>Thread</p>
        <Button onClick={onClose} size='iconSm' variant='ghost'>
          <XIcon className='size-5 stroke-[1.5]' />
        </Button>
      </div>
      <div className=''>
        <Message
          hideThreadButton
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        />
      </div>
    </div>
  );
};

export default Thread;
