import { useCallback, useEffect, useRef } from 'react';

export function useMounted(): () => boolean {
  const mountedRef = useRef(false);
  useEffect(function useMountedEffect() {
    mountedRef.current = true;
    return function useMountedEffectCleanup() {
      mountedRef.current = false;
    };
  }, []);
  return useCallback(
    function isMounted() {
      return mountedRef.current;
    },
    [mountedRef]
  );
}
