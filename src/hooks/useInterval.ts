import { useCallback, useEffect, useRef, useState } from "react";

const useInterval = (interval: number = 500) => {
	const [state, setState] = useState<boolean>(false); // state that turn on and off in consecutive interval
	const intId = useRef<number | null>(null);

	useEffect(() => {
		return () => {
			if (intId.current) {
				window.clearInterval(intId.current);
				setState(false);
			}
		};
	}, []);

	const start = useCallback(
		(cb: () => void) => {
			intId.current = window.setInterval(() => {
				setState((s) => !s);
				cb();
			}, interval);
		},
		[interval],
	);

	const stop = useCallback(() => {
		if (intId.current) {
			window.clearInterval(intId.current);
			setState(false);
		}
	}, []);

	return { start, stop, state } as const;
};

export default useInterval;
