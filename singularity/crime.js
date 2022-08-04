/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL')
	ns.run("getPlayer.js")
	let player = JSON.parse(ns.read("/logs/playerStats.txt"))
	if ((!player.isWorking || player.workType == "Working for Faction") /*&& player.location == "The Slums"*/) {
		let getGang = ns.args[0]
		let loop = ns.args[1]
		var crimes = JSON.parse(ns.read("/logs/crimeStats.txt"))
		var money = new Array(crimes.length);
		let bestKarma = 0;
		for (let i = 0; i < crimes.length; i++) {
			money[i] = crimes[i].money / crimes[i].time
		}
		if (getGang) {
			let aux; let index;
			for (let i = 0; i < crimes.length; i++) {
				aux = crimes[i].karma / crimes[i].time
				if (aux > bestKarma) {
					bestKarma = aux
					index = i
				}
			}
			bestKarma = index
		}
		let info = ""; let info2 = ""
		do {
			ns.clearLog()
			ns.print(crimes[bestKarma].time)
			info = " kills:" + player.numPeopleKilled + " karma:" + parseInt(ns.heart.break())
			if (getGang)
				info2 = " time remaining: " + gangTime(54000 + ns.heart.break(), crimes[bestKarma].karma / crimes[bestKarma].time)
			ns.run("getPlayer.js")
			player = JSON.parse(ns.read("/logs/playerStats.txt"))
			let time = ns.singularity.commitCrime(selectCrime(ns, crimes, player, getGang))
			if (loop) {
				ns.print(" DONT CLOSE THIS WINDOW\n Use the kill button to stop the script")
				ns.print(info + info2)
			} else {
				time -= 500
			}
			await ns.sleep(time)
		} while (loop)
	}

}

export function selectCrime(ns, crimes, player, getGang = false, bestChance = 0.9) {
	let chance = new Array(crimes.length);
	let maxChance; let maxMoney; let index; let bestKarma;
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
	if (getGang) {
		let aux;
		for (let i = 0; i < crimes.length; i++) {
			aux = crimes[i].karma / crimes[i].time
			if (aux > bestKarma) {
				bestKarma = aux
				index = i
			}
		}
		bestKarma = index
	}
	if (chance[bestKarma] > bestChance) {
		if (getGang && (-54000 < ns.heart.break() || player.numPeopleKilled < 30))
			return crimes[bestKarma].name
	}
	maxChance = 0; maxMoney = 0;
	for (let i = crimes.length - 1; i > -1; i--) {
		if (chance[i] > bestChance) {
			if (crimes[i].money / crimes[i].time > maxMoney) {
				maxChance = chance[i];
				maxMoney = crimes[i].money / crimes[i].time;
				index = i;
			}
		} else if (chance[i] > maxChance) {
			maxChance = chance[i];
			index = i;
		}
	}
	return crimes[index].name
}

export function gangTime(karma, kPerMS) {
	let time = karma / kPerMS;
	let s = time / 1000;
	let m = s / 60;
	let h = m / 60;
	if (h > 1)
		return parseInt(h) + ' hours'
	if (m > 1)
		return parseInt(m) + ' minutes'
	return parseInt(s) + ' seconds'
}