import { Dashboard } from '@/app/components/Dashboard';
import { LoginPage } from '@/app/components/LoginPage';
import { useEffect, useState } from 'react';

// App entry point
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  // Enable standard keyboard shortcuts globally
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? event.metaKey : event.ctrlKey;
      
      // Don't interfere with native text editing shortcuts
      // Allow Ctrl/Cmd + A (select all), C (copy), V (paste), X (cut)
      if (modKey && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
        // Let the browser handle these naturally
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, []);

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <Dashboard />
  );
}