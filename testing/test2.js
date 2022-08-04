import { inputcommands } from "./lib/basicLib.js";

/** @param {NS} ns */
export async function main(ns) {
	ns.tail()
	let type=["INFO", "WARN", "ERROR"]
	type.forEach((e)=>ns.print(e))
	ns.print('\n' + ns.read("map.txt"))
	ns.print(ns.formulas.hacknetServers.hashGainRate(55,0,64,11,3.6863))
}