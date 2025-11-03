import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue]: [T, React.Dispatch<React.SetStateAction<T>>] =
    useState<T>(() => {
      if (typeof window !== 'undefined') {
        const storedValue = localStorage.getItem(key);
        if (storedValue !== null) {
          return JSON.parse(storedValue);
        }
      }
      return initialValue;
    });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
}
