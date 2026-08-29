import { isIphone } from "@/utils/dom";

interface State {
  didRun: boolean;
  unlockInFlight: boolean;
}

const initialState: State = Object.freeze({
  didRun: false,
  unlockInFlight: false,
});

export function createMediaUnlock() {
  let state = { ...initialState };

  const isUnlocked = (media: HTMLMediaElement | null) =>
    state.didRun || !media?.paused || !isIphone(media);

  const isUnlockInFlight = () => state.unlockInFlight;

  const unlock = async (media: HTMLMediaElement | null): Promise<void> => {
    if (isUnlocked(media) || !media) return;

    state.didRun = true;
    state.unlockInFlight = true;

    // This is synthetic play as a workaround for Safari on iOS not firing events until media is played
    // We don't really care (and we actually expect) if play() throws an error
    // With catch handler we're swallowing the error, so that it's not reaching the consumer
    media.play().catch(() => {});
    return await new Promise((res) => {
      setTimeout(() => {
        media?.pause();
        state.unlockInFlight = false;
        res();
      }, 0);
    });
  };

  const reset = () => {
    state = { ...initialState };
  };

  return { isUnlocked, isUnlockInFlight, unlock, reset };
}
