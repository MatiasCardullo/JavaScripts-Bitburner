import { runSafeScript } from "./lib/basicLib.js";

/** @param {NS} ns */
export async function main(ns) {
	ns.stanek.acceptGift()
	let file = ns.read("/augments/stanek/activeFragments.txt")
	if (file != "") {
		file = JSON.parse(file)
		for (let frag of file)
			await runSafeScript(ns, "/augments/stanek/placeFragment.js", frag.x, frag.y, frag.rotation, frag.id)
	}
}