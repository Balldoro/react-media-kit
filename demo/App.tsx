import { PlayerProvider } from "stream-player";

const SAMPLE_SRC = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

export function App() {
  return (
    <div style={{ maxWidth: 640, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>stream-player demo</h1>
      <PlayerProvider>
        <video src={SAMPLE_SRC} style={{ width: "100%", height: "100%" }} />
      </PlayerProvider>
    </div>
  );
}
