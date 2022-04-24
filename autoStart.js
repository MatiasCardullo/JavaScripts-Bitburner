/** @param {NS} ns **/
export async function main(ns) {
	let scaner = true;
	let singularity = true;
	let doCrime = true;
	let getGang=true;
	try{getGang=!ns.gang.inGang;}catch{}
	ns.run("startup.js",1,scaner,singularity,doCrime,getGang)
}