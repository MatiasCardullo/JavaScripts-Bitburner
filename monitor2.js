/** @param {NS} ns **/
export async function main(ns) {
	let prices;let purchased;let augments
	while (true) {
		ns.disableLog('ALL')
		await ns.sleep(1000)
		prices = ns.read("/singularity/augments/augsPrice.txt").split('\n')
		purchased = ns.read("/singularity/player/purchasedAugments.txt").split(',')
		augments = ns.read("/singularity/player/augmentsToBuy.txt").split(',')
		ns.clearLog()
		ns.print(purchased)
		for (let i in augments) {
			let output = []
			prices.forEach((a) => a.includes(augments[i]) ? output = a : null)
			if (output.length > 0) {
				let factions = []
				ns.ls("home", "/singularity/factions/").forEach((f) => ns.read(f).includes(augments[i]) ? factions.push(f) : null)
				for (let j in factions) {
					factions[j] = factions[j].split('/').pop().replace("Augments.txt", "")
				}
				ns.print(output + '\n' + factions)
			}
		}
	}
}