/** @param {NS} ns **/
export async function main(ns) {
	let files=ns.ls("home",".js").concat(ns.ls("home",".script"))
	let output=[];
	for (let i = 0; i < files.length; i++) {
		if(files[i].indexOf("bb-vue")==-1)
			output.push(files[i])	
	}
	for (let i = 0; i < output.length; i++) {
		inputcommands("download "+output[i])
	}

	function inputcommands(input) {
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
}