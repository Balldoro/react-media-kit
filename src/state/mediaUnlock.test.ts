import { describe, expect, it, vi } from "vitest";
import { createMediaUnlock } from "@/state/mediaUnlock";

function createMedia({ iphone = false }: { iphone?: boolean } = {}) {
  const media = document.createElement("video");
  vi.spyOn(media, "play").mockResolvedValue(undefined);
  vi.spyOn(media, "pause").mockImplementation(() => {});
  if (iphone) {
    media.webkitEnterFullscreen = vi.fn();
  }
  return media;
}

describe("createMediaUnlock", () => {
  it("starts unsettled", () => {
    const mediaUnlock = createMediaUnlock();
    expect(mediaUnlock.isUnlockInFlight()).toBe(false);
  });

  describe("isUnlocked", () => {
    it("returns true for a non-iPhone element", () => {
      const mediaUnlock = createMediaUnlock();
      const media = createMedia();

      expect(mediaUnlock.isUnlocked(media)).toBe(true);
    });

    it("returns false for an iPhone element until unlock settles it", () => {
      const mediaUnlock = createMediaUnlock();
      const media = createMedia({ iphone: true });

      expect(mediaUnlock.isUnlocked(media)).toBe(false);
    });
  });

  describe("unlock on an iPhone element", () => {
    it("marks isUnlocked and unlockInFlight synchronously once triggered", () => {
      const mediaUnlock = createMediaUnlock();
      const media = createMedia({ iphone: true });

      void mediaUnlock.unlock(media);

      expect(mediaUnlock.isUnlocked(media)).toBe(true);
      expect(mediaUnlock.isUnlockInFlight()).toBe(true);
    });

    it("calls play() on the media element", () => {
      const mediaUnlock = createMediaUnlock();
      const media = createMedia({ iphone: true });

      void mediaUnlock.unlock(media);

      expect(media.play).toHaveBeenCalledTimes(1);
    });

    it("pauses the media and clears unlockInFlight once the workaround completes", async () => {
      const mediaUnlock = createMediaUnlock();
      const media = createMedia({ iphone: true });

      await mediaUnlock.unlock(media);

      expect(media.pause).toHaveBeenCalledTimes(1);
      expect(mediaUnlock.isUnlocked(media)).toBe(true);
      expect(mediaUnlock.isUnlockInFlight()).toBe(false);
    });

    it("swallows a rejected play() instead of throwing or rejecting", async () => {
      const mediaUnlock = createMediaUnlock();
      const media = createMedia({ iphone: true });
      vi.mocked(media.play).mockRejectedValue(new Error("blocked by browser"));

      await expect(mediaUnlock.unlock(media)).resolves.toBeUndefined();
    });

    it("does not call play() again on subsequent calls once settled", async () => {
      const mediaUnlock = createMediaUnlock();
      const media = createMedia({ iphone: true });

      await mediaUnlock.unlock(media);
      vi.mocked(media.play).mockClear();

      await mediaUnlock.unlock(media);

      expect(media.play).not.toHaveBeenCalled();
    });
  });
});
