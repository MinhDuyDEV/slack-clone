"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HintProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

const Hint = ({ label, children, align, side }: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className='bg-black text-white'
        >
          <p className='font-medium text-xs'>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Hint;
