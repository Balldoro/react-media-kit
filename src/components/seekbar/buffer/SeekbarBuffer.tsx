import { Progress } from "@/components/common/Progress";
import { type HTMLAttributes, type Ref } from "react";
import { CSS_VARS } from "@/constants";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";

export interface SeekbarBufferProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function SeekbarBuffer({ style, ...props }: SeekbarBufferProps) {
  const mediaDataAttrs = useMediaAttributes();

  return (
    <Progress
      progressVar={CSS_VARS.bufferPercent}
      style={{ zIndex: 1, ...style }}
      {...props}
      {...mediaDataAttrs}
    />
  );
}
