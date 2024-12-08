import { useEffect, useState } from "react";

interface useFetchResult<T> {
	res: T | undefined;
	isLoading: boolean;
	error: string | null;
}

const useFetch = <T>(url: string, options: RequestInit): useFetchResult<T> => {
	const [res, setRes] = useState<T | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			try {
				const r = await fetch(url, options);
				const d = await r.json();
				setRes(d);
			} catch (err) {
				console.error(err);
				if (err instanceof Error) setError(err.message);
				else setError("an unknown error occur");
			} finally {
				setIsLoading(false);
			}
		})();
	}, [url, options]);
	return { res, isLoading, error };
};

export default useFetch;
