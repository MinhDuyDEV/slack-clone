import { Loader } from "lucide-react";

import MessageList from "@/components/message-list";
import { useMemberId } from "@/hooks/use-member-id";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";

import ConversationHeader from "./conversation-header";
import ChatInputConversation from "./chat-input-conversation";
import { Id } from "../../../../../../convex/_generated/dataModel";

interface ConversationProps {
  id: Id<"conversations">;
}

const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();
  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  });
  const { results, status, loadMore } = useGetMessages({ conversationId: id });

  if (memberLoading || status === "LoadingFirstPage")
    return (
      <div className='flex items-center justify-center h-full'>
        <Loader className='size-5 animate-spin text-muted-foreground' />
      </div>
    );

  return (
    <div className='flex flex-col h-full'>
      <ConversationHeader
        memberImage={member?.user.image}
        memberName={member?.user.name}
        onClick={() => {}}
      />
      <MessageList
        data={results}
        variant='conversation'
        memberImage={member?.user.image}
        memberName={member?.user.name}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInputConversation
        conversationId={id}
        placeholder={`Message ${member?.user.name}`}
      />
    </div>
  );
};

export default Conversation;
