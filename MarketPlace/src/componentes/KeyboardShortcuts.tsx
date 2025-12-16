import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const INTERACTIVE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

const shouldIgnoreEvent = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return INTERACTIVE_TAGS.has(target.tagName);
};

export function KeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (shouldIgnoreEvent(event.target)) return;

      if (event.altKey && event.key.toLowerCase() === 'h') {
        event.preventDefault();
        navigate('/home');
        return;
      }

      if (event.altKey && event.key === 'ArrowLeft') {
        event.preventDefault();
        navigate(-1);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  return null;
}
