import { useState, useEffect } from 'react';

/**
 * Custom Hook đồng bộ State với LocalStorage của trình duyệt
 * Đảm bảo dữ liệu không bị mất khi người dùng ấn F5 hoặc vô tình tải lại trang.
 */
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') {
        return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
      }
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item) as T;
      }
    } catch (error) {
      console.warn(`Lỗi khi đọc key "${key}" từ LocalStorage:`, error);
    }
    return typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.warn(`Lỗi khi ghi key "${key}" vào LocalStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
