/** @param {NS} ns **/
export async function main(ns) {
	let output="";
	for (let h = 0; h < ns.args.length; h++) {
		output+=ns.args[h]+' '
	}
	ns.tprint(output)
}