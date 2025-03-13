import { useState } from "react";

/* eslint-disable  @typescript-eslint/no-explicit-any */
type XFetcher<T> = {
	data: T | undefined;
	state: "loading" | "idle";
	error: string | undefined;
	load: (url: string, init?: RequestInit) => Promise<void>;
	xFetch: (cb: () => Promise<T>) => Promise<void>;
};

/**
 *
 * @returns Hook for fetching data
 */
const useXFetcher = <T = any>(): XFetcher<T> => {
	const [data, setData] = useState<T>();
	const [error, setError] = useState<string>();
	const [state, setState] = useState<"idle" | "loading">("idle");

	/**
	 * Write your fetch function as callback
	 * error handling, loading state will be internally manage
	 * @param cb
	 */
	const xFetch = async (cb: () => Promise<T>): Promise<void> => {
		try {
			setState("loading");
			const d = cb();
			setData(await d);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("unknown error occured");
			}
		} finally {
			setState("idle");
		}
	};

	/**
	 * Use for fetching JSON response
	 * @param url
	 */
	const load = async (url: string, init?: ResponseInit): Promise<void> => {
		try {
			setState("loading");
			const res = await fetch(url, init);
			const d = (await res.json()) as T;
			setData(d);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("unknown error occured");
			}
		} finally {
			setState("idle");
		}
	};

	return { data, state, error, load, xFetch };
};

export default useXFetcher;
