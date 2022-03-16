/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('sleep')
	ns.clearLog()
	ns.tail()
	if (!ns.fileExists("Music.txt") || ns.args[0] != null) {
		await ns.wget(formatPathFile(ns.args[0]), "Music.txt")
	}
	var visual = true;
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
	let played = [];
	var context = new AudioContext();

	while (true) {
		let song; let nextSong = new Audio(listMusic[0][0])
		await ns.sleep(5000)//need wait to charge the music
		for (let index = 1; index <= listMusic.length; index++) {
			song = nextSong;
			if (index < listMusic.length)
				nextSong = new Audio(listMusic[index][0])
			song.play()
			var audioSource = context.createMediaElementSource(song);
			var analyser = context.createAnalyser();
			audioSource.connect(analyser);
			analyser.connect(context.destination);
			analyser.fftSize = 128;
			var bufferLength = analyser.frequencyBinCount;
			var dataArray = new Uint8Array(bufferLength);
			//ns.toast("Next " + listMusic[index][1], "info", 60000)
			ns.toast("Playing " + listMusic[index - 1][1], "info", 60000)
			let min = Math.floor(song.duration / 60)
			let seg = Math.floor(song.duration - 60 * min)
			if (seg < 10)
				seg = "0" + seg
			let duration = " " + min + ":" + seg + " "
			min = 0; seg = -1; var output;
			while (!song.ended) {
				ns.clearLog();
				for (let j = 0; j < played.length; j++) {
					ns.print(" " + played[j])
				}
				min = Math.floor(song.currentTime / 60)
				seg = Math.floor(song.currentTime - 60 * min)
				if (seg < 10)
					seg = "0" + seg
				ns.print(">" + listMusic[index - 1][1])
				output = " " + min + ":" + seg + " "
				for (let j = output.length; j <= 100 - duration.length; j++) {
					output += "_";
				}
				output += duration + " "
				ns.print(output); output = " ";
				var perc = parseFloat((song.currentTime / song.duration) * 100)
				var aux = perc;
				for (let j = 1; j < 100; j++) {
					if (aux >= 1) {
						output += "█"; aux--;
					} else {
						output += "-";
					}
				}
				ns.print(output)

				if (index < listMusic.length)
					ns.print(" Next: " + listMusic[index][1])
				ns.print("")
				visualizer()
				await ns.sleep(0)
			}
			played.push(listMusic[index - 1][1]);
		}
	}

	function visualizer() {
		let output = "";
		let mult = 0.2;
		analyser.getByteFrequencyData(dataArray);
		for (var i = 0; i < bufferLength; i++) {
			output = "";
			for (var j = 0; j < dataArray[i] * mult; j++) {
				output += '█';
			}
			mult += 0.01;
			ns.print(output);
		}

	}
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