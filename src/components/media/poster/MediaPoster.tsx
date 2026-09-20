import type { CSSProperties, ImgHTMLAttributes, SourceHTMLAttributes } from "react";
import { usePlayer } from "@/state/PlayerContext";
import { setDataAttr } from "@/utils/dom";
import { DATA_ATTRS } from "@/constants";

type VisibleWhen = "pending" | "ended" | "both";

type MediaPosterProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src: string;
  alt: string;
  sources?: SourceHTMLAttributes<HTMLSourceElement>[];
  visibleWhen?: VisibleWhen;
};

export function MediaPoster({
  src,
  alt,
  sources,
  visibleWhen = "pending",
  className,
  style,
  ...imgProps
}: MediaPosterProps) {
  const visible = usePlayer((s) =>
    visibleWhen === "pending"
      ? !s.hasStarted
      : visibleWhen === "ended"
        ? s.isEnded
        : !s.hasStarted || s.isEnded,
  );

  const rootProps = {
    style: { ...style, ...defaultStyle },
    className,
    "aria-hidden": setDataAttr(!visible),
    [DATA_ATTRS.visible]: setDataAttr(visible),
  };

  if (!sources || sources.length === 0) {
    return <img src={src} alt={alt} {...rootProps} {...imgProps} />;
  }

  return (
    <picture {...rootProps}>
      {sources.map((source) => (
        <source key={`${source.media}-${source.srcSet}`} {...source} />
      ))}
      <img src={src} alt={alt} {...imgProps} />
    </picture>
  );
}

const defaultStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
};
