import { useEffect } from 'react';

export function useOutsideAlerter(ref, callback) {
  useEffect(() => {
    /**
     * Callback if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(event);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}

export default useOutsideAlerter;
