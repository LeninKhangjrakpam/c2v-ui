import {
	AudioTrackI,
	CaptionI,
	PanelTrackI,
	SpeechBubbleTrackI,
} from "../components/editor/type";

export function generateFfmpegCommand(
	panelTrackDatas: PanelTrackI[],
	speechBubbleTracksDatas: SpeechBubbleTrackI[],
	audioTrackDatas: AudioTrackI[],
	caption: CaptionI,
): string[] {
	// filename start stop:
	// 1.png 0 3,
	// 2.png 3 6,
	// 3.png 6 10,
	// 4.png 4 8,
	// 5.png 13 18

	// audio filename start stop trim-start trim-end:
	// a1.mp3 0 8 0 8,
	// a2.mp3 8 14 0 6,
	// a3.mp3 14 19 0 5,
	// a4.mp3 17 20 0 3

	// """
	// ffmpeg -y \
	//   -f lavfi -t 20 -i color=c=black:s=426x240:r=30 \
	//   -loop 1 -t 3 -i 1.png \
	//   -loop 1 -t 3 -i 2.png \
	//   -loop 1 -t 4 -i 3.png \
	//   -loop 1 -t 5 -i 4.png \
	//   -loop 1 -t 5 -i 5.jpg \
	//   -i t1.mp3 -i t2.mp3 -i t3.mp3 -i t4.mp3 \
	//   -filter_complex "\
	//   [1]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i1]; \
	//   [2]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i2]; \
	//   [3]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i3]; \
	//   [4]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i4]; \
	//   [5]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i5]; \
	//   [0][i1]overlay=enable='between(t,0,3)'[v1]; \
	//   [v1][i2]overlay=enable='between(t,3,6)'[v2]; \
	//   [v2][i3]overlay=enable='between(t,6,10)'[v3]; \
	//   [v3][i4]overlay=enable='between(t,4,8)'[v4]; \
	//   [v4][i5]overlay=enable='between(t,13,18)'[v]; \
	//   [6]atrim=start=0:end=8,adelay=0|0[a1_trimmed]; \
	//   [7]atrim=start=0:end=6,adelay=8000|8000[a2_trimmed]; \
	//   [8]atrim=start=0:end=5,adelay=14000|14000[a3_trimmed]; \
	//   [9]atrim=start=0:end=3,adelay=17000|17000[a4_trimmed]; \
	//   [a1_trimmed][a2_trimmed][a3_trimmed][a4_trimmed]amix=inputs=4:duration=first:dropout_transition=3[a]" \
	//   -map "[v]" -map "[a]" -c:v libx264 -c:a aac -pix_fmt yuva420p -r 30 -t 20 output2.mp4

	const vidTotalLength = 20;
	const backgroundColor = "black";
	const frameRate = 30; // fps
	const vidResolutionOptns = [
		{ resolution: "240", width: 426, height: 240 },
		{ resolution: "360", width: 426, height: 240 },
	];
	const vidResolution = vidResolutionOptns.filter(
		(d) => d.resolution === "240",
	)[0];
	const extension = "mp4";
	const vidFilename = `output.${extension}`;

	const cmnd: string[] = [
		"ffmpeg",
		"-y",
		"-f",
		"lavfi", // lib
		"-t",
		`${vidTotalLength}`, // totalVideoLength
		"-i",
		`color=c=${backgroundColor}:s=${vidResolution.width}x${vidResolution.height}:r=${frameRate}`,
	];

	const inputs: string[] = [];
	const filters: string[] = ["-filter_complex"]; // filter for images
	const overlayComd: string[] = []; // create overlay for images
	let fI = 0;
	panelTrackDatas.forEach((tracks) => {
		tracks.tracks.forEach((tr) => {
			inputs.push(
				...[
					"-loop",
					"1",
					"-t",
					`${tr.end - tr.start}`,
					"-i",
					`${tr.file.name}`,
				],
			);
			filters.push(
				`[${fI + 1}]scale=${vidResolution.width}:${
					vidResolution.height
				}:force_original_aspect_ratio=decrease,pad=${vidResolution.width}:${
					vidResolution.height
				}:(ow-iw)/2:(oh-ih)/2,setsar=1[i${fI + 1}];`,
			);
			overlayComd.push(
				`[${fI}][i${fI + 1}]overlay=enable='between(t,${tr.start},${
					tr.end
				})'[v${fI + 1}];`,
			);
			fI++;
		});
	});
	// Change last overlay output
	const lastOverlayComnd = overlayComd[overlayComd.length - 1];
	overlayComd[overlayComd.length - 1] =
		lastOverlayComnd.slice(0, lastOverlayComnd.length - 3) + `[v]`;

	cmnd.push(...inputs);
	cmnd.push(...filters);
	cmnd.push(...overlayComd);

	//   [6]atrim=start=0:end=8,adelay=0|0[a1_trimmed]; \
	//   [7]atrim=start=0:end=6,adelay=8000|8000[a2_trimmed]; \
	//   [8]atrim=start=0:end=5,adelay=14000|14000[a3_trimmed]; \
	//   [9]atrim=start=0:end=3,adelay=17000|17000[a4_trimmed]; \
	//   [a1_trimmed][a2_trimmed][a3_trimmed][a4_trimmed]amix=inputs=4:duration=first:dropout_transition=3[a]" \

	const decoderCmd: string[] = [
		"-map",
		"[v]",
		"-map",
		"[a]",
		"-c:v",
		"libx264",
		"-c:a",
		"aac",
		"-pix_fmt",
		"yuva420p",
		"-r",
		`${frameRate}`,
		"-t",
		`${vidTotalLength}`,
		`${vidFilename}`,
	];

	cmnd.push(...decoderCmd);

	console.log(`ffmpeg cmnd: `, cmnd);
	return cmnd;
}

