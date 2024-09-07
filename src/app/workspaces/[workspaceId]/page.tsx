interface WorkspaceIdPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceIdPage = ({ params }: WorkspaceIdPageProps) => {
  return (
    <div>
      WorkspaceIdPage
      <div>ID: {params.workspaceId}</div>
    </div>
  );
};

export default WorkspaceIdPage;
