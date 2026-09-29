import { act, type ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent } from "@testing-library/react";
import { Media } from "@/components/media";
import { TimeDisplay } from "@/components/timeDisplay";
import type { TimerMode } from "@/components/timeDisplay/TimeDisplayContext";
import { usePlayerControls } from "@/state/PlayerContext";
import {
  renderInPlayer,
  type RenderInPlayerOptions,
  itForwardsRef,
  itThrowsOutsidePlayerRoot,
  stubReadonly,
  dispatch,
} from "@/utils/tests";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

interface RenderTimerOptions extends RenderInPlayerOptions {
  initialMode?: TimerMode;
  extra?: ReactNode;
}

function renderTimer(
  props: Parameters<typeof TimeDisplay.Timer>[0] = {},
  { initialMode, extra, onError }: RenderTimerOptions = {},
) {
  const utils = renderInPlayer(
    <>
      <Media.Video />
      <TimeDisplay.Root initialMode={initialMode}>
        <TimeDisplay.Toggle aria-label="Toggle time">
          <TimeDisplay.Timer data-testid="timer" {...props} />
        </TimeDisplay.Toggle>
      </TimeDisplay.Root>
      {extra}
    </>,
    { onError },
  );
  return {
    ...utils,
    timer: utils.getByTestId("timer") as HTMLTimeElement,
    toggle: utils.getByRole("button", { name: "Toggle time" }),
  };
}

const loadMetadata = (video: HTMLVideoElement, duration: number) => {
  stubReadonly(video, "duration", duration);
  dispatch(video, "loadedmetadata");
};

const setCurrentTime = (video: HTMLVideoElement, time: number) => {
  video.currentTime = time;
  dispatch(video, "timeupdate");
};

function SeekButton({ time }: { time: number }) {
  const { seek } = usePlayerControls();
  return <button onClick={() => seek(time)}>Seek</button>;
}

describe("TimeDisplay.Timer", () => {
  it("renders a <time> showing 0:00 before metadata has loaded", () => {
    const { timer } = renderTimer();

    expect(timer.tagName).toBe("TIME");
    expect(timer.textContent).toBe("0:00");
    expect(timer.dateTime).toBe("PT0H0M0S");
  });

  it("shows the elapsed time with a matching ISO-8601 dateTime", () => {
    const { timer, video } = renderTimer();
    loadMetadata(video, 3700);

    setCurrentTime(video, 3665);

    expect(timer.textContent).toBe("1:01:05");
    expect(timer.dateTime).toBe("PT1H1M5S");
  });

  it('shows the remaining time prefixed with "-" in remaining mode', () => {
    const { timer, video } = renderTimer({}, { initialMode: "remaining" });
    loadMetadata(video, 120);

    setCurrentTime(video, 65);

    expect(timer.textContent).toBe("-0:55");
    expect(timer.dateTime).toBe("PT0H0M55S");
  });

  it("redraws immediately when the mode is toggled, without waiting for a media event", () => {
    const { timer, toggle, video } = renderTimer();
    loadMetadata(video, 120);
    setCurrentTime(video, 65);

    fireEvent.click(toggle);
    expect(timer.textContent).toBe("-0:55");

    fireEvent.click(toggle);
    expect(timer.textContent).toBe("1:05");
  });

  it("shows the target of a seek that is still in progress rather than media.currentTime", () => {
    const { timer, video, getByRole } = renderTimer({}, { extra: <SeekButton time={50} /> });
    loadMetadata(video, 120);
    setCurrentTime(video, 10);
    stubReadonly(video, "seeking", true);

    fireEvent.click(getByRole("button", { name: "Seek" }));

    expect(video.currentTime).toBe(10);
    expect(timer.textContent).toBe("0:50");
  });

  it("keeps ticking on its own while playing, and stops once paused", () => {
    vi.useFakeTimers();
    const { timer, video } = renderTimer();
    loadMetadata(video, 120);
    dispatch(video, "play");

    video.currentTime = 7;
    act(() => vi.advanceTimersByTime(300));
    expect(timer.textContent).toBe("0:07");

    dispatch(video, "pause");
    video.currentTime = 9;
    act(() => vi.advanceTimersByTime(300));
    expect(timer.textContent).toBe("0:07");
  });

  it("shows the elapsed time without a TimeDisplay.Root", () => {
    const { getByTestId, video } = renderInPlayer(
      <>
        <Media.Video />
        <TimeDisplay.Timer data-testid="timer" />
      </>,
    );
    loadMetadata(video, 120);
    setCurrentTime(video, 65);

    expect(getByTestId("timer").textContent).toBe("1:05");
  });

  itForwardsRef("time", (ref) => <TimeDisplay.Timer ref={ref} />);

  itThrowsOutsidePlayerRoot(<TimeDisplay.Timer />);
});
