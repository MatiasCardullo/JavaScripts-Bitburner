/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/sleeves/" + ns.args[0] + "/task.txt",JSON.stringify(ns.sleeve.getTask(ns.args[0])).replace("task","type"), 'w')
}