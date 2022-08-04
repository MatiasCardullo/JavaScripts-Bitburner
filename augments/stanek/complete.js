import { table } from "./lib/graph.js";

/** @param {NS} ns */
export async function main(ns) {
	let space = "  "
	let block = "██"
	let output = ""
	let list = ns.stanek.fragmentDefinitions()
	let h = ns.stanek.giftHeight()
	let w = ns.stanek.giftWidth()
	let matrix = new Array(h).fill([])
	for (let y in matrix)
		matrix[y] = new Array(w).fill(false)
	output += '\n' + table(showBoolGrid(matrix), "all")
	let bonus = []
	let fragments = []
	for (let frag of list)
		frag.id < 100 ? fragments.push(frag) : bonus.push(frag)
	/*output += '\nFragments:'
	for (let f of fragments) {
		let shape = f.shape
		output += '\n' + table(showBoolGrid(shape), "all")
	}
	output += '\nBonus:'
	for (let f of bonus) {
		let shape = f.shape
		output += '\n' + table(showBoolGrid(shape), "all")
	}*/
	for (let f of fragments) {
		for (let r = 0; r < 4; r++)
			place(r, f.id)
	}
	ns.tprint(output)

	function place(rotation, id) {
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				if (ns.stanek.canPlaceFragment(x, y, rotation, id)) {
					ns.run("/augments/stanek/placeFragment.js", 1, x, y, rotation, id)
					
				}
			}
		}
	}

	function showBoolGrid(matrix) {
		let output = new Array(matrix.length)
		for (let y in matrix) {
			output[y] = new Array(matrix[y].length)
			for (let x in matrix[y]) {
				matrix[y][x] == true ? output[y][x] = block : output[y][x] = space
			}
		}
		return output
	}
}