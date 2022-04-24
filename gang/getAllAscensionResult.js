/** @param {NS} ns */
export async function main(ns) {
	let members=JSON.parse(ns.read("/gang/membersInfo.txt"))
	for(let i in members){
		ns.tprint(JSON.stringify(ns.gang.getAscensionResult(members[i].name)))
	}
}