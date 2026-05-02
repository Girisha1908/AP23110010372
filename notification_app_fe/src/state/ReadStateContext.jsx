// Read/unread state management using React context
import { createContext, useContext, useState, useCallback } from "react";
import { Log } from "../api/logger.js";

const ReadStateContext = createContext();

/**
 * Provider that manages which notification IDs have been marked as read.
 * Uses local state (no persistence needed per spec).
 */
export function ReadStateProvider({ children }) {
  const [readIds, setReadIds] = useState(new Set());

  const markAsRead = useCallback(async (id) => {
    setReadIds((prev) => {
      const updated = new Set(prev);
      updated.add(id);
      return updated;
    });

    await Log(
      "frontend", "info", "state",
      `notification marked as read: id="${id}"`
    );
  }, []);

  const isRead = useCallback((id) => {
    return readIds.has(id);
  }, [readIds]);

  return (
    <ReadStateContext.Provider value={{ markAsRead, isRead, readCount: readIds.size }}>
      {children}
    </ReadStateContext.Provider>
  );
}

export function useReadState() {
  const ctx = useContext(ReadStateContext);
  if (!ctx) {
    throw new Error("useReadState must be used within ReadStateProvider");
  }
  return ctx;
}
