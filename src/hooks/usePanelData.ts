import { useState } from "react";
import { PanelData, InputData } from "../components/inputData.type";
import { getUUID } from "../utils/util";

export type PanelDataHandler = {
	addPanelGrp: (pageFileName: string, panel: File[]) => InputData[];
	resetPanel: () => void;
	deletePanelGrp: (panelIndx: number) => boolean;
	swapPanelGrp: (i: number, j: number) => boolean;
	addPanel: (panelGrpIndx: number, panel: File[]) => InputData[];
	deletePanel: (panelGrpIndx: number, panelIndx: number) => boolean;
	swapPanel: (panelGrpIndx: number, i: number, j: number) => boolean;
};

const usePanelData = (): [
	panels: PanelData[],
	setPanels: React.Dispatch<React.SetStateAction<PanelData[]>>,
	panelDataHandler: PanelDataHandler,
] => {
	const [panels, setPanels] = useState<PanelData[]>([]);

	// Add panels from a different page
	// return added panel
	const addPanelGrp = (pageFileName: string, panel: File[]): InputData[] => {
		if (panel.length === 0) return [];

		const panelDatas: InputData[] = [];
		for (const p of panel) {
			if (/image\/.*/.test(p.type)) {
				panelDatas.push({
					file: p,
					name: p.name,
					url: URL.createObjectURL(p),
					id: getUUID(),
					type: p.type,
					size: p.size,
					lastModified: new Date(p.lastModified),
				});
			}
		}
		setPanels((ps) => [...ps, { pageFileName, panels: panelDatas }]);
		return panelDatas;
	};

	// Clear all panels
	const resetPanel = () => {
		// Revoke all object url
		for (const panel of panels) {
			panel.panels.forEach((p) => URL.revokeObjectURL(p.url));
		}
		setPanels([]);
	};

	// Delete whole panel extracted from a page
	const deletePanelGrp = (panelIndx: number): boolean => {
		if (panelIndx < 0 || panelIndx >= panels.length) return false;
		// Revoke URL
		panels[panelIndx].panels.forEach((p) => URL.revokeObjectURL(p.url));
		setPanels((p) => p.filter((_, i) => i !== panelIndx));
		return true;
	};

	// Swap panel order
	const swapPanelGrp = (i: number, j: number): boolean => {
		if (i < 0 || i >= panels.length) return false;
		if (j < 0 || j >= panels.length) return false;
		setPanels((p) => {
			const _p = [...p];
			const tmp = _p[i];
			_p[i] = _p[j];
			_p[j] = tmp;
			return _p;
		});
		return true;
	};

	// Add new Panel to a page
	const addPanel = (panelsGrpIndx: number, panel: File[]): InputData[] => {
		if (panelsGrpIndx < 0 || panelsGrpIndx >= panels.length) return [];
		const fData: InputData[] = [];
		for (const p of panel) {
			if (/image\/.*/.test(p.type)) {
				const fDataI: InputData = {
					file: p,
					name: p.name,
					url: URL.createObjectURL(p),
					id: getUUID(),
					type: p.type,
					size: p.size,
					lastModified: new Date(p.lastModified),
				};
				fData.push(fDataI);
			}
		}
		// Add accepted file to corresponding panel grp
		setPanels((ps) => {
			fData.forEach((p) => ps[panelsGrpIndx].panels.push(p));
			return ps;
		});
		return fData;
	};

	const deletePanel = (panelsGrpIndx: number, indx: number): boolean => {
		console.log("Delete single Panel: ", panelsGrpIndx, indx);
		if (panelsGrpIndx < 0 || panelsGrpIndx >= panels.length) return false;
		if (indx < 0 || indx >= panels[panelsGrpIndx].panels.length) return false;

		setPanels((ps) => {
			ps = [...ps];
			const psGrp = ps[panelsGrpIndx].panels.filter((_, i) => i !== indx);
			if (psGrp.length === 0) return ps.filter((_, i) => panelsGrpIndx !== i);
			else {
				ps[panelsGrpIndx].panels = psGrp;
				return ps;
			}
		});
		return true;
	};
	const swapPanel = (panelsGrpIndx: number, i: number, j: number): boolean => {
		if (panelsGrpIndx < 0 || panelsGrpIndx >= panels.length) return false;
		if (i < 0 || i >= panels[panelsGrpIndx].panels.length) return false;
		if (j < 0 || j >= panels[panelsGrpIndx].panels.length) return false;

		setPanels((ps) => {
			const nPs = [...ps];
			const tmp = nPs[panelsGrpIndx].panels[i];
			nPs[panelsGrpIndx].panels[i] = nPs[panelsGrpIndx].panels[j];
			nPs[panelsGrpIndx].panels[j] = tmp;
			return nPs;
		});
		return true;
	};

	return [
		panels,
		setPanels,
		{
			addPanelGrp,
			resetPanel,
			deletePanelGrp,
			swapPanelGrp,
			addPanel,
			deletePanel,
			swapPanel,
		},
	];
};

export default usePanelData;
