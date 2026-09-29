import { type ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent } from "@testing-library/react";
import { Media } from "@/components/media";
import { PipButton } from "@/components/pipButton";
import { DATA_ATTRS } from "@/constants";
import { ReactMediaKitError } from "@/utils/errors";
import {
  renderInPlayer,
  type RenderInPlayerOptions,
  itAllowsAriaLabelOverride,
  itForwardsRef,
  itThrowsOutsidePlayerRoot,
  stubReadonly,
  dispatch,
} from "@/utils/tests";

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(document, "pictureInPictureEnabled");
});

interface RenderPipButtonOptions extends RenderInPlayerOptions {
  media?: ReactNode;
}

function renderPipButton(
  props: Parameters<typeof PipButton.Root>[0] = {},
  { onError, media = <Media.Video /> }: RenderPipButtonOptions = {},
) {
  const utils = renderInPlayer(
    <>
      {media}
      <PipButton.Root {...props} />
    </>,
    { onError },
  );
  return { ...utils, button: utils.getByRole("button") };
}

describe("PipButton.Root", () => {
  it("renders labelled 'Enter picture-in-picture' with no data-pip attribute initially", () => {
    const { button } = renderPipButton();

    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("aria-label")).toBe("Enter picture-in-picture");
    expect(button.hasAttribute(DATA_ATTRS.pip)).toBe(false);
  });

  describe("support detection", () => {
    it("is marked data-pip-unsupported when document.pictureInPictureEnabled is missing", () => {
      const { button } = renderPipButton();

      expect(button.getAttribute(DATA_ATTRS.pipUnsupported)).toBe("true");
    });

    it("is marked data-pip-unsupported when document.pictureInPictureEnabled is false", () => {
      stubReadonly(document, "pictureInPictureEnabled", false);
      const { button } = renderPipButton();

      expect(button.getAttribute(DATA_ATTRS.pipUnsupported)).toBe("true");
    });

    it("is not marked unsupported for a video when the API is enabled", () => {
      stubReadonly(document, "pictureInPictureEnabled", true);
      const { button } = renderPipButton();

      expect(button.hasAttribute(DATA_ATTRS.pipUnsupported)).toBe(false);
    });
  });

  it("reflects entering PiP only once the media fires enterpictureinpicture", async () => {
    stubReadonly(document, "pictureInPictureEnabled", true);
    const { button, video } = renderPipButton();
    stubReadonly(video, "requestPictureInPicture", vi.fn().mockResolvedValue({}));

    fireEvent.click(button);
    await Promise.resolve();
    expect(button.getAttribute("aria-label")).toBe("Enter picture-in-picture");

    dispatch(video, "enterpictureinpicture");
    expect(button.getAttribute("aria-label")).toBe("Exit picture-in-picture");
    expect(button.getAttribute(DATA_ATTRS.pip)).toBe("true");
  });

  it("returns to the 'enter' state when PiP is closed outside the button (e.g. the PiP window's close control)", () => {
    stubReadonly(document, "pictureInPictureEnabled", true);
    const { button, video } = renderPipButton();
    dispatch(video, "enterpictureinpicture");

    dispatch(video, "leavepictureinpicture");

    expect(button.getAttribute("aria-label")).toBe("Enter picture-in-picture");
    expect(button.hasAttribute(DATA_ATTRS.pip)).toBe(false);
  });

  describe("errors", () => {
    it("reports via onError instead of throwing when the browser lacks requestPictureInPicture", async () => {
      const onError = vi.fn();
      const { button } = renderPipButton({}, { onError });

      fireEvent.click(button);

      await vi.waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
      expect(onError.mock.calls[0]![0]).toMatchObject({ type: "pip" });
    });

    it("reports a ReactMediaKitError via onError when backed by an audio element", async () => {
      const onError = vi.fn();
      const { button } = renderPipButton({}, { onError, media: <Media.Audio /> });

      fireEvent.click(button);

      await vi.waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
      expect(onError.mock.calls[0]![0]).toMatchObject({ type: "pip" });
      expect(onError.mock.calls[0]![0].error).toBeInstanceOf(ReactMediaKitError);
    });
  });

  itAllowsAriaLabelOverride((label) => <PipButton.Root aria-label={label} />);

  it("skips toggling when the consumer onClick calls preventDefault()", async () => {
    stubReadonly(document, "pictureInPictureEnabled", true);
    const { button, video } = renderPipButton({ onClick: (e) => e.preventDefault() });
    const requestPictureInPicture = vi.fn().mockResolvedValue({});
    stubReadonly(video, "requestPictureInPicture", requestPictureInPicture);

    fireEvent.click(button);
    await Promise.resolve();

    expect(requestPictureInPicture).not.toHaveBeenCalled();
  });

  itForwardsRef("button", (ref) => <PipButton.Root ref={ref} />);

  itThrowsOutsidePlayerRoot(<PipButton.Root />);
});
