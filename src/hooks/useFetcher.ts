import { useState } from "react";

export interface useFetcherResult<T> {
	_fetch: (url: string, optn: RequestInit) => Promise<void>;
	res: T | undefined;
	isLoading: boolean;
	error: string | null;
}

const useFetcher = <T>(
	dataAccesor: (res: Response) => Promise<T> = async (res) => await res.json(),
	postHandler?: (res: T) => void,
	postErrHandler?: (err: Error) => void,
): useFetcherResult<T> => {
	const [res, setRes] = useState<T | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const _fetch = async (url: string, optn: RequestInit) => {
		setIsLoading(true);
		try {
			const res = await fetch(url, optn);
			if (!res.ok) throw new Error("response not OK");

			const data = await dataAccesor(res);
			setRes(data);
			if (postHandler) postHandler(data);
		} catch (err) {
			const _err = err as Error;
			console.error(_err);
			setError(_err.message);
			if (postErrHandler) postErrHandler(_err);
		} finally {
			setIsLoading(false);
		}
	};

	return { _fetch, res, isLoading, error };
};

export default useFetcher;
