import type { AudioTracksI, CaptionTracksI, SlideTracksI } from "./Test1";
import AudioSlidePreview from "./Test1";

const App = () => {
	const audioTracks: AudioTracksI[] = [
		{
			// trackName: "Background Music",
			tracks: [
				{
					start: 0,
					end: 10,
					trimStart: 0,
					trimEnd: 10,
					file: { url: "/Comic2Video/1.wav" },
				},
				{
					start: 10,
					end: 20,
					trimStart: 10,
					trimEnd: 20,
					file: { url: "/Comic2Video/2.wav" },
				},
				{
					start: 5,
					end: 15,
					trimStart: 5,
					trimEnd: 15,
					file: { url: "/Comic2Video/2.wav" },
				},
			],
		},
		{
			// trackName: "Narration",
			tracks: [
				{
					start: 20,
					end: 35,
					trimStart: 20,
					trimEnd: 35,
					file: { url: "/Comic2Video/3.wav" },
				},
			],
		},
	];

	const slideTracks: SlideTracksI[] = [
		{
			tracks: [
				{ start: 0, end: 8, file: { imageUrl: "/Comic2Video/1.png" } },
				{ start: 8, end: 16, file: { imageUrl: "/Comic2Video/2.png" } },
				{ start: 16, end: 24, file: { imageUrl: "/Comic2Video/3.png" } },
			],
		},
		{
			tracks: [
				{ start: 5, end: 10, file: { imageUrl: "/Comic2Video/15.jpg" } },
				{ start: 15, end: 19, file: { imageUrl: "/Comic2Video/20.png" } },
				{ start: 30, end: 35, file: { imageUrl: "/Comic2Video/16.jpg" } },
			],
		},
	];
	const captionTracks: CaptionTracksI[] = [
		{ file: { url: "/Comic2Video/caption2.srt" } },
	];
	const duration = Math.max(
		...audioTracks.flatMap((d) => d.tracks).map((d) => d.end),
		...slideTracks.flatMap((d) => d.tracks).map((d) => d.end),
	);

	return (
		<div className="app">
			<h1>Audio Slideshow Preview</h1>
			<AudioSlidePreview
				audioTracks={audioTracks}
				slideTracks={slideTracks}
				captionTracks={captionTracks}
				duration={duration}
			/>
			{/* <AudioSlidePreview audioTracks={audioTracks} slides={slides} fps={30} /> */}
		</div>
	);
};

export default App;
