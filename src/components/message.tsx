import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns";

import Hint from "./hint";
import Thumbnail from "./thumbnail";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Rerender = dynamic(() => import("./rerender"), { ssr: false });

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  // reactions?: any;
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
  threadTimestamp?: number;
}

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
  threadTimestamp,
}: MessageProps) => {
  const avatarFallback = authorName.charAt(0).toUpperCase();
  const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
  };

  if (isCompact)
    return (
      <div className='flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative'>
        <div className='flex items-start gap-2'>
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className='text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-10 leading-[22px] text-center hover:underline'>
              {format(new Date(createdAt), "hh:mm")}
            </button>
          </Hint>
          <div className='flex flex-col w-full'>
            <Rerender value={body} />
            <Thumbnail url={image} />
            {updatedAt ? (
              <span className='text-xs text-muted-foreground'>(edited)</span>
            ) : null}
          </div>
        </div>
      </div>
    );

  return (
    <div className='flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative'>
      <div className='flex items-start gap-2'>
        <button>
          <Avatar>
            <AvatarImage alt={authorImage} src={authorImage} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </button>
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
        </div>
      </div>
    </div>
  );
};

export default Message;
