import { act } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent } from "@testing-library/react";
import { Media } from "@/components/media";
import { PlaybackRateButton } from "@/components/playbackRateButton";
import { DATA_ATTRS } from "@/constants";
import {
  renderInPlayer,
  itAllowsAriaLabelOverride,
  itForwardsRef,
  itThrowsOutsidePlayerRoot,
  stubReadonly,
  dispatch,
} from "@/utils/tests";

afterEach(cleanup);

const RATES = [0.5, 1, 1.5, 2];

function renderRateGroup({ withMedia = true } = {}) {
  const ui = (showMedia: boolean) => (
    <>
      {showMedia && <Media.Video />}
      {RATES.map((rate) => (
        <PlaybackRateButton.Root key={rate} playbackRate={rate} />
      ))}
    </>
  );
  const utils = renderInPlayer(ui(withMedia));
  const getButton = (rate: number) =>
    utils.getByRole("button", { name: `Playback speed: ${rate}x` });
  const activeRates = () =>
    RATES.filter((rate) => getButton(rate).getAttribute(DATA_ATTRS.active) === "true");
  const setMediaMounted = (show: boolean) => utils.rerenderInPlayer(ui(show));
  return { ...utils, getButton, activeRates, setMediaMounted };
}

describe("PlaybackRateButton.Root", () => {
  it.each([
    [1, "Playback speed: 1x"],
    [0.5, "Playback speed: 0.5x"],
  ])("playbackRate=%s is labelled %s", (playbackRate, label) => {
    const { getByRole } = renderInPlayer(<PlaybackRateButton.Root playbackRate={playbackRate} />);

    expect(getByRole("button").getAttribute("aria-label")).toBe(label);
  });

  it("does not leak the playbackRate prop onto the DOM element", () => {
    const { getByRole } = renderInPlayer(<PlaybackRateButton.Root playbackRate={1.5} />);
    const button = getByRole("button");

    expect(button.hasAttribute("playbackrate")).toBe(false);
    expect(button.hasAttribute("playbackRate")).toBe(false);
  });

  it("omits data-active entirely (rather than setting it to 'false') on inactive buttons", () => {
    const { getButton } = renderRateGroup();

    expect(getButton(2).hasAttribute(DATA_ATTRS.active)).toBe(false);
  });

  it("sets the media playbackRate on click and moves the active marker once the media confirms", () => {
    const { video, getButton, activeRates } = renderRateGroup();

    fireEvent.click(getButton(2));

    expect(video.playbackRate).toBe(2);
    expect(activeRates()).toEqual([2]);
  });

  it("follows rate changes that did not come from these buttons", () => {
    const { video, activeRates } = renderRateGroup();

    act(() => {
      video.playbackRate = 0.5;
    });

    expect(activeRates()).toEqual([0.5]);
  });

  it("marks no button active when the media runs at a rate not in the group", () => {
    const { video, activeRates } = renderRateGroup();

    act(() => {
      video.playbackRate = 1.25;
    });

    expect(activeRates()).toEqual([]);
  });

  it("picks up the media's rate from loadedmetadata", () => {
    const { video, activeRates } = renderRateGroup();
    stubReadonly(video, "playbackRate", 1.5);

    dispatch(video, "loadedmetadata");

    expect(activeRates()).toEqual([1.5]);
  });

  it("resets the active marker to 1x when the media element unmounts", () => {
    const { getButton, activeRates, setMediaMounted } = renderRateGroup();
    fireEvent.click(getButton(2));
    expect(activeRates()).toEqual([2]);

    setMediaMounted(false);

    expect(activeRates()).toEqual([1]);
  });

  itAllowsAriaLabelOverride((label) => (
    <PlaybackRateButton.Root playbackRate={2} aria-label={label} />
  ));

  it("runs the consumer onClick before changing the rate", () => {
    let rateSeenByConsumer: number | null = null;
    const { video, getByRole } = renderInPlayer(
      <>
        <Media.Video />
        <PlaybackRateButton.Root
          playbackRate={2}
          onClick={() => {
            rateSeenByConsumer = video.playbackRate;
          }}
        />
      </>,
    );

    fireEvent.click(getByRole("button"));

    expect(rateSeenByConsumer).toBe(1);
    expect(video.playbackRate).toBe(2);
  });

  it("does not change the rate when the consumer onClick calls preventDefault()", () => {
    const { video, getByRole } = renderInPlayer(
      <>
        <Media.Video />
        <PlaybackRateButton.Root playbackRate={2} onClick={(e) => e.preventDefault()} />
      </>,
    );

    fireEvent.click(getByRole("button"));

    expect(video.playbackRate).toBe(1);
  });

  itForwardsRef("button", (ref) => <PlaybackRateButton.Root playbackRate={1} ref={ref} />);

  itThrowsOutsidePlayerRoot(<PlaybackRateButton.Root playbackRate={1} />);
});
