import { useCallback, useEffect, useRef } from "react";

export function useDebouncedCallback<T extends any[]>(
  fn: (...args: T) => void,
  delay: number,
) {
  const timer = useRef<any>(null);

  const debounced = useCallback(
    (...args: T) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay],
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  return debounced;
}
