/** @param {NS} ns **/
export async function main(ns) {
	let reset=ns.ls("home","/singularity/factions/").concat(ns.ls("home","/singularity/augments/"))
	reset.forEach((f)=>ns.rm(f,"home"))
}