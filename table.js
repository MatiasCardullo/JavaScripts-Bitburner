/** @param {NS} ns **/
export const heavy = 1
export const tripleDash = 4
export const horizontal = 9472 // ─ U+2500
export const vertical = 9474 //│ U+2502
export const upLeft = 9484 //'┌'//U+250C
export const upRight = 9488 //'┐'//U+2510
export const up = [upLeft, upRight];
export const downLeft = 9492 //'└'//U+2514
export const downRight = 9496 //'┘'//U+2518
export const down = [downLeft, downRight];

export async function main(ns) {
	let toPrint;
	if (typeof (ns.args[0]) === 'string') {
		toPrint = box(null, null, ns.args[0],ns.args[1])
	} else {
		toPrint = box(ns.args[0], ns.args[1]/*,ns.args[2],ns.args[3]*/)
	}
	ns.tprint(toPrint)

}

export function c(char) {
	return String.fromCharCode(char)
}

export function box(v, h, text = null, split = null) {
	//let output = [];
	let line = "\n";
	let extra = 1;
	let textArray=[]
	if (typeof (text) === 'string') {
		if (split !== null) {
			textArray=text.split(split)
		} else {
			textArray.push(text)
		}
		if(v<textArray.length)
			v=textArray.length
		for (let i = 0; i < v; i++){
			if(h<textArray[i].length){
				h = textArray[i].length;
			}
		}
		
	}
	line += boxHorizontal(up, h)

	for (let i = 0; i < v; i++) {
		line += c(vertical);
		let start=0;
		if(textArray.length>i){
			line+=textArray[i]
			start=textArray[i].length
		}
		for (let j = start; j < h * extra; j++) {
			line += " "
		} line += c(vertical);
		line += "\n"
		//output.push(line);
	}

	line += boxHorizontal(down, h)

	return line;
}

export function boxHorizontal(char, h) {
	let line = c(char[0])
	for (let i = 0; i < h; i++) {
		line += c(horizontal)
	} line += c(char[1])
	line += "\n"
	return line;
}