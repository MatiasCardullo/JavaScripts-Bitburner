import { formatPathFile, shuffle, getInput, setInput } from "./lib/basicLib.js";
import { bar, graphBar, concatGraphs } from "./lib/graph.js"

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('sleep')
	ns.clearLog()
	ns.tail()
	let textNext = "next"; let textBack = "back"; let textPause = "pause"; let textPlay = "play"; let textStop = "stop";
	if (ns.args[0] == "config") {

	} else if (ns.read("Music.txt") == "" || ns.args[0] != null) {
		await ns.wget(formatPathFile(ns.args[0]), "Music.txt")
	}
	let visual;
	let path = ""; let name = "";
	let file = ns.read("Music.txt")
	file = file.split('\r\n')
	let listMusic = []
	for (let j = 0; j < file.length; j++) {
		let song = file[j].slice(1, file[j].length - 1)
		if (song.endsWith(".mp3") || song.endsWith(".MP3") || song.endsWith(".wav") || song.endsWith(".ogg")) {
			path = formatPathFile(song)
			name = path.slice(path.lastIndexOf("/") + 1, path.lastIndexOf("."))
			listMusic.push([path, name]);
		}
	}
	listMusic = shuffle(listMusic)
	let context = new AudioContext();
	while (true) {
		let wait; let song; let lastSong; let next; let back; let pause; let input; let min; let seg; let duration;
		let nextSong = new Audio(listMusic[0][0])
		for (let index = 1; index <= listMusic.length; index++) {
			wait = 0; next = false; pause = false;
			if (back) {
				song = lastSong;
				index -= 2;
				back = false;
			} else {
				song = nextSong;
			}
			if (index > 1)
				lastSong = new Audio(listMusic[index - 2][0])
			else
				lastSong = null;
			if (index < listMusic.length)
				nextSong = new Audio(listMusic[index][0])
			else
				nextSong = null;
			song.play()
			let audioSource = context.createMediaElementSource(song);
			let analyser = context.createAnalyser();
			audioSource.connect(analyser);
			analyser.connect(context.destination);
			analyser.fftSize = 256;
			let bufferLength = analyser.frequencyBinCount - 40;
			let dataArray = new Uint8Array(bufferLength);
			do {
				min = Math.floor(song.duration / 60)
				seg = Math.floor(song.duration - 60 * min)
				if (seg < 10)
					seg = "0" + seg
				duration = " " + min + ":" + seg
				await ns.sleep(0)
				if (wait < 1) {
					wait++;
					ns.print("      Loading...")
				}
			} while (duration == " NaN:NaN")
			min = 0; seg = -1; let output;
			visual = [[], 0];
			ns.toast("Playing " + listMusic[index - 1][1], "info", 10000)
			while (!song.ended) {
				switch (getInput().toString().toLowerCase()) {
					case "next":
						if (nextSong != null) {
							next = true;
							setInput("")
						}
						break;
					case "back":
						if (lastSong != null) {
							back = true;
							setInput("")
						}
						break;
					case "pause":
						if (!pause) {
							song.pause()
							pause = true;
							setInput("")
						}
						break;
					case "play":
						if (pause) {
							song.play()
							pause = false;
							setInput("")
						}
						break;
					case "stop":
						song.pause()
						song.currentTime = 0;
						pause = true;
						setInput("")
						break;
				}
				if (next || back) {
					song.pause()
					song.currentTime = 0;
					break;
				}
				wait++;
				if (!song.paused) {
					min = Math.floor(song.currentTime / 60)
					seg = Math.floor(song.currentTime - 60 * min)
					if (seg < 10)
						seg = "0" + seg
					output = " " + min + ":" + seg + " "
					for (let j = output.length; j < bufferLength - duration.length; j++) {
						output += "_";
					}
					output += duration + "│ "
					if (index - 2 > -1) {
						output += listMusic[index - 2][1]
					}
					output += "\n "
					output += bar(song.currentTime / song.duration, bufferLength - 1)
					output += "│> " + listMusic[index - 1][1] + "\n"
					visual = visualizer(analyser, bufferLength, dataArray, visual[1])
					let listString = ""; let line = "";
					for (let j = 0; j < 32; j++) {
						if (j + index < listMusic.length)
							listString += listMusic[index + j][1]
						listString += line
						line = '\n'
					}
					output += concatGraphs('\n' + visual[0], listString, "| ")
					ns.clearLog()
					ns.print(output)
				}
				await ns.sleep(0)
			}
		}
	}

	function visualizer(analyser, bufferLength, dataArray, max = 0) {
		let output = "";
		let maxHeight = 30;
		let mult = 0.2;
		let newDataArray = [];
		let aux;
		analyser.getByteFrequencyData(dataArray);
		for (var i = 0; i < bufferLength; i++) {
			aux = dataArray[i] * mult;
			mult += 0.002 * i / 10;
			newDataArray.push(aux)
			if (max < aux) {
				max = aux
			}
		}
		output = graphBar(maxHeight, newDataArray, max)
		return [output, max];
	}
}