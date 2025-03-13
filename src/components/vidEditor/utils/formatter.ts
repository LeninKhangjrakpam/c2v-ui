/**
 *
 * @param seconds
 * @param precise
 * @returns formatted time string in the format of "hh:mm:ss.sss" or "hh:mm:ss"
 */
const formatTime = (seconds: number, precise: boolean = true) => {
	const secs = seconds % 60;
	const mins = ((seconds - secs) % (60 * 60)) / 60;
	const hrs = Math.floor(seconds / 3600);

	let hm = `${hrs}:${mins.toString().padStart(2, "0")}`;

	if (precise)
		hm += `:${Math.floor(secs).toString().padStart(2, "0")}.${(
			secs - Math.floor(secs)
		)
			.toString()
			.slice(2, 5)
			.padStart(3, "0")}`;
	else hm += `:${Math.round(secs).toString().padStart(2, "0")}`;

	return hm;
};

export { formatTime };
