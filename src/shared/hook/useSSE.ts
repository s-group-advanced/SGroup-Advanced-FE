import { useEffect, useRef, useState } from "react";

interface UseSSEOptions {
  onMessage?: (data: any) => void;
  onError?: (error: any) => void;
  onOpen?: () => void;
  enabled?: boolean;
}

export function useSSE(url: string, options: UseSSEOptions) {
  const { onMessage, onError, onOpen, enabled } = options;
  const eventSourceRef = useRef<EventSource | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled || !url) return;

    // Create new EventSource
    const eventSource = new EventSource(url, {
      withCredentials: true,
    });

    eventSourceRef.current = eventSource;

    // handle connection events
    eventSource.onopen = () => {
      console.log("Connected to SSE");
      setIsConnected(true);
      setError(null);
      onOpen?.();
    };

    // handle message events
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage?.(data);
      } catch (err) {
        console.error("Error processing SSE message:", err);
      }
    };

    // handle error events
    eventSource.onerror = (event) => {
      setIsConnected(false);
      setError(new Error("Connection error"));
      onError?.(event);

      // EventSource auto reconnect, but if it fails too many times then close
      if (eventSource.readyState === EventSource.CLOSED) {
        eventSource.close();
      }
    };

    // cleanup function
    return () => {
      eventSource.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    };
  }, [url, enabled]);

  return {
    isConnected,
    error,
    close: () => eventSourceRef.current?.close(),
  };
}
