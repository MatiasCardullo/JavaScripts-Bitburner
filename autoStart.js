/** @param {NS} ns **/
export async function main(ns) {
	let scaner = true;
	let singularity = true;
	let doCrime = true;
	let getGang;
	let setGang;
	try {
		getGang = ns.read("/gang/info.txt") == "";
		setGang = true;
	} catch {
		getGang = true;
		setGang = false;
	}
	ns.tprint(scaner, singularity, doCrime, getGang, setGang)
	ns.run("startup.js", 1, scaner, singularity, doCrime, getGang, setGang)
}