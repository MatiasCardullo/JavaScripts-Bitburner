/** @param {NS} ns */
export async function main(ns) {
	//ns.tail()
	await ns.write("/augments/stanek/activeFragments.txt", JSON.stringify(ns.stanek.activeFragments()), 'w')
}