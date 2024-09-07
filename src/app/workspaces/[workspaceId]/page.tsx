"use client";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useGetWorkspace({ id: workspaceId });
  if (isLoading) return null;
  return (
    <div>
      WorkspaceIdPage
      <div>Data: {JSON.stringify(data)}</div>
    </div>
  );
};

export default WorkspaceIdPage;
