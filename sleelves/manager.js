/** @param {NS} ns */
export async function main(ns) {
	//let count=ns.sleeve.getNumSleeves()
	//ns.tprint(JSON.stringify(ns.sleeve.getInformation(0),null,'\t'))
	ns.tprint(JSON.stringify(ns.sleeve.getSleeveStats(0) ,null,'\t'))
}