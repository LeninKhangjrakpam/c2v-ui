import { InputData } from "./inputData.type";
import { useContext, useRef, useReducer } from "react";
import ToastsContext from "../hooks/createToastContext";
import CardAction from "./cardAction";
import modalImgReducer from "../hooks/modalImgDataReducer";
import { ModalImgDataActionKind } from "../hooks/modalImgDataReducer";
import ModalImg from "./Modal/modalImg";
import { MaxFileNameLen } from "../utils/constants";
import { capIndx } from "../utils/util";

import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { fileInputFileSrc } from "../utils/formUtils";

const PanelPreview = (props: {
	panelTitle: JSX.Element;
	panelGrpIndx: number;
	disabledControl: boolean;
	panel: InputData[]; // panel of a Single Page
	addPanel: (panelGrpIndx: number, panel: File[]) => InputData[];
	deletePanelGrp: (panelGrpIndx: number) => boolean;
	deletePanel: (panelGrpIndx: number, panelIndx: number) => boolean;
	swapPanel: (panelGrpIndx: number, i: number, j: number) => boolean;
}) => {
	const addFilesInputRef = useRef<HTMLInputElement>(null);
	const createToast = useContext(ToastsContext);

	const [modalImgData, dispatchModalImgData] = useReducer(modalImgReducer, {
		data: undefined,
		vizState: false,
		indx: -1,
	});

	return (
		<div className="relative w-full h-fit rounded-lg border-gray-300 border-2 border-solid bg-gray-50">
			<div className="relativetext-white bg-slate-500 p-2 rounded-md">
				{props.panelTitle}
			</div>
			<div className="relative w-full h-fit flex flex-row justify-center items-center flex-wrap gap-2 p-2 my-2 bg-gray-50">
				{props.panel.map((d, i) => (
					<CardAction
						disabledControl={props.disabledControl}
						key={d.id}
						deletePanel={() => props.deletePanel(props.panelGrpIndx, i)}
						swapPanelLeft={() =>
							props.swapPanel(props.panelGrpIndx, i, i - 1 < 0 ? 0 : i - 1)
						}
						swapPanelRight={() =>
							props.swapPanel(
								props.panelGrpIndx,
								i,
								i + 1 >= props.panel.length ? i : i + 1,
							)
						}
						modalDataSetter={() =>
							dispatchModalImgData({
								type: ModalImgDataActionKind.updateModalData,
								payload: {
									datas: props.panel,
									indx: i,
								},
							})
						}>
						<div className="relative rounded-md flex flex-col border-rose-300 border">
							<div className="border border-indigo-100 overflow-hidden rounded-md w-44 min-h-60 h-auto relative flex items-center justify-center">
								<img
									src={d.url}
									alt={d.name}
									className="block max-w-44 h-auto max-h-60 rounded-md hover:scale-[1.04] transition-transform duration-300"
								/>
							</div>
							<div className="text-black text-center" title={d.name}>
								{d.name.length < MaxFileNameLen
									? d.name
									: `${d.name.slice(0, MaxFileNameLen)}...`}
							</div>
						</div>
					</CardAction>
				))}
			</div>
			{!props.disabledControl && (
				<>
					{/* Reset */}
					<button
						title="Reset Panels selection"
						className="block border-none ring-1 rounded-full bg-rose-600/30 backdrop-blur-md w-fit absolute right-0 top-20 md:top-16 z-1 p-0"
						onClick={() => {
							props.deletePanelGrp(props.panelGrpIndx);
						}}>
						<XMarkIcon className="w-8 h-8 stroke-rose-600" />
					</button>
					{/* Add More panels */}
					<button
						className="block border-none ring-1 rounded-full bg-blue-300/30 backdrop-blur-md w-fit absolute left-[50%] translate-x-[-50%] md:left-full md:translate-x-[-110%] bottom-2 z-[1] p-0"
						onClick={() => {
							// Simulate input click
							if (addFilesInputRef.current) addFilesInputRef.current.click();
						}}>
						<PlusIcon className="w-16 h-16 stroke-gray-800" />
					</button>
				</>
			)}
			{/* TODO: Extract component */}
			<input
				ref={addFilesInputRef}
				type="file"
				name="add files"
				multiple
				accept="image/*"
				className="hidden"
				onChange={(e) => {
					console.log("panel added");
					const len = props.addPanel(
						props.panelGrpIndx,
						fileInputFileSrc(e),
					).length;
					if (createToast) {
						const selectedFiles = e.target.files?.length;
						if (selectedFiles && selectedFiles === len)
							createToast({
								type: "success",
								children: <div>Successfully Uploaded {len} files</div>,
							});
						else
							createToast({
								type: "warning",
								children: (
									<div>
										Out of {selectedFiles} selected, only {len} files are added
									</div>
								),
							});
					}
				}}
			/>

			{/* Modal */}
			{modalImgData.vizState && modalImgData.data && (
				<ModalImg
					disabledControl={props.disabledControl}
					moadlImgData={modalImgData}
					modalToggle={() =>
						dispatchModalImgData({
							type: ModalImgDataActionKind.toggleViz,
						})
					}
					setModalViz={(vizState: boolean) =>
						dispatchModalImgData({
							type: ModalImgDataActionKind.setModalViz,
							payload: vizState,
						})
					}
					updateModalDataWithPrev={
						modalImgData.indx - 1 >= 0
							? () =>
									dispatchModalImgData({
										type: ModalImgDataActionKind.updateModalData,
										payload: {
											datas: props.panel,
											indx: capIndx(modalImgData.indx - 1, props.panel.length),
										},
									})
							: undefined
					}
					updateModalDataWithNext={
						modalImgData.indx + 1 < props.panel.length
							? () =>
									dispatchModalImgData({
										type: ModalImgDataActionKind.updateModalData,
										payload: {
											datas: props.panel,
											indx: capIndx(modalImgData.indx + 1, props.panel.length),
										},
									})
							: undefined
					}
					deleteHandler={() => {
						props.deletePanel(props.panelGrpIndx, modalImgData.indx);
						// Set modal with a new data
						if (modalImgData.indx + 1 < props.panel.length)
							dispatchModalImgData({
								type: ModalImgDataActionKind.updateModalData,
								payload: { datas: props.panel, indx: modalImgData.indx + 1 },
							});
						else if (modalImgData.indx - 1 >= 0)
							dispatchModalImgData({
								type: ModalImgDataActionKind.updateModalData,
								payload: { datas: props.panel, indx: modalImgData.indx - 1 },
							});
						else
							dispatchModalImgData({
								type: ModalImgDataActionKind.setModalViz,
								payload: false,
							});
					}}
				/>
			)}
		</div>
	);
};

export default PanelPreview;
