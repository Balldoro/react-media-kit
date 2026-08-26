type EventHandler<E> = ((event: E) => void) | undefined;

export const composeHandlers = <E>(...handlers: EventHandler<E>[]) => {
  return (event: E) => {
    for (const handler of handlers) {
      if ((event as Event).defaultPrevented) return;
      handler?.(event);
    }
  };
};

export const normalizeKeyCode = (key: string) => key.toUpperCase();
