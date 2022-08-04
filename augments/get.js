/** @param {NS} ns **/
export async function main(ns) {
	let installed=ns.singularity.getOwnedAugmentations()
	await ns.write("/augments/installed.txt",installed,"w")
	let all=ns.singularity.getOwnedAugmentations(true)
	let purchased=[];
	all.forEach((a)=>installed.includes(a)?null:purchased.push(a))
	await ns.write("/augments/purchased.txt",purchased,"w")
}