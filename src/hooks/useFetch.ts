import { useEffect, useState } from "react";

interface useFetchResult {
	res: any;
	isLoading: boolean;
	error: string | null;
}

const useFetch = (url: string, options: any): useFetchResult => {
	const [res, setRes] = useState<any>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			try {
				const r = await fetch(url, options);
				const d = await r.json();
				setRes(d);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [url, options]);
	return { res, isLoading, error };
};

export default useFetch;
