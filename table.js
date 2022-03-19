/** @param {NS} ns **/
export const heavy = 1
export const tripleDash = 4
export const horizontal = '─' // U+2500
export const vertical = '│' // U+2502
export const upLeft = '┌'//U+250C
export const upRight = '┐'//U+2510
export const downLeft = '└'//U+2514
export const downRight = '┘'//U+2518
export const verticalLeft = '├'
export const verticalRight = '┤'
export const horizontalDown = '┴'
export const horizontalUp = '┬'
export const center = '┼'

export async function main(ns) {
	ns.print(box(null, null, "this,is a,box",','))
	ns.print(box(31, 4))
	ns.print(table([[1, 2, 3], [4, 5, 6], [7, 8, 9]], true))
	
	let aux = ns.read("/singularity/augments/augsPrice.txt").split('\n')
	aux.pop();
	let matrix = [];
	aux.forEach((l) => matrix.push(l.split(',')))
	ns.print(table(matrix,"first"))
}

export function box(h, v, text = null, split = null) {
	let line = "\n";
	let textArray = []
	if (typeof (text) === 'string') {
		if (split !== null) {
			textArray = text.split(split)
		} else {
			textArray.push(text)
		}
		if (v < textArray.length)
			v = textArray.length
		for (let i = 0; i < v; i++) {
			if (h < textArray[i].length) {
				h = textArray[i].length;
			}
		}

	}
	line += lineHorizontal([upLeft, upRight], h)

	for (let i = 0; i < v; i++) {
		line += vertical;
		let start = 0;
		if (textArray.length > i) {
			line += textArray[i]
			start = textArray[i].length
		}
		for (let j = start; j < h; j++) {
			line += " "
		} line += vertical;
		line += "\n"
		//output.push(line);
	}

	line += lineHorizontal([downLeft, downRight], h)

	return line;
}

export function table(matrix, horizontalSeparator = null) {
	let line = "\n"
	let first; let last; let all = false;
	let rows = matrix.length;
	let columns = matrix[0].length;
	let lenghtPerColumn = new Array(columns).fill(0);
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			if (matrix[i][j].toString().length > lenghtPerColumn[j]) {
				lenghtPerColumn[j] = matrix[i][j].toString().length
			}
		}
	}
	switch (horizontalSeparator) {
		case "first":
			first = 0;
			break;
		case "last":
			last = rows;
			break;
		case true:
			all = true;
			break;
	}
	line += lineHorizontal([upLeft, upRight], lenghtPerColumn, horizontalUp)
	for (let i = 0; i < rows; i++) {
		line += vertical;
		let start = 0;
		for (let j = 0; j < matrix[i].length; j++) {
			line += matrix[i][j]
			start = matrix[i][j].toString().length
			for (let k = start; k < lenghtPerColumn[j]; k++) {
				line += " "
			}
			line += vertical;
		}
		//ns.tprint(line)
		line += "\n"
		if ((first == i || all || last == i) && i < rows - 1)
			line += lineHorizontal([verticalLeft, verticalRight], lenghtPerColumn, center)
	}

	line += lineHorizontal([downLeft, downRight], lenghtPerColumn, horizontalDown)

	return line;
}

export function lineHorizontal(char, h, char2 = null) {
	let line = char[0]
	if (char2 == null) {
		for (let i = 0; i < h; i++) {
			line += horizontal
		}
	} else {
		for (let i = 0; i < h.length; i++) {
			for (let j = 0; j < h[i]; j++) {
				line += horizontal
			}
			if (i < h.length - 1)
				line += char2;
		}
	}
	line += char[1]
	line += "\n"
	return line;
}