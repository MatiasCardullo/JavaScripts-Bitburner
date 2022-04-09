/** @param {NS} ns **/
export async function main(ns) {
	await ns.write("/gang/allGangs/"+ns.args[0].replaceAll(' ','')+"/chanceToWinClash.txt",ns.gang.getChanceToWinClash(ns.args[0]),'w');
}