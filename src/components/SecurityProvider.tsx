"use client";

import { useEffect } from "react";

export default function SecurityProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable context menu (right click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable keyboard shortcuts (Ctrl+C, Ctrl+U, Ctrl+Shift+I, etc.)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+C / Cmd+C
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        e.preventDefault();
      }
      // Prevent Ctrl+U / Cmd+U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.key === "u") {
        e.preventDefault();
      }
      // Prevent F12 and Ctrl+Shift+I (DevTools)
      if (e.key === "F12" || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "i")) {
        e.preventDefault();
      }
    };

    // Disable selection start
    const handleSelectStart = (e: Event) => {
      // Allow selection only for input and textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      e.preventDefault();
    };

    // Disable dragging elements/text
    const handleDragStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }
      e.preventDefault();
    };

    // Force remove any selection as soon as it happens
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        // Only clear if not in an input/textarea
        const activeElement = document.activeElement;
        if (activeElement?.tagName !== "INPUT" && activeElement?.tagName !== "TEXTAREA" && !(activeElement as HTMLElement)?.isContentEditable) {
          selection.removeAllRanges();
        }
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  return <>{children}</>;
}
