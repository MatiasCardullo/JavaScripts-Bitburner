/** @param {NS} ns **/
export async function main(ns) {
	let getGang=!ns.gang.inGang;
	ns.run("startup.js",1,true,getGang)
}