/** @param {NS} ns **/
export async function main(ns) {
	let random = []
	for (let i = 0; i < 100; i++)
		random.push(parseInt(Math.random() * 100))
	ns.tprint(random)
	ns.tprint(quickSort(random))
}

/** @param {NS} ns **/
export function timeFormat(ns, miliseconds) {
	let sec = miliseconds / 1000
	let min = Math.floor(sec / 60)
	sec = sec % 60
	let hour = Math.floor(min / 60)
	min = min % 60
	return ns.nFormat(hour, '00') + ':' + ns.nFormat(min, '00') + ':' + ns.nFormat(sec, '00')
}

/** @param {NS} ns **/
export async function getData(ns, dataFile, dataCreator) {
	let file = ns.read(dataFile)
	while (file == "") {
		await runSafeScript(ns, dataCreator)
		file = ns.read(dataFile)
	}
	return file
}

/** @param {NS} ns **/
export async function runScript(ns, script, value = "", value2 = "", value3 = "", value4 = "") {
	let pid = 0;
	while (pid == 0) {
		pid = ns.run(script, 1, value, value2, value3, value4)
		if (pid == 0) {
			//ns.toast("Waiting for RAM to launch " + script)
			await ns.sleep(0)
		}
	}
	return pid;
}

/** @param {NS} ns **/
export async function runSafeScript(ns, script, value = undefined, value2 = undefined, value3 = undefined, value4 = undefined) {
	try {
		let pid = await runScript(ns, script, value, value2, value3, value4)
		while (ns.isRunning(pid)) { await ns.sleep(0) }
		return true
	} catch { return false }
}

/** @param {NS} ns **/
export async function execScript(ns, script, server = "home", value = "", value2 = "", value3 = "", value4 = "") {
	let pid = 0;
	while (pid == 0) {
		pid = ns.exec(script, server, 1, value, value2, value3, value4)
		if (pid == 0) {
			//ns.toast("Waiting for RAM to launch " + script)
			await ns.sleep(0)
		}
	}
	return pid;
}

/** @param {NS} ns **/
export async function execSafeScript(ns, script, server = "home", value = undefined, value2 = undefined, value3 = undefined, value4 = undefined) {
	try {
		let pid = await execScript(ns, script, server, value, value2, value3, value4)
		while (ns.isRunning(pid)) { await ns.sleep(0) }
		return true
	} catch { return false }
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
	return true;
}

export function openUrl(input) {
	if (input != "")
		eval('document.open(input)')
}

export function inputcommands(input) {
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

export function quickSort(array) {
	if (array.length <= 1) {
		return array;
	}
	let pivot = array[0];
	let left = [];
	let right = [];
	for (let i = 1; i < array.length; i++) {
		array[i] < pivot ? left.push(array[i]) : right.push(array[i]);
	}
	return quickSort(left).concat(pivot, quickSort(right));
}

export function quickSort2(array, array2, order) {
	if (array.length <= 1) {
		return array;
	}
	let pivot = array2[0];
	let left = [];
	let right = [];
	let left2 = [];
	let right2 = [];
	for (let i = 1; i < array.length; i++) {
		if ((order == '>' && array2[i] > pivot) || (order == '<' && array2[i] < pivot)) {
			left.push(array[i])
			left2.push(array2[i])
		} else {
			right.push(array[i])
			right2.push(array2[i])
		}
	}
	return quickSort2(left, left2).concat(array[0], quickSort2(right, right2));
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