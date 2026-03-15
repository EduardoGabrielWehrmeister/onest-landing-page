/**
 * Grid Utilities for Dynamic Form Fields
 * Maps grid column values from database to Tailwind CSS classes
 */

export const GRID_CLASS_MAPPING = {
  1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3', 4: 'col-span-4',
  5: 'col-span-5', 6: 'col-span-6', 7: 'col-span-7', 8: 'col-span-8',
  9: 'col-span-9', 10: 'col-span-10', 11: 'col-span-11', 12: 'col-span-12',
  full: 'col-span-full',
} as const;

export const GRID_MD_CLASS_MAPPING = {
  1: 'md:col-span-1', 2: 'md:col-span-2', 3: 'md:col-span-3', 4: 'md:col-span-4',
  5: 'md:col-span-5', 6: 'md:col-span-6', 7: 'md:col-span-7', 8: 'md:col-span-8',
  9: 'md:col-span-9', 10: 'md:col-span-10', 11: 'md:col-span-11', 12: 'md:col-span-12',
  full: 'md:col-span-full',
} as const;

export const getGridClasses = (gridColumns: number, gridMdColumns?: number): string => {
  const safeGridColumns = gridColumns >= 1 && gridColumns <= 12 ? gridColumns : 12;
  const safeGridMdColumns = gridMdColumns && gridMdColumns >= 1 && gridMdColumns <= 12
    ? gridMdColumns
    : undefined;

  const baseClass = GRID_CLASS_MAPPING[safeGridColumns as keyof typeof GRID_CLASS_MAPPING];
  const mdClass = safeGridMdColumns
    ? GRID_MD_CLASS_MAPPING[safeGridMdColumns as keyof typeof GRID_MD_CLASS_MAPPING]
    : undefined;

  return mdClass ? `${baseClass} ${mdClass}` : baseClass;
};