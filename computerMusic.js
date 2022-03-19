/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('sleep')
	ns.clearLog()
	ns.tail()
	if (!ns.fileExists("Music.txt") || ns.args[0] != null) {
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
			wait = 0;next = false; pause = false;
			if (back) {
				song = lastSong;
				index -= 2;
				back = false;
			} else {
				song = nextSong;
			}
			if (index >1)
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
					output += duration + " │ "
					if (index - 2 > -1) {
						output += listMusic[index - 2][1]
					}
					output += "\n "
					var perc = parseFloat((song.currentTime / song.duration) * bufferLength)
					var aux = perc;
					for (let j = 1; j < bufferLength; j++) {
						if (aux >= 1) {
							output += "█"; aux--;
						} else if (aux >= 0.5) {
							output += "▌"; aux--;
						} else {
							output += "-";
						}
					}
					output += " │> " + listMusic[index - 1][1]
					visual = visualizer(analyser, bufferLength, dataArray, visual[1])
					for (let j = 0; j < visual[0].length; j++) {
						output += "\n "
						output += visual[0][j] + "│ "
						if (j + index < listMusic.length)
							output += listMusic[index + j][1]
					}
					ns.clearLog()
					ns.print(output)
				}
				if (wait > 3000) {
					await ns.sleep(0)
					wait = 0;
				}
			}
		}
	}

	function visualizer(analyser, bufferLength, dataArray, max = 0) {
		let block = '█'; let semi = '▄'; let space = ' ';
		let output = []; let line;
		let maxHeight = 30;
		let mult = 0.2;
		let newDataArray = [];
		let aux; let barHeight;
		analyser.getByteFrequencyData(dataArray);
		for (var i = 0; i < bufferLength; i++) {
			aux = dataArray[i] * mult;
			mult += 0.002 * i / 10;
			newDataArray.push(aux)
			if (max < aux) {
				max = aux
			}
		}
		for (var i = maxHeight; i > -1; i--) {
			line = "";
			for (var j = 0; j < bufferLength; j++) {
				barHeight = newDataArray[j] / max * maxHeight;
				if (barHeight > i)
					line += block;
				else if (barHeight + 0.5 > i)
					line += semi;
				else
					line += space;
			}
			output.push(line);
		}
		return [output, max];
	}
}

export function getInput() {
	let terminalInput = ''
	eval('terminalInput = document.getElementById("terminal-input")')
	if (!terminalInput)
		return false;
	return terminalInput.value;
}

export function setInput(input) {
	let terminalInput = ''
	eval('terminalInput = document.getElementById("terminal-input")')
	if (!terminalInput)
		return false;
	terminalInput.value = input;
	const handler = Object.keys(terminalInput)[1];
	terminalInput[handler].onChange({ target: terminalInput });
	terminalInput[handler].onKeyDown({ keyCode: 13, preventDefault: () => null });
	return true;
}

export function shuffle(array) {
	let currentIndex = array.length, randomIndex;
	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}
	return array;
}

export function formatPathFile(path) {
	let index = path.indexOf(String.fromCharCode(92));
	while (index > 0) {
		// change '\' to '/'
		path = replaceAt(path, index, '/')
		index = path.indexOf(String.fromCharCode(92))
	}
	return "file:///" + path
}

export function replaceAt(string, index, replacement) {
	if (index >= string.length) {
		return string.valueOf();
	}
	return string.substring(0, index) + replacement + string.substring(index + 1);
}