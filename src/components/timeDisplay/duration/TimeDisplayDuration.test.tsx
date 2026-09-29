import { afterEach, describe, expect, it } from "vitest";
import { cleanup } from "@testing-library/react";
import { Media } from "@/components/media";
import { TimeDisplay } from "@/components/timeDisplay";
import { DATA_ATTRS } from "@/constants";
import {
  renderInPlayer,
  itForwardsRef,
  itThrowsOutsidePlayerRoot,
  stubReadonly,
  dispatch,
} from "@/utils/tests";

afterEach(cleanup);

const durationContent = (withMedia: boolean) => (
  <>
    {withMedia && <Media.Video />}
    <TimeDisplay.Root>
      <TimeDisplay.Duration data-testid="duration" />
    </TimeDisplay.Root>
  </>
);

function renderDuration() {
  const utils = renderInPlayer(durationContent(true));
  return { ...utils, duration: utils.getByTestId("duration") as HTMLTimeElement };
}

const loadMetadata = (video: HTMLVideoElement, duration: number) => {
  stubReadonly(video, "duration", duration);
  dispatch(video, "loadedmetadata");
};

describe("TimeDisplay.Duration", () => {
  it("renders a <time> showing 0:00 before metadata has loaded", () => {
    const { duration } = renderDuration();

    expect(duration.tagName).toBe("TIME");
    expect(duration.textContent).toBe("0:00");
    expect(duration.dateTime).toBe("PT0H0M0S");
    expect(duration.getAttribute(DATA_ATTRS.mediaPending)).toBe("true");
  });

  it.each([
    [65, "1:05", "PT0H1M5S"],
    [3605, "1:00:05", "PT1H0M5S"],
    [59.9, "0:59", "PT0H0M59S"],
  ])("formats a %ss duration as %s (dateTime %s)", (seconds, text, dateTime) => {
    const { duration, video } = renderDuration();

    loadMetadata(video, seconds);

    expect(duration.textContent).toBe(text);
    expect(duration.dateTime).toBe(dateTime);
  });

  it.each([Infinity, NaN])("falls back to 0:00 for a non-finite duration", (seconds) => {
    const { duration, video } = renderDuration();

    loadMetadata(video, seconds);

    expect(duration.textContent).toBe("0:00");
    expect(duration.dateTime).toBe("PT0H0M0S");
  });

  it("updates when the duration changes after metadata has loaded", () => {
    const { duration, video } = renderDuration();
    loadMetadata(video, 10);

    stubReadonly(video, "duration", 60);
    dispatch(video, "durationchange");

    expect(duration.textContent).toBe("1:00");
    expect(duration.dateTime).toBe("PT0H1M0S");
  });

  it("resets to 0:00 when the media element unmounts", () => {
    const { duration, video, rerenderInPlayer } = renderDuration();
    loadMetadata(video, 65);

    rerenderInPlayer(durationContent(false));

    expect(duration.textContent).toBe("0:00");
  });

  it("does not need a TimeDisplay.Root", () => {
    const { getByTestId } = renderInPlayer(<TimeDisplay.Duration data-testid="duration" />);

    expect(getByTestId("duration").textContent).toBe("0:00");
  });

  itForwardsRef("time", (ref) => <TimeDisplay.Duration ref={ref} />);

  itThrowsOutsidePlayerRoot(<TimeDisplay.Duration />);
});
