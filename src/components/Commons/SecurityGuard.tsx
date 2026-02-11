"use client";

import { useEffect } from "react";

export default function SecurityGuard() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const noop = () => {};
    console.log = noop;
    console.warn = noop;
    console.error = noop;
    console.info = noop;
    console.debug = noop;

    const clearId = setInterval(() => {
      console.clear();
    }, 1000);

    const debuggerLoop = () => {
      const start = Date.now();
      debugger;
      const end = Date.now();
      
      if (end - start > 100) {
      }
      
      setTimeout(debuggerLoop, 100);
    };

    const antiDebugId = setTimeout(debuggerLoop, 1000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(clearId);
      clearTimeout(antiDebugId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
