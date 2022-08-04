/** @param {NS} ns */
export async function main(ns) {
	let input = ns.read("/augments/graftables.txt").split(',')
	let output = []
	input.forEach(function (g) {
		let time = -1
		try {
			time = ns.grafting.getAugmentationGraftTime(g)
		} catch { }
		output.push(time)
	})
	await ns.write("/augments/graftTimes.txt", output,'w')
}