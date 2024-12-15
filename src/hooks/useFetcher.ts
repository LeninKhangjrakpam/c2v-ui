import { useState } from "react";

interface useFetcherResult<T> {
	_fetch: (url: string, optn: RequestInit) => Promise<void>;
	res: T | undefined;
	isLoading: boolean;
	error: string | null;
}

const useFetcher = <T>(
	dataAccesor: (res: Response) => T,
): useFetcherResult<T> => {
	const [res, setRes] = useState<T | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const _fetch = async (url: string, optn: RequestInit) => {
		setIsLoading(true);
		try {
			const res = await fetch(url, optn);
			const data = await dataAccesor(res);
			setRes(data);
		} catch (err) {
			console.error(err);
			if (err instanceof Error) setError(err.message);
			else setError("an unknown error occur");
		} finally {
			setIsLoading(false);
		}
	};
	return { _fetch, res, isLoading, error };
};

export default useFetcher;
