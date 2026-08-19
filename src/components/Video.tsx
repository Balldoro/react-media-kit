import { usePlayerCtx } from "../state/usePlayer";

interface VideoProps {
  src: string;
}

export function Video({ src }: VideoProps) {
  const { videoEl } = usePlayerCtx();

  return <video ref={videoEl} src={src} />;
}
