import { useEffect, useState } from "react";

const useScrollTopViz = (initState: boolean): boolean => {
	const [viz, setViz] = useState<boolean>(initState);

	useEffect(() => {
		const scrollEvntCallback = () => {
			if (window.scrollY >= window.innerHeight) setViz(true);
			else setViz(false);
		};

		window.addEventListener("scroll", scrollEvntCallback);
		return () => window.removeEventListener("scroll", scrollEvntCallback);
	}, []);

	return viz;
};

const scrollToTop = () =>
	window.scroll({ top: 0, left: 0, behavior: "smooth" });

const ScrollToTopBtn = () => {
	const scrollBtnViz = useScrollTopViz(false);

	return (
		<button
			className={`rounded-full border border-indigo-700 outline-yellow-300 fixed p-2 m-0 top-[10%] left-[50%] translate-x-[-50%] z-[1] text-sm text-black bg-indigo-300/40 backdrop-blur-md ${
				scrollBtnViz ? "top-[8%]" : "top-[-18%]"
			} transition-[top] duration-700`}
			onClick={scrollToTop}>
			Back to Top
		</button>
	);
};

export default ScrollToTopBtn;
