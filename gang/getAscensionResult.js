/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/gang/members/"+ns.args[0]+"AscensionResult.txt",JSON.stringify(ns.gang.getAscensionResult(ns.args[0])),'w')
}