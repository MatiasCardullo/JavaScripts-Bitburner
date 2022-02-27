import { _beep } from "./sounds/beep.js"
import { _win95StartUp } from "./sounds/win95StartUp.js"
import { mp3ToBase64 } from "mp3ToBase64.js"
import { mediafire } from "mediafire.js"
import { youtubeMP3 } from "youtube.js"

/** @param {NS} ns **/
export async function main(ns) {
	//ns.disableLog('ALL')
	ns.clearLog();


	for (let i = 0; i < 250; i++)
		ns.print(i+" "+String.fromCharCode(i))
	let audio = [
		new Audio(await mediafire(ns,"https://www.mediafire.com/file/ep8gxdrgffvnipr/win98.mp3/file")),
		new Audio(await mediafire(ns,"https://www.mediafire.com/file/vm493uyrt5n9a45/win98logoff.mp3/file")),
		new Audio(await mediafire(ns,"https://www.mediafire.com/file/vt3u04xlg9kkh0b/nt4.mp3/file")),
		new Audio(await mediafire(ns,"https://www.mediafire.com/file/xk02wy7nd86mnzq/nt4loggoff.mp3/file"))
	]

	for (let i = 0; i < audio.length; i++) {
		audio[i].play();
		await ns.sleep(audio[i].duration * 1000)
	}
}