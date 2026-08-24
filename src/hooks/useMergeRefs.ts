import { useCallback, type Ref } from "react";

export function useMergeRefs<T extends HTMLElement>(...refs: (Ref<T> | undefined)[]) {
  const mergeRefs = useCallback(
    (node: T | null) => {
      const cleanups = refs.map((ref) => {
        if (!ref) return null;
        if (typeof ref === "function") return ref(node);

        ref.current = node;
        return null;
      });

      return () => {
        refs.forEach((ref, idx) => {
          if (!ref) return;

          if (typeof ref === "function") {
            const refCleanup = cleanups[idx];
            // Support for legacy ref callbacks without cleanup functions
            // by calling it with null. Same as native React ref callback
            if (refCleanup == null) ref(null);
            else refCleanup();
          } else {
            ref.current = null;
          }
        });
      };
    },
    // Passing each ref independently for Object.is comparison so that callback re-initializes only on real ref change
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );

  return mergeRefs;
}
