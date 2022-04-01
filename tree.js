/** @param {NS} ns **/
export async function main(ns) {
	let array=[];
	let printed="";
	switch (ns.args[0]) {
		case "home":
			printed=ns.ls("home",ns.args[1]).toString().replaceAll(',','\n')
			break;
	}
	ns.tprint(printed)
}