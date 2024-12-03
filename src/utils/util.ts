export const capIndx = (newVal: number, totalVal: number) => {
	if (newVal < 0) return 0;
	else if (newVal >= totalVal) return totalVal - 1;
	else return newVal;
};
