/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL')
	var player=ns.getPlayer()
	if (!player.isWorking||player.workType=="Working for Faction") {
		let getGang = ns.args[0]
		let loop = ns.args[1]
		var crimes = ["Shoplift", "Rob Store", "Mug Someone", "Larceny", "Deal Drugs", "Traffick Illegal Arms", "Homicide", "Grand Theft Auto", "Kidnap", "Assassination", "Heist"]
		var money = new Array(crimes.length);
		for (let i = 0; i < crimes.length; i++) {
			money[i] = ns.getCrimeStats(crimes[i]).money / ns.getCrimeStats(crimes[i]).time
		}
		do {
			ns.clearLog()
			if (loop) {
				ns.print(" DONT CLOSE THIS WINDOW")
				ns.print(" Use the kill button to stop the script")
				ns.print(" kills:" + player.numPeopleKilled + " karma:" + parseInt(ns.heart.break()))
			}
			let time = ns.commitCrime(selectCrime(ns, crimes, money, getGang))
			await ns.sleep(time-500)
		} while (loop)
	}

}

/** @param {NS} ns **/
export function selectCrime(ns, crimes, money, getGang = false) {
	let person = ns.getPlayer()
	let chance = new Array(crimes.length);
	let crime; let maxChance; let maxMoney; let index;
	for (let i = 0; i < crimes.length; i++) {
		crime = ns.getCrimeStats(crimes[i])
		chance[i] = (crime.hacking_success_weight * person.hacking +
			crime.strength_success_weight * person.strength +
			crime.defense_success_weight * person.defense +
			crime.dexterity_success_weight * person.dexterity +
			crime.agility_success_weight * person.agility +
			crime.charisma_success_weight * person.charisma +
			0.025 * person.intelligence) / 975 / crime.difficulty *
			person.crime_success_mult * (1 + Math.pow(person.intelligence, 0.8) / 600);
		//ns.print(chance[i])
	}
	if (chance[6] > 0.90) {
		if ((getGang && -54000 < ns.heart.break()) || ns.getPlayer().numPeopleKilled < 30)
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
	return crimes[index]
}