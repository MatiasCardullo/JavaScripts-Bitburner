/** @param {NS} ns **/
export async function main(ns) {
	let installed=ns.singularity.getOwnedAugmentations()
	await ns.write("/logs/installedAugments.txt",installed,"w")
	let all=ns.singularity.getOwnedAugmentations(true)
	let purchased=[];
	all.forEach((a)=>installed.includes(a)?null:purchased.push(a))
	await ns.write("/logs/purchasedAugments.txt",purchased,"w")
}