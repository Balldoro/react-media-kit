type SeekQueue = { isPending: false } | { isPending: true; value: number };

export function createSeekQueue() {
  let queue: SeekQueue = { isPending: false };

  function set(value: number) {
    queue = { isPending: true, value };
  }

  function pop() {
    const state = { ...queue };
    queue = { isPending: false };
    return state;
  }

  function get() {
    return queue;
  }

  return { set, pop, get };
}
