/** @param {NS} ns */
export async function main(ns) {
	let term;
	var xPosition
	var yPosition
	var xClick
	var yClick
	var xOldClick
	var yOldClick
	let minX = 70;
	let maxX = 2965 - minX;
	let minY = 10;
	let maxY = 1665 - minY;
	let winHeight = 90
	let winLeght = 300

	let win = new Array(winHeight)
	for (let y = 0; y < winHeight; y++) {
		win[y] = new Array(winLeght)
		for (let x = 0; x < winLeght; x++)
			win[y][x] = ' '
	}
	let draw = false
	let top = '┌'.padEnd(winLeght + 1, '─') + '┐\n'
	let bottom = '└'.padEnd(winLeght + 1, '─') + '┘'
	eval("term=document.getElementById('terminal')")
	term.addEventListener("click", getClick, false);
	term.addEventListener("mousemove", getMousePosition, false);
	while (true) {
		let output = "\n"
		output += top
		if (xPosition && yPosition) {
			if (draw && win[yPosition][xPosition] == ' ')
				win[yPosition][xPosition] = 'O'
			if (xClick && yClick) {
				if (xClick != xOldClick || yClick != yOldClick) {
					draw = !draw
					yOldClick = yClick
					xOldClick = xClick
				}
				win[yClick][xClick] = 'X'
			}
		}
		for (let y = 0; y < winHeight; y++) {
			output += '│' + win[y].toString().replaceAll(',', '') + '│\n'
		}
		output += bottom
		ns.tprint(output)
		await ns.sleep(0)
	}

	function getMousePosition(e) {
		xPosition = parseInt((e.clientX - minX) / maxX * winLeght);
		yPosition = parseInt((e.clientY - minY) / maxY * winHeight);
	}
	function getClick(e) {
		xClick = parseInt((e.clientX - minX) / maxX * winLeght);
		yClick = parseInt((e.clientY - minY) / maxY * winHeight);
	}
}