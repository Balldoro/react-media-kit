type EventHandler<E> = ((event: E) => void) | undefined;

export const composeHandlers = <E>(...handlers: EventHandler<E>[]) => {
  return (event: E) => handlers.forEach((h) => h?.(event));
};
