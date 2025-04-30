import { useEffect, useRef, useState } from "react";

const useSyncedState = <T>(initialValue: T) => {
	const [state, setState] = useState<T>(initialValue);
	const ref = useRef<T>(initialValue);

	useEffect(() => {
		ref.current = state;
	}, [state]);

	const setSyncedState = (val: T | ((prev: T) => T)) => {
		const newVal = val instanceof Function ? val(ref.current) : val;
		ref.current = newVal;
		setState(newVal);
		return newVal;
	};

	return [state, setSyncedState, ref] as const;
};
export default useSyncedState;
