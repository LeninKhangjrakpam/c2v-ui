// TODO: Refactor code to utils components
// Extract `add file` button to a components
// Make `Toast` Componnet for notifying user of generated or dropped files
// Create ReadableSize Function
// Move some function from useFileInput hooks to utils

import { ReactSortable } from "react-sortablejs";
import { InputData, SortableI } from "./inputDataType";

import CardAction from "./cardAction";
import { MaxFileNameLen } from "../utils/constants";
import { useReducer } from "react";
import modalImgReducer, {
	ModalImgDataActionKind,
} from "../hooks/modalImgDataReducer";
import ModalImg from "./modal";
import { capIndx } from "../utils/util";

interface GridContainerProps<T extends SortableI> {
	disabledControl: boolean;
	children: React.JSX.Element[];
	list?: T[];
	setList?: React.Dispatch<React.SetStateAction<T[]>>;
}

const GridContainer = <T extends SortableI>(
	props: GridContainerProps<T>,
): React.JSX.Element => {
	if (!props.disabledControl && (!props.list || !props.setList))
		throw new Error(
			`list and setList should be provided for control not disabled compoments`,
		);
	return props.disabledControl ? (
		<div className="rounded-lg border-gray-300 border-2 border-solid flex flex-row justify-center items-center flex-wrap gap-2 p-2 my-2 bg-gray-50">
			{props.children}
		</div>
	) : (
		<ReactSortable
			list={props.list}
			setList={props.setList}
			className="rounded-lg border-gray-300 border-2 border-solid flex flex-row justify-center items-center flex-wrap gap-2 p-2 my-2 bg-gray-50">
			{props.children}
		</ReactSortable>
	);
};

export interface GridSortableProps<T extends SortableI> {
	disabledControl: boolean;
	list: T[];
	setList: React.Dispatch<React.SetStateAction<T[]>>;
	deleteCard: (i: number) => void;
	swapCard: (i: number, j: number) => void;
}

// const GridSortable = (props: GridSortableProps) => {
// 	return <GridContainer
// 	{...props}>
// 		{props.}
// 	</GridContainer>
// }

const GridSortableImg = (props: GridSortableProps<InputData>) => {
	const [modalImgData, dispatchModalImgData] = useReducer(modalImgReducer, {
		data: undefined,
		vizState: false,
		indx: -1,
	});

	return (
		<>
			<GridContainer
				disabledControl={props.disabledControl}
				list={props.list}
				setList={props.setList}>
				{props.list.map((d, i) => (
					<CardAction
						disabledControl={props.disabledControl}
						key={d.id}
						deletePanel={() => props.deleteCard(i)}
						swapPanelLeft={() => props.swapCard(i, i - 1 < 0 ? 0 : i - 1)}
						swapPanelRight={() =>
							props.swapCard(
								i,
								i + 1 >= props.list.length ? props.list.length - 1 : i + 1,
							)
						}
						modalDataSetter={() =>
							dispatchModalImgData({
								type: ModalImgDataActionKind.updateModalData,
								payload: {
									datas: props.list,
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
			</GridContainer>
			{/* Image Modal */}
			{modalImgData.vizState && modalImgData.data && (
				<ModalImg
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
											datas: props.list,
											indx: capIndx(modalImgData.indx - 1, props.list.length),
										},
									})
							: undefined
					}
					updateModalDataWithNext={
						modalImgData.indx + 1 < props.list.length
							? () =>
									dispatchModalImgData({
										type: ModalImgDataActionKind.updateModalData,
										payload: {
											datas: props.list,
											indx: capIndx(modalImgData.indx + 1, props.list.length),
										},
									})
							: undefined
					}
					deleteHandler={() => {
						props.deleteCard(modalImgData.indx);
						// Set modal with a new data
						if (modalImgData.indx + 1 < props.list.length)
							dispatchModalImgData({
								type: ModalImgDataActionKind.updateModalData,
								payload: { datas: props.list, indx: modalImgData.indx + 1 },
							});
						else if (modalImgData.indx - 1 >= 0)
							dispatchModalImgData({
								type: ModalImgDataActionKind.updateModalData,
								payload: { datas: props.list, indx: modalImgData.indx - 1 },
							});
						else
							dispatchModalImgData({
								type: ModalImgDataActionKind.setModalViz,
								payload: false,
							});
					}}
				/>
			)}
		</>
	);
};

export default GridSortableImg;
