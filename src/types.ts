import type { ButtonHTMLAttributes, Ref, TimeHTMLAttributes } from "react";

export type ButtonAttributes = ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: Ref<HTMLButtonElement>;
};

export type TimeDisplayAttributes = Omit<
  TimeHTMLAttributes<HTMLTimeElement>,
  "children" | "dateTime"
>;

export type OnErrorFunc = (playerError: PlayerError) => void;

export type PlayerError = MediaPlaybackError | GeneralError;

interface MediaPlaybackError {
  type: "media";
  error: MediaError;
}

interface GeneralError {
  type: "fullscreen" | "play" | "pip";
  error: unknown;
}
