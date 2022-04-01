/** @param {NS} ns **/
export async function main(ns) {
	await ns.write("/gang/"+ns.args[0].replaceAll(' ','')+".txt",ns.gang.getChanceToWinClash(ns.args[0]));
}