/** @param {NS} ns */
export async function main(ns) {
	let stam,maxStam;
	[stam,maxStam]=ns.bladeburner.getStamina()
	await ns.write("/bladeburner/stamina.txt",stam, 'w')
	await ns.write("/bladeburner/maxStamina.txt",maxStam, 'w')
}