import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";

import { useMemberId } from "@/hooks/use-member-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";

import UserItem from "./user-item";
import SidebarItem from "./sidebar-item";
import WorkspaceHeader from "./workspace-header";
import WorkspaceSection from "./workspace-section";

const WorkspaceSidebar = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const [_open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });
  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  });

  if (memberLoading || workspaceLoading)
    return (
      <div className='flex flex-col bg-[#5E2C5F] h-full items-center justify-center'>
        <Loader className='size-5 animate-spin text-white' />
      </div>
    );
  if (!member || !workspace)
    return (
      <div className='flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center'>
        <AlertTriangle className='size-5 text-white' />
        <p className='text-white text-sm'>Workspace not found</p>
      </div>
    );

  return (
    <div className='flex flex-col bg-[#5E2C5F] h-full'>
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className='flex flex-col px-2 mt-3'>
        <SidebarItem label='Threads' icon={MessageSquareText} id='threads' />
        <SidebarItem label='Drafts & Sent' icon={SendHorizonal} id='drafts' />
      </div>
      <WorkspaceSection
        label='Channels'
        hint='New channel'
        onNew={member.role === "admin" ? () => setOpen(true) : undefined}
      >
        {channels?.map((channel) => (
          <SidebarItem
            key={channel._id}
            icon={HashIcon}
            label={channel.name}
            id={channel._id}
            variant={channelId === channel._id ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection
        label='Direct messages'
        hint='New direct message'
        onNew={() => {}}
      >
        {members?.map((member) => (
          <UserItem
            key={member._id}
            id={member._id}
            image={member.user.image}
            label={member.user.name}
            variant={memberId === member._id ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};

export default WorkspaceSidebar;
