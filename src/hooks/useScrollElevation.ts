import { useEffect, useState, type RefObject } from "react";

/**
 * Returns `true` whenever the referenced scroll container has been scrolled
 * past the top edge (scrollTop > 0), indicating that content is beneath the
 * pinned header. Use this to apply an elevation shadow to sticky/pinned headers.
 *
 * Reusable across any scrollable surface in the app.
 */
export function useScrollElevation(
  ref: RefObject<HTMLElement | null>
): boolean {
  const [isElevated, setIsElevated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => setIsElevated(el.scrollTop > 0);

    // Sync immediately in case the element is already scrolled on mount
    onScroll();

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [ref]);

  return isElevated;
}
