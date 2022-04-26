/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL')
	let player = JSON.parse(ns.read("/logs/playerStats.txt"))
	if (!player.isWorking || player.workType == "Working for Faction") {
		let getGang = ns.args[0]
		let loop = ns.args[1]
		var crimes = JSON.parse(ns.read("/logs/crimeStats.txt"))
		var money = new Array(crimes.length);
		for (let i = 0; i < crimes.length; i++) {
			money[i] = crimes[i].money / crimes[i].time
		}
		do {
			ns.clearLog()
			let info = " kills:" + player.numPeopleKilled + " karma:" + parseInt(ns.heart.break())
			if (loop) {
				ns.print(" DONT CLOSE THIS WINDOW\n Use the kill button to stop the script")
				ns.print(info)
			} else {
				ns.toast(info, 'info')
			}
			let time = ns.singularity.commitCrime(selectCrime(ns, crimes, money, getGang))
			await ns.sleep(time - 500)
		} while (loop)
	}

}

/** @param {NS} ns **/
export function selectCrime(ns, crimes, money, getGang = false) {
	let player = JSON.parse(ns.read("/logs/playerStats.txt"))
	let chance = new Array(crimes.length);
	let maxChance; let maxMoney; let index;
	for (let i = 0; i < crimes.length; i++) {
		chance[i] = (crimes[i].hacking_success_weight * player.hacking +
			crimes[i].strength_success_weight * player.strength +
			crimes[i].defense_success_weight * player.defense +
			crimes[i].dexterity_success_weight * player.dexterity +
			crimes[i].agility_success_weight * player.agility +
			crimes[i].charisma_success_weight * player.charisma +
			0.025 * player.intelligence) / 975 / crimes[i].difficulty *
			player.crime_success_mult * (1 + Math.pow(player.intelligence, 0.8) / 600);
		//ns.print(chance[i])
	}
	if (chance[6] > 0.90) {
		if ((getGang && -54000 < ns.heart.break()) || player.numPeopleKilled < 30)
			return "Homicide"
	}
	maxChance = 0; maxMoney = 0;
	for (let i = crimes.length - 1; i > -1; i--) {
		if (chance[i] > 0.90) {
			if (money[i] > maxMoney) {
				maxChance = chance[i];
				maxMoney = money[i];
				index = i;
			}
		} else if (chance[i] > maxChance) {
			maxChance = chance[i];
			index = i;
		}
	}
	return crimes[index].name
}