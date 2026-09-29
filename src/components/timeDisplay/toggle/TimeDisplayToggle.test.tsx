import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent } from "@testing-library/react";
import { TimeDisplay } from "@/components/timeDisplay";
import { DATA_ATTRS } from "@/constants";
import { ReactMediaKitError } from "@/utils/errors";
import { renderInPlayer, itAllowsAriaLabelOverride, itForwardsRef } from "@/utils/tests";

afterEach(cleanup);

function renderToggle(props: Parameters<typeof TimeDisplay.Toggle>[0] = {}) {
  const utils = renderInPlayer(
    <TimeDisplay.Root>
      <TimeDisplay.Toggle {...props} />
    </TimeDisplay.Root>,
  );
  return { ...utils, button: utils.getByRole("button") };
}

describe("TimeDisplay.Toggle", () => {
  it("renders a non-submitting button that offers to show the remaining time", () => {
    const { button } = renderToggle();

    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("aria-label")).toBe("See remaining time");
    expect(button.getAttribute(DATA_ATTRS.elapsedMode)).toBe("true");
  });

  it("flips between elapsed and remaining mode on each click", () => {
    const { button } = renderToggle();

    expect(button.getAttribute("aria-label")).toBe("See remaining time");
    expect(button.getAttribute(DATA_ATTRS.elapsedMode)).toBe("true");

    fireEvent.click(button);
    expect(button.getAttribute("aria-label")).toBe("See elapsed time");
    expect(button.hasAttribute(DATA_ATTRS.elapsedMode)).toBe(false);
  });

  it("skips toggling when the consumer onClick calls preventDefault()", () => {
    const { button } = renderToggle({ onClick: (e) => e.preventDefault() });

    fireEvent.click(button);

    expect(button.getAttribute("aria-label")).toBe("See remaining time");
  });

  itAllowsAriaLabelOverride((label) => (
    <TimeDisplay.Root>
      <TimeDisplay.Toggle aria-label={label} />
    </TimeDisplay.Root>
  ));

  itForwardsRef("button", (ref) => (
    <TimeDisplay.Root>
      <TimeDisplay.Toggle ref={ref} />
    </TimeDisplay.Root>
  ));

  it("throws a ReactMediaKitError when rendered outside TimeDisplay.Root", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderInPlayer(<TimeDisplay.Toggle />)).toThrow(ReactMediaKitError);

    vi.mocked(console.error).mockRestore();
  });
});
