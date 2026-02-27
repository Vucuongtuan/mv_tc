import { useEffect } from 'react';
import useTVModeStore from '@/store/tvModeStore';
import { useRouter } from 'next/navigation';

// Select only visible and interactive elements
const FOCUSABLE_SELECTOR = 'a:not([disabled]), button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const useSpatialNavigation = () => {
  const { isTVMode } = useTVModeStore();
  const router = useRouter();

  useEffect(() => {
    if (!isTVMode) return;

    // Initial focus when entering TV mode
    const initialFocus = document.querySelector(FOCUSABLE_SELECTOR) as HTMLElement;
    if (initialFocus) {
        initialFocus.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Refresh list of focusable elements on every keypress to account for dynamic content
      const focusableElements = Array.from(
        document.querySelectorAll(FOCUSABLE_SELECTOR)
      ).filter(el => {
          // Check visibility
          return el.checkVisibility ? el.checkVisibility() : true;
      }) as HTMLElement[];

      let activeElement = document.activeElement as HTMLElement;

      // If no active element or active element is body, focus the first available element
      if (!activeElement || activeElement === document.body) {
         if (focusableElements.length > 0) {
             focusableElements[0].focus();
             return;
         }
      }

      // If active element is not in our list (e.g. might be hidden now), try to find it or fallback
      if (!focusableElements.includes(activeElement)) {
          // Fallback to first element if current focus is lost/invalid
          if (focusableElements.length > 0) {
              focusableElements[0].focus();
              activeElement = focusableElements[0];
          }
      }

      let nextElement: HTMLElement | null = null;

      switch (e.key) {
        case 'ArrowUp':
          nextElement = findNextFocusable(activeElement, focusableElements, 'up');
          break;
        case 'ArrowDown':
          nextElement = findNextFocusable(activeElement, focusableElements, 'down');
          break;
        case 'ArrowLeft':
          nextElement = findNextFocusable(activeElement, focusableElements, 'left');
          break;
        case 'ArrowRight':
          nextElement = findNextFocusable(activeElement, focusableElements, 'right');
          break;
        case 'Enter':
          // Standard behavior is usually fine, but ensure click is triggered
          // Some elements like divs with tabindex might need explicit click
          e.preventDefault();
          activeElement.click();
          break;
        case 'Backspace':
        case 'Escape':
          // Back navigation
          e.preventDefault();
          router.back();
          break;
        default:
          return;
      }

      if (nextElement) {
        e.preventDefault();
        (nextElement as HTMLElement).focus();
        (nextElement as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTVMode, router]);
};

type Direction = 'up' | 'down' | 'left' | 'right';

function findNextFocusable(
  current: HTMLElement,
  candidates: HTMLElement[],
  direction: Direction
): HTMLElement | null {
  const currentRect = current.getBoundingClientRect();
  const currentCenter = {
    x: currentRect.left + currentRect.width / 2,
    y: currentRect.top + currentRect.height / 2,
  };

  let bestCandidate: HTMLElement | null = null;
  let minDistance = Infinity;

  for (const candidate of candidates) {
    if (candidate === current) continue;

    const candidateRect = candidate.getBoundingClientRect();
    const candidateCenter = {
      x: candidateRect.left + candidateRect.width / 2,
      y: candidateRect.top + candidateRect.height / 2,
    };

    // Filter by direction using relative positions
    let isValidDirection = false;

    // Strictness factor: Helps in selecting items that are more "in line" with the direction
    // A cone of 90 degrees (45 each side)
    const dx = candidateCenter.x - currentCenter.x;
    const dy = candidateCenter.y - currentCenter.y;

    switch (direction) {
      case 'up':
        // Candidate must be above current
        if (dy < 0 && Math.abs(dx) <= Math.abs(dy)) isValidDirection = true;
        break;
      case 'down':
        // Candidate must be below current
        if (dy > 0 && Math.abs(dx) <= Math.abs(dy)) isValidDirection = true;
        break;
      case 'left':
        // Candidate must be to the left
        if (dx < 0 && Math.abs(dy) <= Math.abs(dx)) isValidDirection = true;
        break;
      case 'right':
         // Candidate must be to the right
        if (dx > 0 && Math.abs(dy) <= Math.abs(dx)) isValidDirection = true;
        break;
    }

    if (isValidDirection) {
      // Euclidean distance
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Prioritize alignment?
      // For now, simple distance is usually good enough for grid layouts

      if (distance < minDistance) {
        minDistance = distance;
        bestCandidate = candidate;
      }
    }
  }

  // If no candidate found in the strict cone, try a wider search (180 degrees)
  // This helps when items are slightly offset but clearly the intended next target
  if (!bestCandidate) {
      for (const candidate of candidates) {
          if (candidate === current) continue;

          const candidateRect = candidate.getBoundingClientRect();
          const candidateCenter = {
            x: candidateRect.left + candidateRect.width / 2,
            y: candidateRect.top + candidateRect.height / 2,
          };

          const dx = candidateCenter.x - currentCenter.x;
          const dy = candidateCenter.y - currentCenter.y;
          let isValidDirection = false;

          switch (direction) {
            case 'up': if (dy < 0) isValidDirection = true; break;
            case 'down': if (dy > 0) isValidDirection = true; break;
            case 'left': if (dx < 0) isValidDirection = true; break;
            case 'right': if (dx > 0) isValidDirection = true; break;
          }

           if (isValidDirection) {
                // Weight the secondary axis distance more heavily to penalize items far to the side
                const primaryDist = direction === 'up' || direction === 'down' ? Math.abs(dy) : Math.abs(dx);
                const secondaryDist = direction === 'up' || direction === 'down' ? Math.abs(dx) : Math.abs(dy);

                // Calculate weighted distance
                const weightedDistance = primaryDist + (secondaryDist * 2);

                if (weightedDistance < minDistance) {
                    minDistance = weightedDistance;
                    bestCandidate = candidate;
                }
           }
      }
  }

  return bestCandidate;
}
