/** @param {NS} ns */
export async function main(ns) {
	let list = []
	ns.ls("home", ".js").forEach((f) => list.push([f, ns.getScriptRam(f)]))
	let sort = true;
	while (sort) {
		sort = false;
		for (let i = 1; i < list.length; i++) {
			if (list[i - 1][1] <list[i][1]) {
				sort = true;
				let tmp = list[i - 1];
				list[i - 1] = list[i];
				list[i] = tmp;
			}
		}
	}
	list.forEach((f)=>ns.tprint(f[0].padEnd(75-ns.nFormat(f[1],'0.00').length,'_')+ns.nFormat(f[1],'0.00')))
}