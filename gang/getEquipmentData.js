/** @param {NS} ns */
export async function main(ns) {
	let names=ns.gang.getEquipmentNames()
	let output=[]
	names.forEach((e)=>output.push({name:e,type:ns.gang.getEquipmentType(e),cost:ns.gang.getEquipmentCost(e)}))
	await ns.write("/gang/equipment.txt",JSON.stringify(output),'w')
}