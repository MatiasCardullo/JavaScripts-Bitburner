/** @param {NS} ns **/
export async function main(ns) {
	let scaner = true;
	let singularity = true;
	let doCrime = false;
	let getGang; let setGang;
	try {
		getGang = !ns.gang.inGang()
		setGang = true;
	} catch {
		getGang = false;
		setGang = false;
	}
	ns.run("startup.js", 1, scaner, singularity, doCrime, getGang, setGang)
}