/** @param {NS} ns */
export async function main(ns) {
	ns .tail()
	ns.stanek.fragmentDefinitions().forEach((f) => ns.print(JSON.stringify(f)))
}