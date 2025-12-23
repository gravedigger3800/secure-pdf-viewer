import { useEffect, useState } from 'react';

// Hook to handle document visibility (Tab switching)
export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
};

// Hook to disable context menu and keyboard shortcuts
export const useSecurityMeasures = () => {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+P (Print), Ctrl+S (Save), Ctrl+C (Copy)
      // Cmd on Mac
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      
      if (isCtrlOrCmd && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        alert("Printing is disabled for this secure document.");
      }
      
      if (isCtrlOrCmd && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        alert("Downloading is disabled.");
      }

      if (isCtrlOrCmd && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
      }

      // Try to block PrintScreen (Not fully supported by browsers, but we can try to blur)
      if (e.key === 'PrintScreen') {
         // Some browsers allow detection, but blocking is OS level.
         // We can hide content briefly if possible, but standard practice involves watermark.
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};