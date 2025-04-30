import { useEffect, useState } from "react";
import useFfmpeg from "../context/ffmpeg/useFfmpegContext";
import {
	Captions,
	ChevronDown,
	ChevronRight,
	FileAudio,
	Folder,
	FolderOpen,
	MessageCircle,
	RefreshCcw,
	SquareMenu,
} from "lucide-react";

export default function AssetExplorer() {
	const { ffmpeg, loadState } = useFfmpeg();
	const [panelFiles, setPanelFiles] = useState<string[]>([]);

	useEffect(() => {
		if (loadState === false && ffmpeg && ffmpeg.getFfmpeg() !== null) {
			ffmpeg
				.getFfmpeg()
				.listDir(".")
				.then((d) => {
					console.log(d);
					setPanelFiles(d.map((di) => di.name));
				});
		}
	}, [ffmpeg, loadState]);

	const refreshFS = () => {
		if (loadState === false && ffmpeg && ffmpeg.getFfmpeg() !== null) {
			ffmpeg
				.getFfmpeg()
				.listDir(".")
				.then((d) => {
					console.log(d);
					setPanelFiles(d.map((di) => di.name));
				});
		}
	};
	return (
		<div className="border border-slate-300 bg-slate-300 rounded-md max-w-full max-h-full w-full h-full overflow-auto">
			<button onClick={refreshFS}>
				<RefreshCcw size={16} />
			</button>
			<AssetFileDropDown header={<div>Panels ({12})</div>}>
				{panelFiles.map((d, i) => (
					<div key={i} className="flex flex-row flex-nowrap items-center gap-1">
						<SquareMenu size={14} />
						{d}
					</div>
				))}
			</AssetFileDropDown>
			<AssetFileDropDown
				header={<div>Panels ({12})</div>}
				children={Array.from({ length: 3 }, (_, i) => (
					<div key={i} className="flex flex-row flex-nowrap items-center gap-1">
						<SquareMenu size={14} />
						{`${i}.jpeg`}
					</div>
				))}
			/>
			<AssetFileDropDown
				header={<div>Panels ({12})</div>}
				children={Array.from({ length: 3 }, (_, i) => (
					<div key={i} className="flex flex-row flex-nowrap items-center gap-1">
						<SquareMenu size={14} />
						{`${i}.jpeg`}
					</div>
				))}
			/>
			<AssetFileDropDown
				header={<div>Speech Bubbles</div>}
				children={Array.from({ length: 3 }, (_, i) => (
					<div key={i} className="flex flex-row flex-nowrap items-center gap-1">
						<MessageCircle size={14} />
						<div> {`${i}.jpeg`}</div>
					</div>
				))}
			/>
			<AssetFileDropDown
				header={<div>Audios</div>}
				children={Array.from({ length: 3 }, (_, i) => (
					<div key={i} className="flex flex-row flex-nowrap items-center gap-1">
						<FileAudio size={14} />
						<div>{`${i}.mp3`}</div>
					</div>
				))}
			/>
			<AssetFileDropDown
				header={<div>Captions</div>}
				children={Array.from({ length: 30 }, (_, i) => (
					<div
						key={i}
						className="flex flex-row flex-nowrap items-center gap-1 text-nowrap">
						<div>
							<Captions size={14} />
						</div>
						<div>{`${i}.txt`}</div>
					</div>
				))}
			/>
		</div>
	);
}

export const AssetFileDropDown = ({
	header,
	children,
}: {
	header: JSX.Element;
	children: JSX.Element[];
}) => {
	const [dropdownViz, setDropdownViz] = useState<boolean>(false);
	return (
		<>
			<div
				className="flex flex-row flex-nowrap items-center text-md gap-1 w-full hover:bg-slate-200 hover:cursor-pointer overflow-auto"
				onClick={() => setDropdownViz((d) => !d)}>
				{dropdownViz ? (
					<>
						<ChevronDown size={16} />
						<FolderOpen size={16} />
					</>
				) : (
					<>
						<ChevronRight size={16} />
						<Folder size={16} />
					</>
				)}
				<div className="font-bold">{header}</div>
			</div>
			{dropdownViz && (
				<>
					{children.map((d, i) => (
						<div
							className="pl-8 w-full hover:bg-slate-200 hover:cursor-pointer"
							key={i}>
							{d}
						</div>
					))}
				</>
			)}
		</>
	);
};
