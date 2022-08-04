/** @param {NS} ns */
export async function main(ns) {
	let company = ns.args[0];
	if (company != "") {
		let path = "/company/" + company.replaceAll(' ', '').replace('&', 'And') + "/reputation.txt"
		await ns.write(path, ns.singularity.getCompanyRep(company), 'w')
	}
}