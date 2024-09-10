"use client";

import { useEffect, useState } from "react";

import CreateChannelModal from "@/features/channels/components/create-channel-modal";
import CreateWorkspaceModal from "@/features/workspaces/components/create-workspace-modal";

const Modals = () => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CreateWorkspaceModal />
      <CreateChannelModal />
    </>
  );
};

export default Modals;
