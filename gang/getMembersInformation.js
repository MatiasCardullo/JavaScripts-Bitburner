/** @param {NS} ns */
export async function main(ns) {
	let output = []
	let members = ns.gang.getMemberNames()
	for (let i = 0; i < members.length; i++) {
		output.push(ns.gang.getMemberInformation(members[i]))
	}
	await ns.write("/gang/membersInfo.txt", JSON.stringify(output,null,' '), 'w')
}