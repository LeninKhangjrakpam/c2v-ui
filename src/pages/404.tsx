import { useNavigate } from "react-router";

const NotFound = () => {
	const nav = useNavigate();

	return (
		<div className="h-[80vh] gap-1 font-roboto flex flex-col items-center justify-center">
			<div className="rounded-lg flex flex-col items-center justify-center p-2 min-h-[50vh] w-fit bg-[transparent] backdrop-blur-md relative">
				<div className="text-purple-950 text-5xl font-extrabold m-2 text-center">
					404 - PAGE NOT FOUND
				</div>
				<div className="text-slate-800 text-center my-2">
					<p className="text-xl my-1"> This Page doesnt exist</p>
					<p className="text-sm my-1">
						The page you are looking might have been removed, <br />
						had its name changed or is temporarily unavailable
					</p>
				</div>

				<button
					className="relative top-6 block border-none rounded-full bg-blue-600 hover:bg-blue-700 text-white text-2xl p-3"
					onClick={() => nav("/")}>
					Go to Home/
				</button>
			</div>
		</div>
	);
};

export default NotFound;
