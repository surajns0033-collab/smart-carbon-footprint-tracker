import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTranslation } from '../../services/translation';

// Mock the context hook
vi.mock('../../context/AppContext', () => ({
  useAppContext: () => ({
    profile: {
      language: 'Hindi'
    }
  })
}));

describe('useTranslation Hook', () => {
  it('translates keys correctly in Hindi', () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.lang).toBe('Hindi');
    expect(result.current.t('dashboard')).toBe('डैशबोर्ड');
  });

  it('falls back to key for non-existent translation values', () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.t('FakeKeyXYZ')).toBe('FakeKeyXYZ');
  });
});
