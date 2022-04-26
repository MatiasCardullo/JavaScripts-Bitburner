/** @param {NS} ns */
export async function main(ns) {
	let crimes = ["Shoplift", "Rob Store", "Mug Someone", "Larceny", "Deal Drugs", "Traffick Illegal Arms", "Homicide", "Grand Theft Auto", "Kidnap", "Assassination", "Heist"]
	let output = []
	crimes.forEach((c) => output.push(ns.singularity.getCrimeStats(c)))
	await ns.write("/logs/crimeStats.txt", JSON.stringify(output), 'w')
}