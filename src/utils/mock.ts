import { InputData } from "../pages/home";

export const fakePanels = (len: number): InputData[] => {
	const seeds = [
		"15.jpg",
		"16.jpg",
		"17.jpg",
		"18.jpg",
		"19.jpg",
		"20.png",
		"21.png",
	];

	return Array.from({ length: len }, (_, i) => ({
		id: i,
		name: `${i}.jpg`,
		url: `./${seeds[i % seeds.length]}`,
		type: "image/jpeg",
		size: 9090,
	}));
};
