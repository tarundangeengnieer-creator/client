/**
 * Utility functions for styling and class composition.
 */

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
