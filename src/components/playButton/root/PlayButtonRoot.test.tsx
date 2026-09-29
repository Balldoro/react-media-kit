import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent } from "@testing-library/react";
import { Media } from "@/components/media";
import { PlayButton } from "@/components/playButton";
import { DATA_ATTRS } from "@/constants";
import {
  renderInPlayer,
  type RenderInPlayerOptions,
  itAllowsAriaLabelOverride,
  itForwardsRef,
  itThrowsOutsidePlayerRoot,
  dispatch,
} from "@/utils/tests";

afterEach(cleanup);

function renderPlayButton(
  props: Parameters<typeof PlayButton.Root>[0] = {},
  { onError }: RenderInPlayerOptions = {},
) {
  const utils = renderInPlayer(
    <>
      <Media.Video />
      <PlayButton.Root {...props} />
    </>,
    { onError },
  );
  const button = utils.getByRole("button");
  const playSpy = vi.spyOn(utils.video, "play").mockResolvedValue(undefined);
  const pauseSpy = vi.spyOn(utils.video, "pause").mockImplementation(() => {});
  return { ...utils, button, playSpy, pauseSpy };
}

const playerContent = (withMedia: boolean) => (
  <>
    {withMedia && <Media.Video />}
    <PlayButton.Root />
  </>
);

describe("PlayButton.Root", () => {
  it("renders a non-submitting button labelled 'Play video' with no data-playing attribute initially", () => {
    const { button } = renderPlayButton();

    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("aria-label")).toBe("Play video");
    expect(button.hasAttribute(DATA_ATTRS.playing)).toBe(false);
    expect(button.getAttribute(DATA_ATTRS.mediaPending)).toBe("true");
  });

  it("calls play() on click while paused", () => {
    const { button, playSpy, pauseSpy } = renderPlayButton();

    fireEvent.click(button);

    expect(playSpy).toHaveBeenCalledTimes(1);
    expect(pauseSpy).not.toHaveBeenCalled();
  });

  it("reflects the media 'play' event and pauses on the next click", () => {
    const { button, video, playSpy, pauseSpy } = renderPlayButton();

    dispatch(video, "play");
    expect(button.getAttribute("aria-label")).toBe("Pause video");
    expect(button.getAttribute(DATA_ATTRS.playing)).toBe("true");

    fireEvent.click(button);
    expect(pauseSpy).toHaveBeenCalledTimes(1);
    expect(playSpy).not.toHaveBeenCalled();
  });

  it("does not flip its state optimistically on click, only when the media confirms playback", () => {
    const { button } = renderPlayButton();

    fireEvent.click(button);

    expect(button.getAttribute("aria-label")).toBe("Play video");
    expect(button.hasAttribute(DATA_ATTRS.playing)).toBe(false);
  });

  it("returns to the play state after 'pause', and after 'pause' + 'ended' plays again on click", () => {
    const { button, video, playSpy } = renderPlayButton();

    dispatch(video, "play");
    dispatch(video, "pause");
    dispatch(video, "ended");

    expect(button.getAttribute("aria-label")).toBe("Play video");
    expect(button.hasAttribute(DATA_ATTRS.playing)).toBe(false);

    fireEvent.click(button);
    expect(playSpy).toHaveBeenCalledTimes(1);
  });

  it("reports a rejected play() (e.g. autoplay policy) via onError and stays in the play state", async () => {
    const onError = vi.fn();
    const { button, playSpy } = renderPlayButton({}, { onError });
    const error = new DOMException("play() blocked", "NotAllowedError");
    playSpy.mockRejectedValue(error);

    fireEvent.click(button);

    await vi.waitFor(() => expect(onError).toHaveBeenCalledWith({ type: "play", error }));
    expect(button.getAttribute("aria-label")).toBe("Play video");
  });

  itAllowsAriaLabelOverride((label) => <PlayButton.Root aria-label={label} />);

  it("runs the consumer onClick before toggling", () => {
    const calls: string[] = [];
    const { button, playSpy } = renderPlayButton({ onClick: () => calls.push("consumer") });
    playSpy.mockImplementation(async () => {
      calls.push("play");
    });

    fireEvent.click(button);

    expect(calls).toEqual(["consumer", "play"]);
  });

  it("skips toggling when the consumer onClick calls preventDefault()", () => {
    const { button, playSpy } = renderPlayButton({ onClick: (e) => e.preventDefault() });

    fireEvent.click(button);

    expect(playSpy).not.toHaveBeenCalled();
  });

  itForwardsRef("button", (ref) => <PlayButton.Root ref={ref} />);

  it("resets to the play state when the media element unmounts mid-playback", () => {
    const { getByRole, video, rerenderInPlayer } = renderInPlayer(playerContent(true));
    const button = getByRole("button");
    dispatch(video, "play");
    expect(button.getAttribute("aria-label")).toBe("Pause video");

    rerenderInPlayer(playerContent(false));

    expect(button.getAttribute("aria-label")).toBe("Play video");
    expect(button.hasAttribute(DATA_ATTRS.playing)).toBe(false);
  });

  itThrowsOutsidePlayerRoot(<PlayButton.Root />);
});
