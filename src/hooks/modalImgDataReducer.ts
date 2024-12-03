import { InputData, ModalImgData } from "../components/inputDataType";

export enum ModalImgDataActionKind {
	toggleViz,
	setModalViz,
	updateModalData,
}

// interface ModalDataAction<T> {
// 	type: ModalDataActionKind;
// 	payload: { datas: T[]; indx: number } | null;
// }

type ModalDataAction =
	| { type: ModalImgDataActionKind.toggleViz }
	| { type: ModalImgDataActionKind.setModalViz; payload: boolean }
	| {
			type: ModalImgDataActionKind.updateModalData;
			payload: { datas: InputData[]; indx: number };
	  };

const modalImgReducer = (
	state: ModalImgData,
	action: ModalDataAction,
): ModalImgData => {
	switch (action.type) {
		case ModalImgDataActionKind.toggleViz:
			return {
				...state,
				vizState: !state.vizState,
			};

		case ModalImgDataActionKind.setModalViz:
			return { ...state, vizState: action.payload };

		case ModalImgDataActionKind.updateModalData:
			if (action.payload) {
				const { datas, indx } = action.payload;
				if (indx < 0 || indx >= datas.length) {
					console.error(`Invalid index: ${indx}`);
					return { ...state };
				} else return { vizState: true, indx, data: datas[indx] };
			} else return { ...state };

		default:
			throw new Error(`invalid action: ${action}`);
	}
};

export default modalImgReducer;
