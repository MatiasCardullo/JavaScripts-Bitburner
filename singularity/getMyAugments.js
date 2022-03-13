/** @param {NS} ns **/
export async function main(ns) {
	let installed=ns.getOwnedAugmentations()
	await ns.write("/singularity/player/installedAugments.txt",installed,"w")
	let all=ns.getOwnedAugmentations(true)
	let purchased=[];
	all.forEach((a)=>installed.includes(a)?null:purchased.push(a))
	await ns.write("/singularity/player/purchasedAugments.txt",purchased,"w")
}