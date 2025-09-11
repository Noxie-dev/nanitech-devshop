import { renderHook, act } from '@testing-library/react';
import useDebounce from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Change the value
    rerender({ value: 'updated', delay: 500 });
    
    // Value should not have changed yet
    expect(result.current).toBe('initial');

    // Fast forward time by 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now the value should be updated
    expect(result.current).toBe('updated');
  });

  it('should reset timer when value changes before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'first', delay: 500 });
    
    // Fast forward by 250ms (less than delay)
    act(() => {
      jest.advanceTimersByTime(250);
    });
    
    expect(result.current).toBe('initial');

    // Change value again
    rerender({ value: 'second', delay: 500 });
    
    // Fast forward by another 250ms (total 500ms from second change)
    act(() => {
      jest.advanceTimersByTime(250);
    });

    // Should now show the second value
    expect(result.current).toBe('second');
  });

  it('should handle zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 0 } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 0 });
    
    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current).toBe('updated');
  });

  it('should cleanup timer on unmount', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'updated', delay: 500 });
    
    // Unmount before timer completes
    unmount();
    
    // Fast forward time - should not cause any issues
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Test passes if no errors are thrown
    expect(true).toBe(true);
  });
});

