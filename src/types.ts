import type { ButtonHTMLAttributes, Ref, TimeHTMLAttributes } from "react";

export type ButtonAttributes = ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: Ref<HTMLButtonElement>;
};

export type WebkitHTMLMediaElement = HTMLMediaElement & {
  webkitEnterFullscreen: () => void;
  webkitExitFullscreen: () => void;
};

export type FullscreenSupport = "container" | "media" | null;

export type TimeDisplayAttributes = Omit<
  TimeHTMLAttributes<HTMLTimeElement>,
  "children" | "dateTime"
>;

export type OnErrorFunc = (playerError: PlayerError) => void;

export type PlayerError = MediaPlaybackError | GeneralError;

export type ErrorType = "media" | "fullscreen" | "play" | "pip";

interface MediaPlaybackError {
  type: Extract<ErrorType, "media">;
  error: MediaError;
}

interface GeneralError {
  type: Extract<ErrorType, "fullscreen" | "play" | "pip">;
  error: unknown;
}

export type MediaEngine<T extends HTMLMediaElement> = (media: T) => (() => void) | void;
