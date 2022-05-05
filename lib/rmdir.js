/** @param {NS} ns **/
export async function main(ns) {
	let noAsk = ns.args[1]
	let del = false
	let list = []
	if (ns.args[0].endsWith('/') || noAsk === true) {
		ns.ls("home", ns.args[0]).forEach((e) => list.push(e))
		if (!noAsk) {
			let prm = "Eliminar directorio y archivos?\n" + list.toString().replaceAll(',', '\n');
			del = await ns.prompt(prm);
		} else if (noAsk === true) {
			del=true;
		}
		if (del) {
			list.forEach((e) => ns.rm(e));
		}
	}
}