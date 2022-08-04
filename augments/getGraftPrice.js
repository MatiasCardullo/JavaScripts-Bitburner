/** @param {NS} ns */
export async function main(ns) {
	let input = ns.read("/augments/graftables.txt").split(',')
	let output = []
	input.forEach(function (g) {
		let price = -1
		try {
			price = ns.grafting.getAugmentationGraftPrice(g)
		} catch { }
		output.push(price)
	})
	await ns.write("/augments/graftPrices.txt", output,'w')
}