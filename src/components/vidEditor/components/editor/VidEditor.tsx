import React, { useState } from "react";
import { Play, Pause, Plus, Settings, Download } from "lucide-react";

const VideoEditor = () => {
	const [currentTime, setCurrentTime] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);

	// Mock data
	const panels = [
		{ id: 1, startTime: 0, duration: 5 },
		{ id: 2, startTime: 5, duration: 3 },
	];

	const audioTracks = [{ id: 1, startTime: 0, duration: 8 }];

	return (
		<div className="flex flex-col h-screen bg-gray-900 text-white">
			{/* Top Bar */}
			<div className="flex justify-between items-center p-4 bg-gray-800">
				<h1 className="text-xl font-bold">Comic Video Editor</h1>
				<div className="space-x-4">
					<button className="px-4 py-2 bg-blue-600 rounded-lg flex items-center gap-2">
						<Settings size={16} />
						Settings
					</button>
					<button className="px-4 py-2 bg-green-600 rounded-lg flex items-center gap-2">
						<Download size={16} />
						Export
					</button>
				</div>
			</div>
			{/* Main Content */}
			<div className="flex flex-1 overflow-hidden">
				{/* Left Sidebar - Assets */}
				<div className="w-64 bg-gray-800 p-4">
					<h2 className="font-bold mb-4">Assets</h2>
					<button className="w-full px-4 py-2 bg-blue-600 rounded-lg flex items-center gap-2 justify-center">
						<Plus size={16} />
						Add Panel
					</button>

					<div className="mt-4 space-y-2">
						{panels.map((panel) => (
							<div key={panel.id} className="p-2 bg-gray-700 rounded">
								Panel {panel.id}
							</div>
						))}
					</div>
				</div>

				{/* Center - Preview */}
				<div className="flex-1 p-4">
					<div className="aspect-video bg-black rounded-lg flex items-center justify-center mb-4">
						Preview
					</div>

					{/* Controls */}
					<div className="flex items-center gap-4">
						<button
							className="p-2 bg-blue-600 rounded-full"
							onClick={() => setIsPlaying(!isPlaying)}>
							{isPlaying ? <Pause size={20} /> : <Play size={20} />}
						</button>
						<span>00:00 / 00:30</span>
					</div>
				</div>
			</div>
			{/* Timeline */}
			<div className="h-48 bg-gray-800 p-4">
				<div className="flex gap-4">
					<div className="w-32">Tracks</div>
					<div className="flex-1">
						{/* Time markers */}
						<div className="flex justify-between mb-2">
							{[...Array(6)].map((_, i) => (
								<span key={i}>{i * 5}s</span>
							))}
						</div>

						{/* Panels track */}
						<div className="h-16 bg-gray-700 rounded mb-2 relative">
							{panels.map((panel) => (
								<div
									key={panel.id}
									className="absolute h-full bg-blue-600 rounded"
									style={{
										left: `${(panel.startTime / 30) * 100}%`,
										width: `${(panel.duration / 30) * 100}%`,
									}}
								/>
							))}
						</div>

						{/* Audio track */}
						<div className="h-16 bg-gray-700 rounded relative">
							{audioTracks.map((track) => (
								<div
									key={track.id}
									className="absolute h-full bg-green-600 rounded"
									style={{
										left: `${(track.startTime / 30) * 100}%`,
										width: `${(track.duration / 30) * 100}%`,
									}}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VideoEditor;
