import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent } from "@testing-library/react";
import { Media } from "@/components/media";
import { SkipButton } from "@/components/skipButton";
import { DATA_ATTRS } from "@/constants";
import { ReactMediaKitError } from "@/utils/errors";
import {
  renderInPlayer,
  itAllowsAriaLabelOverride,
  itForwardsRef,
  itThrowsOutsidePlayerRoot,
  stubReadonly,
  dispatch,
} from "@/utils/tests";

afterEach(cleanup);

type SkipButtonProps = Parameters<typeof SkipButton.Root>[0];

function renderSkipButton(props: SkipButtonProps) {
  const utils = renderInPlayer(
    <>
      <Media.Video />
      <SkipButton.Root {...props} />
    </>,
  );
  return { ...utils, button: utils.getByRole("button") };
}

const loadMetadata = (video: HTMLVideoElement, duration: number) => {
  stubReadonly(video, "duration", duration);
  dispatch(video, "loadedmetadata");
};

describe("SkipButton.Root", () => {
  describe("labelling", () => {
    it.each([
      ["back", 10, "Skip back 10 seconds"],
      ["back", 3600, "Skip back 1 hour"],
      ["forward", 2.9, "Skip forward 2 seconds"],
      ["forward", 90.5, "Skip forward 1 minute and 30 seconds"],
    ] as const)("direction=%s, skipInterval=%s -> %s", (direction, skipInterval, label) => {
      const { button } = renderSkipButton({ direction, skipInterval });

      expect(button.getAttribute("aria-label")).toBe(label);
    });

    itAllowsAriaLabelOverride((label) => (
      <SkipButton.Root direction="forward" aria-label={label} />
    ));
  });

  describe("skipInterval validation", () => {
    it.each([0, 0.99, -10, NaN])(
      "throws a ReactMediaKitError for skipInterval=%s",
      (skipInterval) => {
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
        try {
          expect(() => renderSkipButton({ direction: "forward", skipInterval })).toThrow(
            ReactMediaKitError,
          );
        } finally {
          consoleError.mockRestore();
        }
      },
    );
  });

  it("exposes the direction as a data attribute", () => {
    const { button } = renderSkipButton({ direction: "back" });

    expect(button.getAttribute(DATA_ATTRS.direction)).toBe("back");
  });

  it("does not leak its own props onto the DOM element", () => {
    const { button } = renderSkipButton({ direction: "forward", skipInterval: 10 });

    expect(button.hasAttribute("direction")).toBe(false);
    expect(button.hasAttribute("skipinterval")).toBe(false);
  });

  describe("seeking", () => {
    it("skips by the default interval", () => {
      const { button, video } = renderSkipButton({ direction: "forward" });
      loadMetadata(video, 120);
      video.currentTime = 10;

      fireEvent.click(button);

      expect(video.currentTime).toBe(15);
    });

    it("uses a custom skipInterval", () => {
      const { button, video } = renderSkipButton({ direction: "forward", skipInterval: 30 });
      loadMetadata(video, 120);
      video.currentTime = 10;

      fireEvent.click(button);

      expect(video.currentTime).toBe(40);
    });

    it("floors a decimal skipInterval to a whole second, matching its label", () => {
      const { button, video } = renderSkipButton({ direction: "forward", skipInterval: 2.65 });
      loadMetadata(video, 120);
      video.currentTime = 10;

      fireEvent.click(button);

      expect(video.currentTime).toBe(12);
    });

    it("clamps a forward skip to the media duration", () => {
      const { button, video } = renderSkipButton({ direction: "forward" });
      loadMetadata(video, 120);
      video.currentTime = 118;

      fireEvent.click(button);

      expect(video.currentTime).toBe(120);
    });

    it("clamps a back skip to 0", () => {
      const { button, video } = renderSkipButton({ direction: "back" });
      loadMetadata(video, 120);
      video.currentTime = 2;

      fireEvent.click(button);

      expect(video.currentTime).toBe(0);
    });

    it("accumulates rapid consecutive clicks without waiting for a timeupdate", () => {
      const { button, video } = renderSkipButton({ direction: "forward" });
      loadMetadata(video, 120);
      video.currentTime = 10;

      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(video.currentTime).toBe(25);
    });
  });

  it("runs the consumer onClick before skipping", () => {
    let timeSeenByConsumer: number | null = null;
    const { button, video } = renderSkipButton({
      direction: "forward",
      onClick: () => {
        timeSeenByConsumer = video.currentTime;
      },
    });
    loadMetadata(video, 120);
    video.currentTime = 10;

    fireEvent.click(button);

    expect(timeSeenByConsumer).toBe(10);
    expect(video.currentTime).toBe(15);
  });

  it("skips nothing when the consumer onClick calls preventDefault()", () => {
    const { button, video } = renderSkipButton({
      direction: "forward",
      onClick: (e) => e.preventDefault(),
    });
    loadMetadata(video, 120);
    video.currentTime = 10;

    fireEvent.click(button);

    expect(video.currentTime).toBe(10);
  });

  itForwardsRef("button", (ref) => <SkipButton.Root direction="forward" ref={ref} />);

  itThrowsOutsidePlayerRoot(<SkipButton.Root direction="forward" />);
});
