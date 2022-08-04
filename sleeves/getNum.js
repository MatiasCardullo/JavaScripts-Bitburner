/** @param {NS} ns */
export async function main(ns) {
	try {
		await ns.write("/sleeves/count.txt", ns.sleeve.getNumSleeves(), 'w')
	} catch { }
}