import { useEffect, useState } from "react";
import { ModalImgData } from "./inputDataType";
import {
	TrashIcon,
	PhotoIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	InformationCircleIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";

// TODO: Generic Model
export const Modal = (props: { children: React.JSX.Element }) => {
	return (
		<div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-fit h-fit border rounded-2xl border-color-rose-800 bg-gray-800/90 backdrop-blur-md z-[20] overflow-auto">
			{props.children}
		</div>
	);
};

interface ModalImgProp {
	moadlImgData: ModalImgData;
	modalToggle: () => void;
	setModalViz: (viz: boolean) => void;
	updateModalDataWithPrev?: () => void;
	updateModalDataWithNext?: () => void;
	deleteHandler?: () => void;
}

const ModalImg = ({
	moadlImgData: modalImgData,
	modalToggle,
	setModalViz,
	updateModalDataWithPrev,
	updateModalDataWithNext,
	deleteHandler,
}: ModalImgProp) => {
	const [infoPanelViz, setInfoPanelViz] = useState<boolean>(false);

	const keyEvnt = (e: globalThis.KeyboardEvent) => {
		if (e.key === "Escape" || e.key === "Cancel") setModalViz(false);
	};

	useEffect(() => {
		window.addEventListener("keydown", keyEvnt);
		return () => window.removeEventListener("keydown", keyEvnt);
	}, []);

	return (
		<>
			{modalImgData.vizState && modalImgData.data && (
				<Modal>
					<div className="w-dvw h-dvh border rounded-2xl border-color-rose-800 bg-gray-800/90 backdrop-blur-md z-[20] overflow-y-auto overflow-x-hidden">
						<div className="grid grid-cols-12 w-full h-full relative overflow-hidden">
							<div className="relative col-span-12 md:col-span-9 border border-color-white h-full w-full left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] overflow-hidden bg-gray-900/10">
								<img
									src={modalImgData.data.url}
									alt={modalImgData.data.name}
									className="relative max-w-full max-h-screen top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
								/>
								{/* Image Functions */}
								<div className="absolute rounded-md left-[50%] bottom-0 translate-x-[-50%] bg-gray-800 flex flex-row items-center justify-center backdrop-blur-sm border">
									{deleteHandler && (
										<div
											className="bg-none p-2 w-10 h-10 flex items-center justify-center border-r hover:scale-[1.05] transition-transform"
											onClick={deleteHandler}>
											<button
												className="border-none bg-[transparent] w-fit-content h-fit-content p-2"
												title="delete page">
												<TrashIcon className="w-6 h-6 stroke-white" />
											</button>
										</div>
									)}
									<div className="bg-none  p-2 w-10 h-10 flex items-center justify-center border-r hover:scale-[1.05] transition-transform">
										<button
											className="border-none bg-[transparent] w-fit-content h-fit-content p-2"
											title="Rotate Image Left">
											<PhotoIcon className="w-6 h-6 stroke-white" />
										</button>
									</div>
									<div className="bg-none p-2 w-10 h-10 flex items-center justify-center border-r hover:scale-[1.05] transition-transform">
										<button
											className="border-none bg-[transparent] w-fit-content h-fit-content p-2"
											title="Rotate Image Right">
											<PhotoIcon className="w-6 h-6 stroke-white" />
										</button>
									</div>
									<div className="bg-none p-2 w-10 h-10 flex items-center justify-center hover:scale-[1.05] transition-transform">
										<button
											className="border-none bg-[transparent] w-fit-content h-fit-content p-2"
											title="Flip Vertically">
											<PhotoIcon className="w-6 h-6 stroke-white" />
										</button>
									</div>
									{/* Dynamic on screen size */}
									<div className="md:hidden bg-none p-2 w-10 h-10 flex items-center justify-center border-l scale-1  hover:scale-[1.05] transition-transform">
										<button
											onClick={() => setInfoPanelViz(true)}
											className="border-none bg-[transparent] w-fit-content h-fit-content p-2"
											title="Image information">
											<InformationCircleIcon className="w-6 h-6 stroke-white" />
										</button>
									</div>
								</div>
								{/* Prev && Next button */}
								{updateModalDataWithPrev && (
									<div className="absolute rounded-xl top-[50%] left-1 translate-y-[-50%] bg-gray-800/40 backdrop-blur-md hover:bg-gray-900">
										<button
											className="rounded-xl border-none h-fit-content w-fit-content p-2 bg-[transparent]"
											onClick={updateModalDataWithPrev}>
											<ChevronLeftIcon className="rounded-xl w-6 h-6 stroke-white" />
										</button>
									</div>
								)}
								{updateModalDataWithNext && (
									<div
										className="rounded-xl absolute top-[50%] right-1 translate-y-[-50%] bg-gray-800/40 backdrop-blur-md hover:bg-gray-900"
										onClick={updateModalDataWithNext}>
										<button className="rounded-xl border-none h-fit-content w-fit-content p-2 bg-[transparent]">
											<ChevronRightIcon className="rounded-xl w-6 h-6 stroke-white" />
										</button>
									</div>
								)}
							</div>
							{infoPanelViz && (
								<div
									className={`md:hidden absolute top-[50%] translate-y-[-50%] p-2 ${
										infoPanelViz ? "left-[0]" : "left-[100%]"
									} transition-[left] duration-700 bg-gray-900/80 backdrop-blur-md w-full h-full z-[20] overflow-y-auto`}>
									<div className="absolute right-2 top-2">
										<XMarkIcon
											className="w-8 h-8 stroke-[red]"
											onClick={() => setInfoPanelViz(false)}
										/>
									</div>
									<h1 className="text-2xl font-bold font-roboto">Info</h1>
									<div className="px-4">
										<ol className="list-none leading-relaxed font-roboto text-md">
											<li>
												File Name:{" "}
												<span className="bg-gray-700 rounded border-b-2 px-2">
													{modalImgData.data.name}
												</span>
											</li>
											<li>
												Modified At:{" "}
												<span className="bg-gray-700 rounded border-b-2 px-2">
													{new Date().toLocaleString()}
												</span>
											</li>
											<li>
												Size:{" "}
												<span className="bg-gray-700 rounded border-b-2 px-2">
													{modalImgData.data.size}
												</span>
											</li>
											<li>
												Width:{" "}
												<span className="bg-gray-700 rounded border-b-2 px-2">
													{100}
												</span>
											</li>
											<li>
												Height:{" "}
												<span className="bg-gray-700 rounded border-b-2 px-2">
													{100}
												</span>
											</li>
											<li className="flex gap-1 items-center my-1">
												<span className="inline-block">Min-Height:</span>{" "}
												<span className="bg-gray-700 rounded border-b-2 px-2 inline-block max-w-full text-nowrap overflow-x-auto">
													io foieio o
												</span>
											</li>
											<li className="flex flex-wrap gap-1 items-center my-1">
												<span className="inline-block">Min-Height:</span>{" "}
												<span className="bg-gray-700 rounded border-b-2 px-2 inline-block max-w-full text-nowrap overflow-x-auto">
													io foieio o ewo hoewi hewo iew oiew hoiwe houew
													hoewouwe ho ew ou ewou ewou hewo hewo owe ouw roew
													iuew ewfewgi weiu fh weiu fhwediu fhediu fui frou
													hferou iuer fguir
												</span>
											</li>
											{Array.from({ length: 100 }, (_, i) => (
												<li key={i}>
													Height:{" "}
													<span className="bg-gray-700 rounded border-b-2 px-2">
														{"iowjr oieiwo werhio hrewr"}
													</span>
												</li>
											))}
										</ol>
									</div>
								</div>
							)}
							<div className="hidden md:block md:col-span-3 border border-color-white h-full w-full rounded-xl p-2 shadow-md overflow-x-hidden overflow-y-auto bg-gray-900/90">
								<h1 className="text-2xl font-bold font-roboto">Info</h1>
								<div className="px-4">
									<ol className="list-none leading-relaxed font-roboto">
										<li>
											File Name:{" "}
											<span className="bg-gray-700 rounded border-b-2 px-2">
												{modalImgData.data.name}
											</span>
										</li>
										<li>
											Modified At:{" "}
											<span className="bg-gray-700 rounded border-b-2 px-2">
												{modalImgData.data.lastModified.toLocaleString()}
											</span>
										</li>
										<li>
											Size:{" "}
											<span className="bg-gray-700 rounded border-b-2 px-2">
												{modalImgData.data.size}
											</span>
										</li>
										<li>
											Width:{" "}
											<span className="bg-gray-700 rounded border-b-2 px-2">
												{100}
											</span>
										</li>
										<li>
											Height:{" "}
											<span className="bg-gray-700 rounded border-b-2 px-2">
												{100}
											</span>
										</li>
									</ol>
								</div>
							</div>
						</div>
						<div className="absolute top-1 left-3 w-8 h-8">
							<button
								className="border-none w-fit-content h-fit-content bg-gray-100/10 backdrop-blur-md p-2 hover:bg-gray-900"
								onClick={() => modalToggle()}>
								<XMarkIcon className="w-8 h-8 stroke-white hover:stroke-[red]" />
							</button>
						</div>
					</div>
				</Modal>
			)}
		</>
	);
};

export default ModalImg;
