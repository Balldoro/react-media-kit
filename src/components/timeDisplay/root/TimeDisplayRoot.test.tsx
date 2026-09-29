import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent } from "@testing-library/react";
import { TimeDisplay } from "@/components/timeDisplay";
import { DATA_ATTRS } from "@/constants";
import { renderInPlayer, itForwardsRef } from "@/utils/tests";

afterEach(cleanup);

type TimeDisplayRootProps = Parameters<typeof TimeDisplay.Root>[0];

const timeDisplay = (props: Partial<TimeDisplayRootProps> = {}) => (
  <TimeDisplay.Root data-testid="root" {...props}>
    <TimeDisplay.Toggle />
  </TimeDisplay.Root>
);

describe("TimeDisplay.Root", () => {
  it("renders a <div> with consumer attributes and media data attributes", () => {
    const { getByTestId } = renderInPlayer(timeDisplay({ className: "time" }));
    const root = getByTestId("root");

    expect(root.tagName).toBe("DIV");
    expect(root.className).toBe("time");
    expect(root.getAttribute(DATA_ATTRS.mediaPending)).toBe("true");
  });

  it("starts in elapsed mode by default", () => {
    const { getByRole } = renderInPlayer(timeDisplay());

    expect(getByRole("button").getAttribute("aria-label")).toBe("See remaining time");
  });

  it('starts in remaining mode with initialMode="remaining"', () => {
    const { getByRole } = renderInPlayer(timeDisplay({ initialMode: "remaining" }));

    expect(getByRole("button").getAttribute("aria-label")).toBe("See elapsed time");
  });

  it("only reads initialMode on mount, so changing it later does not reset a toggled mode", () => {
    const { getByRole, rerenderInPlayer } = renderInPlayer(timeDisplay({ initialMode: "elapsed" }));
    expect(getByRole("button").getAttribute("aria-label")).toBe("See remaining time");

    rerenderInPlayer(timeDisplay({ initialMode: "remaining" }));
    expect(getByRole("button").getAttribute("aria-label")).toBe("See remaining time");
  });

  it("keeps the mode of sibling roots independent", () => {
    const { getAllByRole } = renderInPlayer(
      <>
        {timeDisplay()}
        {timeDisplay()}
      </>,
    );
    const [first, second] = getAllByRole("button");

    fireEvent.click(first!);

    expect(first!.getAttribute("aria-label")).toBe("See elapsed time");
    expect(second!.getAttribute("aria-label")).toBe("See remaining time");
  });

  itForwardsRef("div", (ref) => <TimeDisplay.Root ref={ref} />);
});
