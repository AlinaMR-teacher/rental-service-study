import { describe, expect, it } from 'vitest';
import { formatDate } from './utils';

describe('formatDate', () => {
  it('formats date to month and year', () => {
    expect(formatDate('2025-03-25')).toBe('March 2025');
  });
});