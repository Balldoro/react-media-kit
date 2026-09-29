import { afterEach, describe, expect, it } from "vitest";
import { cleanup } from "@testing-library/react";
import { Media } from "@/components/media";
import { DATA_ATTRS } from "@/constants";
import { renderInPlayer, dispatch } from "@/utils/tests";

afterEach(cleanup);

function renderPoster(props: Partial<Parameters<typeof Media.Poster>[0]> = {}) {
  return renderInPlayer(
    <>
      <Media.Video />
      <Media.Poster src="/poster.jpg" alt="Poster" {...props} />
    </>,
  );
}

const isVisible = (el: Element) => el.getAttribute(DATA_ATTRS.visible) === "true";
const isAriaHidden = (el: Element) => el.getAttribute("aria-hidden") === "true";

describe("Media.Poster", () => {
  it("renders a bare <img> with the given src/alt and passthrough attributes when no sources are given", () => {
    const { container } = renderPoster({ decoding: "async" });

    const picture = container.querySelector("picture");
    expect(picture).toBeNull();

    const img = container.querySelector("img")!;
    expect(img).not.toBeNull();
    expect(img.getAttribute("src")).toBe("/poster.jpg");
    expect(img.getAttribute("alt")).toBe("Poster");
    expect(img.getAttribute("decoding")).toBe("async");
  });

  it("renders a <picture> with <source> elements in order followed by exactly one trailing <img> when sources are given", () => {
    const { container } = renderPoster({
      sources: [
        { media: "(min-width: 800px)", srcSet: "/poster-large.jpg" },
        { media: "(min-width: 400px)", srcSet: "/poster-medium.jpg" },
      ],
    });

    const picture = container.querySelector("picture")!;
    expect(picture).not.toBeNull();

    const children = Array.from(picture.children);
    expect(children).toHaveLength(3);
    expect(children[0]!.tagName).toBe("SOURCE");
    expect(children[0]!.getAttribute("media")).toBe("(min-width: 800px)");
    expect(children[0]!.getAttribute("srcset")).toBe("/poster-large.jpg");
    expect(children[1]!.tagName).toBe("SOURCE");
    expect(children[2]!.tagName).toBe("IMG");
    expect(children[2]!.getAttribute("src")).toBe("/poster.jpg");
    expect(children[2]!.getAttribute("alt")).toBe("Poster");

    expect(picture.querySelectorAll("img")).toHaveLength(1);
  });

  it('visibleWhen="pending" (default) is visible before any play event, hidden after', () => {
    const { container, video } = renderPoster();
    const img = container.querySelector("img")!;

    expect(isVisible(img)).toBe(true);
    expect(isAriaHidden(img)).toBe(false);

    dispatch(video, "play");
    expect(isVisible(img)).toBe(false);
    expect(isAriaHidden(img)).toBe(true);
  });

  it('visibleWhen="ended" is hidden until ended fires, visible after, hidden again after a subsequent play', () => {
    const { container, video } = renderPoster({ visibleWhen: "ended" });
    const img = container.querySelector("img")!;

    expect(isVisible(img)).toBe(false);

    dispatch(video, "play");
    expect(isVisible(img)).toBe(false);

    dispatch(video, "ended");
    expect(isVisible(img)).toBe(true);

    dispatch(video, "play");
    expect(isVisible(img)).toBe(false);
  });

  it('visibleWhen="both" is visible pre-play, hidden during playback, visible again after ended', () => {
    const { container, video } = renderPoster({ visibleWhen: "both" });
    const img = container.querySelector("img")!;

    expect(isVisible(img)).toBe(true);

    dispatch(video, "play");
    expect(isVisible(img)).toBe(false);

    dispatch(video, "ended");
    expect(isVisible(img)).toBe(true);
  });
});
