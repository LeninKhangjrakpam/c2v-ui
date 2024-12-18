// TODO: Add Loading Status

import { PanelData } from "../inputData.type";
import Accordion from "./accordion";
import { PanelDataHandler } from "../../hooks/usePanelData";
import PanelPreview from "../panelPreview";
import { LinkIcon } from "@heroicons/react/24/outline";

export interface PanelImgAccordionProps {
	accordionTitleText: string;
	// children: JSX.Element;
	panels: PanelData[];
	setPanels: React.Dispatch<React.SetStateAction<PanelData[]>>;
	panelDataHandler: PanelDataHandler;
	generateHandler: () => void;
	disabledControl: boolean;
}

const PanelImgAccordion = (props: PanelImgAccordionProps) => {
	const totalPanels = props.panels.reduce(
		(acc, ps) => acc + ps.panels.length,
		0,
	);

	return (
		<Accordion
			containerClassName={
				"w-full rounded-lg border-gray-300 border-2 border-solid my-2"
			}
			headerClassName="bg-gray-500"
			accordionHeader={
				<div className="text-slate-100 text-lg">{props.accordionTitleText}</div>
			}>
			<>
				<div className="relative w-full h-fit">
					{/* Panels from individual Page */}
					{props.panels.map((panel, i) => (
						<div
							key={i}
							className="relative flex flex-col justify-center items-center flex-nowrap gap-2 my-2 bg-gray-50">
							<PanelPreview
								panelTitle={
									<div className="relative text-white bg-slate-500 p-2 rounded-md w-full md:flex md:flex-row md:justify-between">
										<div className="text-nowrap text-ellipsis">
											{/* TODO: dispay the full filename by a toggler */}
											Page: {panel.pageFileName}{" "}
											<LinkIcon className="w-4 h-4 inline stroke-blue-100" />
										</div>
										<div className="text-nowrap">{`(${panel.panels.length}/${totalPanels}) panels`}</div>
									</div>
								}
								panelGrpIndx={i}
								disabledControl={props.disabledControl}
								panel={panel.panels}
								addPanel={props.panelDataHandler.addPanel}
								deletePanelGrp={props.panelDataHandler.deletePanelGrp}
								deletePanel={props.panelDataHandler.deletePanel}
								swapPanel={props.panelDataHandler.swapPanel}
							/>
						</div>
					))}
				</div>
				{/* Buttons */}
				{!props.disabledControl && (
					<div className="flex flex-row w-full justify-center gap-2">
						<button
							onClick={props.panelDataHandler.resetPanel}
							className="rounded-md w-32 bg-gray-600 hover:bg-slate-500 text-white text-xl px-4 py-2">
							Reset
						</button>
						<button
							onClick={props.generateHandler}
							className="rounded-md w-32 bg-gray-600 hover:bg-slate-500 text-white text-xl px-4 py-2">
							Generate
						</button>
					</div>
				)}
			</>
		</Accordion>
	);
};

export default PanelImgAccordion;
