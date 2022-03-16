/** @param {NS} ns **/
export async function main(ns) {
	let reset=ns.ls("home","/singularity/player/")
	reset.forEach((f)=>ns.rm(f,"home"))
}