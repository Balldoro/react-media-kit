import { act, createRef, type ReactElement, type ReactNode, type RefObject } from "react";
import { expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { Player } from "@/components/player";
import type { OnErrorFunc } from "@/types";
import { ReactMediaKitError } from "@/utils/errors";

export function stubReadonly<T extends object, K extends keyof T>(target: T, key: K, value: T[K]) {
  Object.defineProperty(target, key, { value, configurable: true });
}

export interface RenderInPlayerOptions {
  onError?: OnErrorFunc;
}

export function renderInPlayer(children: ReactNode, { onError }: RenderInPlayerOptions = {}) {
  const inPlayer = (content: ReactNode) => (
    <Player.Root onError={onError}>
      <Player.Container>{content}</Player.Container>
    </Player.Root>
  );
  const utils = render(inPlayer(children));

  return {
    ...utils,
    video: utils.container.querySelector("video")!,
    playerContainer: utils.container.firstElementChild as HTMLDivElement,
    rerenderInPlayer: (content: ReactNode) => utils.rerender(inPlayer(content)),
  };
}

export const dispatch = (target: Element, type: string) =>
  act(() => target.dispatchEvent(new Event(type)));

// Shared test cases for contracts every component follows

export function itThrowsOutsidePlayerRoot(ui: ReactElement) {
  it("throws a ReactMediaKitError when rendered outside Player.Root", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() => render(ui)).toThrow(ReactMediaKitError);
    } finally {
      consoleError.mockRestore();
    }
  });
}

export function itForwardsRef<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  renderWithRef: (ref: RefObject<HTMLElementTagNameMap[K] | null>) => ReactNode,
) {
  it(`forwards ref to the underlying <${tagName}>`, () => {
    const ref = createRef<HTMLElementTagNameMap[K]>();
    const { container } = renderInPlayer(renderWithRef(ref));

    expect(ref.current?.tagName).toBe(tagName.toUpperCase());
    expect(container.contains(ref.current)).toBe(true);
  });
}

export function itAllowsAriaLabelOverride(renderWithLabel: (ariaLabel: string) => ReactNode) {
  it("lets a consumer aria-label override the default", () => {
    const { getByLabelText } = renderInPlayer(renderWithLabel("Custom label"));

    expect(getByLabelText("Custom label")).toBeTruthy();
  });
}
