import { describe, expect, it } from "vitest";
import {
  getFullscreenSupport,
  isIphone,
  setDataAttr,
  supportsWebkitMediaFullscreen,
} from "@/utils/dom";
import { stubReadonly } from "@/utils/tests";

function makeMedia({ webkitFullscreen = false }: { webkitFullscreen?: boolean } = {}) {
  const media = document.createElement("video");
  if (webkitFullscreen) {
    stubReadonly(media, "webkitEnterFullscreen", () => {});
  }
  return media;
}

describe("setDataAttr", () => {
  it("returns true when the condition is true", () => {
    expect(setDataAttr(true)).toBe(true);
  });

  it("returns undefined when the condition is false", () => {
    expect(setDataAttr(false)).toBeUndefined();
  });
});

describe("supportsWebkitMediaFullscreen", () => {
  it("returns true when the element exposes webkitEnterFullscreen", () => {
    const media = makeMedia({ webkitFullscreen: true });
    expect(supportsWebkitMediaFullscreen(media)).toBe(true);
  });

  it("returns false when the element does not expose webkitEnterFullscreen", () => {
    const media = makeMedia();
    expect(supportsWebkitMediaFullscreen(media)).toBe(false);
  });
});

describe("isIphone", () => {
  it("returns true for a webkitEnterFullscreen element without container fullscreen support (iPhone Safari)", () => {
    stubReadonly(document, "fullscreenEnabled", false);
    const media = makeMedia({ webkitFullscreen: true });

    expect(isIphone(media)).toBe(true);
  });

  it("returns false for a webkitEnterFullscreen element when container fullscreen is also supported (iPad/macOS Safari)", () => {
    stubReadonly(document, "fullscreenEnabled", true);
    const media = makeMedia({ webkitFullscreen: true });

    expect(isIphone(media)).toBe(false);
  });

  it("returns false when the element does not expose webkitEnterFullscreen, regardless of container fullscreen support", () => {
    stubReadonly(document, "fullscreenEnabled", false);
    const media = makeMedia();

    expect(isIphone(media)).toBe(false);
  });
});

describe("getFullscreenSupport", () => {
  it("returns 'container' when document.fullscreenEnabled is true", () => {
    stubReadonly(document, "fullscreenEnabled", true);
    const media = makeMedia();

    expect(getFullscreenSupport(media)).toBe("container");
  });

  it("prefers 'container' over 'media' when both are available", () => {
    stubReadonly(document, "fullscreenEnabled", true);
    const media = makeMedia({ webkitFullscreen: true });

    expect(getFullscreenSupport(media)).toBe("container");
  });

  it("returns 'media' when only webkitEnterFullscreen is available (iPhone Safari)", () => {
    stubReadonly(document, "fullscreenEnabled", false);
    const media = makeMedia({ webkitFullscreen: true });

    expect(getFullscreenSupport(media)).toBe("media");
  });

  it("returns null when neither container nor media fullscreen is supported", () => {
    stubReadonly(document, "fullscreenEnabled", false);
    const media = makeMedia();

    expect(getFullscreenSupport(media)).toBeNull();
  });
});
