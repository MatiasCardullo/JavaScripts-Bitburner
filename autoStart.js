/** @param {NS} ns **/
export async function main(ns) {
	//let scaner = ns.args[0]
	//let singularity = ns.args[1]
	//let doCrime = ns.args[2]
	let getGang=!ns.gang.inGang;
	ns.run("startup.js",1,true,true,true,getGang)
}