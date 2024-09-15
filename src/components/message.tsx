import { toast } from "sonner";
import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns";

import { cn } from "@/lib/utils";
import { usePanel } from "@/hooks/use-panel";
import { useConfirm } from "@/hooks/use-confirm";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";

import Hint from "./hint";
import Toolbar from "./toolbar";
import Thumbnail from "./thumbnail";
import Reactions from "./reactions";
import ThreadBar from "./thread-bar";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Editor = dynamic(() => import("./editor"), { ssr: false });
const Rerender = dynamic(() => import("./rerender"), { ssr: false });

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions?: Array<
    Omit<Doc<"reactions">, "memberIds"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  isCompact?: boolean;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadName?: string;
  threadTimestamp?: number;
}

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};

const Message = ({
  id,
  body,
  createdAt,
  image,
  isAuthor,
  isEditing,
  memberId,
  setEditingId,
  updatedAt,
  authorImage,
  authorName = "Member",
  hideThreadButton,
  isCompact,
  reactions,
  threadCount,
  threadImage,
  threadName,
  threadTimestamp,
}: MessageProps) => {
  const { parentMessageId, onOpenMessage, onCloseMessage } = usePanel();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete message",
    "Are you sure you want to delete this message? This cannot be undone."
  );
  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();
  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMessage();
  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction();

  const isPending =
    isUpdatingMessage || isRemovingMessage || isTogglingReaction;

  const handleReaction = (value: string) => {
    toggleReaction(
      {
        messageId: id,
        value,
      },
      { onError: () => toast.error("Failed to toggle reaction") }
    );
  };

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { messageId: id, body },
      {
        onSuccess: () => {
          toast.success("Message updated");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to update message");
        },
      }
    );
  };

  const handleRemove = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeMessage(
      { messageId: id },
      {
        onSuccess: () => {
          toast.success("Message deleted");
          if (parentMessageId === id) onCloseMessage();
        },
        onError: () => toast.error("Failed to delete message"),
      }
    );
  };

  const avatarFallback = authorName.charAt(0).toUpperCase();
  if (isCompact)
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-[#F2C74433] hover:bg-[#F2C74433]",
            isRemovingMessage &&
              "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
          )}
        >
          <div className='flex items-start gap-2'>
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className='text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-10 leading-[22px] text-center hover:underline'>
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </Hint>
            {isEditing ? (
              <div className='w-full h-full'>
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant='update'
                />
              </div>
            ) : (
              <div className='flex flex-col w-full'>
                <Rerender value={body} />
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className='text-xs text-muted-foreground'>
                    (edited)
                  </span>
                ) : null}
                <Reactions data={reactions || []} onChange={handleReaction} />
                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  name={threadName}
                  timestamp={threadTimestamp}
                  onClick={() => onOpenMessage(id)}
                />
              </div>
            )}
          </div>
          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleRemove}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#F2C74433] hover:bg-[#F2C74433]",
          isRemovingMessage &&
            "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
        )}
      >
        <div className='flex items-start gap-2'>
          <button>
            <Avatar>
              <AvatarImage alt={authorImage} src={authorImage} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className='w-full h-full'>
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant='update'
              />
            </div>
          ) : (
            <div className='flex flex-col w-full overflow-hidden'>
              <div className='text-sm'>
                <button
                  onClick={() => {}}
                  className='font-bold text-primary hover:underline'
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className='text-xs text-muted-foreground hover:underline'>
                    {format(new Date(createdAt), "h:mm a")}
                  </button>
                </Hint>
              </div>
              <Rerender value={body} />
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className='text-xs text-muted-foreground'>(edited)</span>
              ) : null}
              <Reactions data={reactions || []} onChange={handleReaction} />
              <ThreadBar
                count={threadCount}
                image={threadImage}
                name={threadName}
                timestamp={threadTimestamp}
                onClick={() => onOpenMessage(id)}
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleRemove}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};

export default Message;
