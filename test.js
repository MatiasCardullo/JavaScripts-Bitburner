import { _beep } from "./sounds/beep.js"
import { _win95StartUp } from "./sounds/win95StartUp.js"
import { mediafire } from "mediafire.js"
import { youtubeMP3 } from "youtube.js"
import * as graph from"./lib/graph.js"

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL')
	ns.clearLog();
	let block = '█▌';
	let space = '  ';
	let key1 = "block";
	let key2 = "space";
	//let output = "√";
	//let output = "✓";
	let aux;
	let obj = { [key1]: block, [key2]: space }
	ns.tprint(obj["block"])
	ns.tprint(obj["space"])
	ns.tprint(graph.bar(12.5,50))
	ns.tail()
	while (true) {
		aux = getInput()
		ns.print(aux)
		if (aux == "exit") {
			ns.exit()
		}
		await ns.sleep(100)
	}

	let output = 46784654165;
	ns.tprint(output);
	let b36 = output.toString(36)
	ns.tprint(b36);
	aux = parseInt(b36, 36)
	ns.tprint(aux)

	for (let h = 0; h < 20; h++) {
		for (let i = 0; i < 20; i++) {
			if (Math.random() > 0.5)
				output += space;
			else
				output += block;
		}
		ns.print(output); output = "";
	}
	ns.exit()
	let emojis = [8986, 8987, 9193, 9194, 9195, 9196, 9200, 9203, 9875, 9725, 9726, 9748, 9749, 9757, 9800, 9801, 9802, 9803, 9804, 9805, 9806, 9807, 9808, 9809, 9810, 9811, 9855, 9875, 9889, 9898, 9899, 9917, 9918, 9924, 9925, 9934, 9940, 9962, 9970, 9971, 9973, 9977, 9978, 9981, 9989, 9994, 9995, 9996, 9997];
	await ns.write("test.txt", output, "w")
	for (let i = 0; i < 400000; i++) {
		if (i % 80 == 0) {
			output += "\n"
			if (i < 100000) {
				await ns.write("test.txt", output, "a")
			} else if (i < 200000) {
				await ns.write("test2.txt", output, "a")
			} else if (i < 300000) {
				await ns.write("test3.txt", output, "a")
			} else {
				await ns.write("test4.txt", output, "a")
			}
			await ns.sleep(0); output = "";
		}
		/*if(emojis.indexOf(i)!==-1){
			output+=String.fromCharCode(i)//+" "
		}*/
		output += String.fromCharCode(i) + " "//+i+" "
	}
	//ns.print(output)
	/*for (let ch of output) {
		ns.print(ch.codePointAt(0).toString(10))
	}*/
	//ns.tprint(String.fromCharCode(parseInt("DB3C",16)))
	/*let data=ns.getPlayer()
	for (var key in data) {
		if (data.hasOwnProperty(key)) {
			ns.print(key + ": " + data[key]);
			await ns.sleep(500)
		}
	}*/
	/*let audio = [
		new Audio(await mediafire(ns,"https://www.mediafire.com/file/ep8gxdrgffvnipr/win98.mp3/file")),
		new Audio(await mediafire(ns,"https://www.mediafire.com/file/vm493uyrt5n9a45/win98logoff.mp3/file")),
		new Audio(await mediafire(ns,"https://www.mediafire.com/file/vt3u04xlg9kkh0b/nt4.mp3/file")),
		new Audio(await mediafire(ns,"https://www.mediafire.com/file/xk02wy7nd86mnzq/nt4loggoff.mp3/file"))
	]

	for (let i = 0; i < audio.length; i++) {
		audio[i].play();
		await ns.sleep(audio[i].duration * 1000)
	}*/
	function getInput() {
		let terminalInput = ''
		eval('terminalInput = document.getElementById("terminal-input")')
		if (!terminalInput)
			return false;
		return terminalInput.value;
		const handler = Object.keys(terminalInput)[1];
		terminalInput[handler].onChange({ target: terminalInput });
		terminalInput[handler].onKeyDown({ keyCode: 13, preventDefault: () => null });
		return true;
	}
}