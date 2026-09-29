"use client";

import { useCallback, useEffect, useState, type SetStateAction } from "react";
import { apiRequest, errorMessage } from "@/lib/admin-client";

type State<T> = { url: string; version: number; data: T | null; error: string };

/**
 * Loads admin API data for a URL. State is only set from async callbacks, and data is keyed by URL,
 * so switching URLs shows a loading state without resetting state inside an effect.
 */
export function useApiData<T>(url: string) {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState<State<T>>({ url: "", version: -1, data: null, error: "" });

  useEffect(() => {
    let cancelled = false;
    apiRequest<T>(url).then(
      (data) => {
        if (!cancelled) setState({ url, version, data, error: "" });
      },
      (error: unknown) => {
        if (!cancelled) setState((current) => ({ url, version, data: current.url === url ? current.data : null, error: errorMessage(error, "Could not load data.") }));
      },
    );
    return () => {
      cancelled = true;
    };
  }, [url, version]);

  const setData = useCallback(
    (updater: SetStateAction<T | null>) =>
      setState((current) => ({
        ...current,
        data: typeof updater === "function" ? (updater as (previous: T | null) => T | null)(current.data) : updater,
      })),
    [],
  );

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const matches = state.url === url;

  return {
    data: matches ? state.data : null,
    error: matches ? state.error : "",
    loading: !matches || state.version !== version,
    setData,
    reload,
  };
}
