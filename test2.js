/** @param {NS} ns */
export async function main(ns) {
	await ns.write("cc.txt",JSON.stringify(ns.codingcontract.attempt),'w')
}