export const cmm1 = [
	"-y",
	"-f",
	"lavfi",
	"-t",
	"20",
	"-i",
	"color=c=black:s=426x240:r=30",
	"-loop",
	"1",
	"-t",
	"3",
	"-i",
	"1.png",
	"-loop",
	"1",
	"-t",
	"3",
	"-i",
	"2.png",
	"-loop",
	"1",
	"-t",
	"4",
	"-i",
	"3.png",
	"-loop",
	"1",
	"-t",
	"5",
	"-i",
	"4.png",
	"-loop",
	"1",
	"-t",
	"5",
	"-i",
	"5.png",
	"-filter_complex",
	"[1]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i1];" +
		"[2]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i2];" +
		"[3]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i3];" +
		"[4]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i4];" +
		"[5]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i5];" +
		"[0][i1]overlay=enable='between(t,0,3)'[v1];" +
		"[v1][i2]overlay=enable='between(t,3,6)'[v2];" +
		"[v2][i3]overlay=enable='between(t,6,10)'[v3];" +
		"[v3][i4]overlay=enable='between(t,4,8)'[v4];" +
		"[v4][i5]overlay=enable='between(t,13,18)'[v]",
	"-map",
	"[v]",
	"-c:v",
	"libx264",
	"-pix_fmt",
	"yuv420p",
	"-r",
	"30",
	"-t",
	"20",
	"output1.mp4",
];

export const cmm2 = [
	"-y",
	"-f",
	"lavfi",
	"-t",
	"20",
	"-i",
	"color=c=black:s=426x240:r=30",
	"-loop",
	"1",
	"-t",
	"3",
	"-i",
	"1.png",
	"-loop",
	"1",
	"-t",
	"3",
	"-i",
	"2.png",
	"-loop",
	"1",
	"-t",
	"4",
	"-i",
	"3.png",
	"-loop",
	"1",
	"-t",
	"5",
	"-i",
	"4.png",
	"-filter_complex",
	"[1]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i1];" +
		"[2]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i2];" +
		"[3]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i3];" +
		"[4]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i4];" +
		"[0][i1]overlay=enable='between(t,0,3)'[v1];" +
		"[v1][i2]overlay=enable='between(t,3,6)'[v2];" +
		"[v2][i3]overlay=enable='between(t,6,10)'[v3];" +
		"[v3][i4]overlay=enable='between(t,4,8)'[v]",
	"-map",
	"[v]",
	"-c:v",
	"libx264",
	"-pix_fmt",
	"yuv420p",
	"-r",
	"30",
	"-t",
	"20",
	"output.mp4",
];

export const cmm3 = [
	"-y",
	"-f",
	"lavfi",
	"-t",
	"20",
	"-i",
	"color=c=black:s=426x240:r=30",
	"-loop",
	"1",
	"-t",
	"3",
	"-i",
	"1.png",
	"-loop",
	"1",
	"-t",
	"3",
	"-i",
	"2.png",
	"-loop",
	"1",
	"-t",
	"4",
	"-i",
	"3.png",
	"-loop",
	"1",
	"-t",
	"5",
	"-i",
	"4.png",
	// Audio Part
	"-i",
	"1.wav",
	"-i",
	"2.wav",
	"-i",
	"3.wav",
	"-i",
	"4.wav",
	"-filter_complex",
	"[1]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i1];" +
		"[2]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i2];" +
		"[3]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i3];" +
		"[4]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i4];" +
		"[0][i1]overlay=enable='between(t,0,3)'[v1];" +
		"[v1][i2]overlay=enable='between(t,3,6)'[v2];" +
		"[v2][i3]overlay=enable='between(t,6,10)'[v3];" +
		"[v3][i4]overlay=enable='between(t,4,8)'[v];" +
		// Audio Trim
		"[5]atrim=start=0:end=6,adelay=0|0[a1_trimmed];" +
		"[6]atrim=start=0:end=6,adelay=3000|3000[a2_trimmed];" +
		"[7]atrim=start=0:end=6,adelay=10000|10000[a3_trimmed];" +
		"[8]atrim=start=0:end=10,adelay=0|0[a4_trimmed];" +
		"[a1_trimmed][a2_trimmed][a3_trimmed][a4_trimmed]amix=inputs=4[a]",
	// "[a1_trimmed][a2_trimmed][a3_trimmed][a4_trimmed]amix=inputs=4:duration=first[a]",
	"-map",
	"[v]",
	"-map",
	"[a]",
	"-c:v",
	"libx264",
	"-c:a",
	"aac",
	"-pix_fmt",
	"yuv420p",
	"-r",
	"30",
	"-t",
	"20",
	"output.mp4",
];
