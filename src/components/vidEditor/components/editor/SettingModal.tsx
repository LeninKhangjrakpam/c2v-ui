import React, { useState } from "react";
import { X } from "lucide-react";
import { VidSettingType } from "./type";
import {
	resizeMode,
	vidTransition,
	vidResolution,
	vidBackground,
} from "../../utils/constants";
import { checkDuration, checkFPS } from "../../utils/helper";

const SettingModal = ({
	config,
	setConfig,
	viz,
	setViz,
}: {
	config: VidSettingType;
	setConfig: React.Dispatch<React.SetStateAction<VidSettingType>>;
	viz: boolean;
	setViz: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const [inputErr, setInputErr] = useState<{ [key: string]: string[] }>({});

	return !viz ? (
		<></>
	) : (
		<div className="fixed w-screen h-screen bg-gray-600/70  z-[99] flex items-center justify-center top-0 left-0">
			<div className="border border-gray-300 min-w-72 w-80 max-w-[100vw] rounded-lg bg-white">
				<div className="p-2">
					<div className="flex justify-between">
						<div className="text-2xl font-semibold">Setting</div>
						<button onClick={() => setViz(false)}>
							<X size={20} />
						</button>
					</div>
					<hr className="border border-gray-200 bg-gray-200" />
					<div className="p-1">
						<div>
							<div className="flex justify-between items-center my-1">
								<span>Duration</span>
								<span>
									<input
										type="number"
										name="duration"
										min={1}
										max={1 * 60 * 60}
										step={1}
										value={config.duration}
										className={`border  rounded-md p-1 bg-gray-50 text-right w-min ${
											inputErr.duration && inputErr.duration.length > 0
												? "border-rose-500"
												: "border-gray-300"
										}`}
										onChange={(e) => {
											const dur = +e.target.value; // seconds
											const errs = checkDuration(dur);
											if (errs.length === 0) {
												setInputErr({ ...inputErr, duration: [] });
											} else setInputErr({ ...inputErr, duration: errs });
											setConfig({ ...config, duration: dur });
										}}
									/>{" "}
									sec
								</span>
							</div>
							{/* Error Message */}
							{inputErr.duration && inputErr.duration.length > 0 && (
								<div className="text-right text-[12px] text-rose-500">
									{inputErr.duration.join(",")}
								</div>
							)}
						</div>

						<div className="flex justify-between items-center my-1">
							<span>Video Background Color</span>
							<span>
								<select
									name="vidbackground"
									className="border border-gray-300 rounded-md p-1 bg-gray-50"
									value={config.vidBackground}
									onChange={(e) =>
										setConfig({ ...config, vidBackground: e.target.value })
									}>
									{vidBackground.map((optn, i) => (
										<option key={i} value={optn}>
											{optn}
										</option>
									))}
								</select>
							</span>
						</div>
						<div className="flex justify-between items-center my-1">
							<span>Transition</span>
							<span>
								<select
									name="transition"
									className="border border-gray-300 rounded-md p-1 bg-gray-50"
									value={config.transition}
									onChange={(e) =>
										setConfig({
											...config,
											transition: e.target.value,
										})
									}>
									{vidTransition.map((optn, i) => (
										<option key={i} value={optn}>
											{optn}
										</option>
									))}
								</select>
							</span>
						</div>
						<div>
							<div className="flex justify-between items-center my-1">
								<span>Frame Rate</span>
								<span>
									<input
										name="frameRate"
										type="number"
										min={12}
										max={240}
										step={1}
										value={config.frameRate}
										className={`border  rounded-md p-1 bg-gray-50 text-right w-min ${
											inputErr.frameRate && inputErr.frameRate.length > 0
												? "border-rose-500"
												: "border-gray-300"
										}`}
										onChange={(e) => {
											const fps = +e.target.value;
											const errs = checkFPS(fps);

											if (errs.length === 0) {
												setInputErr({ ...inputErr, frameRate: [] });
											} else setInputErr({ ...inputErr, frameRate: errs });
											setConfig({ ...config, frameRate: fps });
										}}
									/>{" "}
									fps
								</span>
							</div>
							{inputErr.frameRate && inputErr.frameRate.length > 0 && (
								<div className="text-right text-[12px] text-rose-500">
									{inputErr.frameRate.join(",")}
								</div>
							)}
						</div>
						<div className="flex justify-between items-center my-1">
							<span>Resolution</span>
							<span>
								<select
									name="resolution"
									className="border border-gray-300 rounded-md p-1 bg-gray-50"
									value={config.resolution}
									onChange={(e) =>
										setConfig({
											...config,
											resolution: +e.target.value,
										})
									}>
									{vidResolution.map((optn, i) => (
										<option key={i} value={optn}>
											{optn}p
										</option>
									))}
								</select>
							</span>
						</div>
						<div className="flex justify-between items-center my-1">
							<span>Resize Mode</span>
							<span>
								<select
									name="resizeMode"
									className="border border-gray-300 rounded-md p-1 bg-gray-50"
									value={config.resizeMode}
									onChange={(e) =>
										setConfig({
											...config,
											resizeMode: e.target.value,
										})
									}>
									{resizeMode.map((optn, i) => (
										<option key={i} value={optn}>
											{optn}
										</option>
									))}
								</select>
							</span>
						</div>
					</div>
					{/* <div className="text-wrap">{JSON.stringify(config)}</div> */}
					<hr className="border border-gray-200 bg-gray-200" />
					<div className="w-full mt-2">
						<button
							className="rounded-md bg-blue-500 p-2 text-white text-center min-w-24 mx-auto relative block"
							onClick={() => {
								setViz(false);
							}}
							disabled={Object.keys(inputErr).some(
								(key) => inputErr[key].length > 0,
							)}>
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingModal;
