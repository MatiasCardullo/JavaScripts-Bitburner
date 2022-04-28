/** @param {NS} ns */
export async function main(ns) {
	let output = [];
	let blackOps = JSON.parse(ns.read("/bladeburner/actions.txt")).blackOps
	for (let i in blackOps)
		output.push(ns.bladeburner.getBlackOpRank(blackOps[i]))
	await ns.write("/bladeburner/blackOpsRanks.txt", output, 'w')
}