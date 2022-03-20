/** @param {NS} ns **/
export async function main(ns) {
	ns.ls("home","/singularity/player/").forEach((f)=>ns.rm(f,"home"))
}