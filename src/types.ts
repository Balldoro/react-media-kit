import type { ButtonHTMLAttributes } from "react";

export type ButtonAttributes = ButtonHTMLAttributes<HTMLButtonElement>;

export type OnErrorFunc = (playerError: PlayerError) => void;

export type PlayerError = VideoMediaError | GeneralError;

interface VideoMediaError {
  type: "media";
  error: MediaError;
}

interface GeneralError {
  type: "fullscreen" | "play" | "pip";
  error: unknown;
}
