/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/bladeburner/city/"+ns.args[0]+"/communities.txt",ns.bladeburner.getCityCommunities(ns.args[0]),'w')
}