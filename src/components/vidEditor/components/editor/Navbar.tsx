import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDown, Download, Settings } from "lucide-react";

export const VidNavbar = () => {
	return (
		<div className="flex justify-between items-center py-2 px-4 bg-slate-700 rounded-lg">
			<h1 className=" text-slate-50 text-lg font-bold ">Comic Video Editor</h1>
			<div className="space-x-4 flex flex-row justify-center items-center text-sm text-white">
				<button
					className="px-4 py-2 bg-blue-600 rounded-lg flex items-center gap-2"
					onClick={() => setSettingModalViz(true)}>
					<Settings size={16} />
					Settings
				</button>
				<Menu
					as="div"
					className="relative inline-block m-auto max-w-full w-full">
					<div>
						<MenuButton className="my-0 max-w-full bg-green-600 text-slate-50 rounded-lg flex flex-row space-x-1 flex-nowrap items-center justify-center px-4 py-2">
							<Download size={16} />
							<div className="">Export</div>
							<ChevronDown size={18} />
						</MenuButton>
					</div>
					<MenuItems
						transition
						className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
						<div className="py-1">
							<MenuItem>
								<div
									className="flex flex-row flex-nowrap items-center gap-1 px-2 py-1 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none hover:cursor-pointer"
									onClick={() => {
										console.log(
											"Export : ",
											// vidGenCmm1(
											// 	vidSettingConfig,
											// 	panelDatas,
											// 	speechBubbleDatas,
											// 	audioDatas,
											// 	caption,
											// ),
										);
										if (vidRef.current) {
											console.log(vidRef.current.src);
										}
									}}>
									{vidRef.current && vidRef.current.src.length !== 0 ? (
										<a
											href={vidRef.current.src}
											download="movie.mp4"
											className="inline-flex gap-1">
											<Download size={16} /> Export as MP4
										</a>
									) : (
										<span className="hover:cursor-not-allowed">
											<Download size={16} /> Export as MP4
										</span>
									)}
								</div>
							</MenuItem>
							<MenuItem>
								<div
									className="flex flex-row flex-nowrap items-center gap-1 px-2 py-1 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none hover:cursor-pointer"
									onClick={() => console.log("Export as AVI")}>
									<Download size={16} /> Export as AVI
								</div>
							</MenuItem>
							<MenuItem>
								<div
									className="flex flex-row flex-nowrap items-center gap-1 px-2 py-1 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none hover:cursor-pointer"
									onClick={() => console.log("Export as MKV")}>
									<Download size={16} /> Export as MKV
								</div>
							</MenuItem>
						</div>
					</MenuItems>
				</Menu>
			</div>
		</div>
	);
};

export default VidNavbar;
