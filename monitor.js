import * as Graph from "./lib/graph.js";
import { getInput, setInput, timeFormat } from "./lib/basicLib.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');
	let dictionary = serversDictionary()
	let isHacking = new Array(dictionary.length);
	isHacking.fill(null)
	ns.tail()
	let loop = false;
	let count = 0;
	let input; let selected = "all";
	let day; let p;
	let bnData = JSON.parse(ns.read("/logs/bitnodeMultipliers.txt"))
	let maxMyServers = parseInt(25 * bnData.PurchasedServerLimit)
	while (true) {
		ns.clearLog()
		day = new Date().toString()
		p = JSON.parse(ns.read("/logs/playerStats.txt"))
		ns.print('\n  ' + day.slice(0, day.indexOf("GMT")) +
			"- Time since last reset " + timeFormat(ns, p.playtimeSinceLastAug) +
			" - Time since last Bitnode " + timeFormat(ns, p.playtimeSinceLastBitnode) + '\n')
		input = getInput()
		if (input != selected)
			switch (input) {
				case "loop":
					loop = !loop;
					setInput(">loop")
					break;
				case "all":
				case "bladeburner":
				case "servers":
				case "market":
				case "gang":
				case "augments":
					selected = input;
					break;
			}
		if (loop) {
			count++;
			switch (Math.floor(count / 1500)) {
				case 0:
					selected = "servers"
					break;
				case 1:
					selected = "market"
					break;
				case 2:
					selected = "augments"
					break;
				case 3:
					selected = "gang"
					break;
				case 4:
					selected = "bladeburner"
					break;
				default:
					count = 0;
					break;
			}
		}
		let showAllAugs = true
		switch (selected) {
			case "all":
				try {
					await displayPlayerAndSleeves()
				} catch { }
				displayBladeburner()
				await displayServers(dictionary, input);
				displayMarket()
				displayGang()
				showAllAugs = false
			case "augments":
				if (input == "rep")
					await displayAugments(2, showAllAugs, input)
				else
					await displayAugments(1, showAllAugs, input)
				break;
			case "servers":
				await displayServers(dictionary, input);
				break;
			case "market":
				displayMarket(true)
				break;
			case "gang":
				displayGang()
				break;
			case "bladeburner":
				displayBladeburner(true)
				break;
		}
		await ns.sleep(0)
	}

	async function displayPlayerAndSleeves(player = false) {
		if (player) {
			let playerData = [[" Player".padEnd(29)]]
			let bb = ns.read("/bladeburner/currentAction.txt")
			if (p.isWorking) {
				if (p.numPeopleKilled > 0)
					playerData.push([" People Killed: " + p.numPeopleKilled])
				switch (p.workType) {
					case "Working for Company":
						playerData.push([" Working in " + p.companyName])
						break;
					case "Working for Faction":
						playerData.push([" Working in " + p.currentWorkFactionName])
						playerData.push([' ' + p.currentWorkFactionDescription])
						break;
					case "Studying or Taking a class at university":
						playerData.push([" Studying " + p.className])
						break;
					case "Committing a crime":
						playerData.push([" Committing a crime: " + p.crimeType])
						break;
					default:
						playerData.push([' ' + p.workType])
						break;
				}
			} else {
				playerData.push([""])
			}
			if (bb != "" && !bb.includes("Idle"))
				playerData.push([" Working in Bladeburner"])
			else if (p.workType != "Working for Faction")
				playerData.push([""])

			playerData.push([" City: " + p.city + "  Karma: " + ns.nFormat(ns.heart.break(), '0a')])

			let workStats = ["HackExp", "StrExp", "DefExp", "DexExp", "AgiExp", "ChaExp", "Rep", "Money"]
			for (let i in workStats) {
				if (p["work" + workStats[i] + "GainRate"] > 0) {
					playerData.push([' ' + workStats[i].padStart(7) + ": " + ns.nFormat(p["work" + workStats[i] + "GainRate"], '0.000a') + ' ' + ns.nFormat(p["work" + workStats[i] + "Gained"], '0.000a')])
					space++
				} else if (workStats[i] == "Money" && p["work" + workStats[i] + "LossRate"] > 0) {
					playerData.push([' ' + workStats[i].padStart(7) + ": " + ns.nFormat(p["work" + workStats[i] + "LossRate"], '0.000a') + ' ' + ns.nFormat(p["work" + workStats[i] + "Gained"], '0.000a')])
					space++
				}
			}
			for (let i = 0; i < 2 - space; i++)
				playerData.push([""])
			let ent = "";
			if (p.entropy > 0)
				ent = " Entropy: " + p.entropy
			playerData.push([" Bitnode: " + p.bitNodeN + ent])
			ns.print(Graph.table(playerData, 'first'))
		}

		let count = ns.read("/sleeves/count.txt")
		if (count != "") {
			count = parseInt(count)
			let table;
			let table2 = [[], [], [], [], [], []];
			let table3 = [[], [], [], [], [], []];
			for (let s = 0; s < count; s++) {
				if (s < 4)
					table = table2
				else
					table = table3
				table[0].push("".padEnd(15) + ("Sleeve" + s) + "".padEnd(15))
				let stats = JSON.parse(ns.read("/sleeves/" + s + "/stats.txt"))
				let info = JSON.parse(ns.read("/sleeves/" + s + "/info.txt"))
				let task = JSON.parse(ns.read("/sleeves/" + s + "/task.txt"))
				if (stats.shock == 0 && stats.sync == 100) {
					switch (task.type) {
						case "Bladeburner":
							table[1].push(" Working in " + task.type + ' ')
							break;
						case "Company":
							table[1].push(" Working in C. " + task.location.replace(" International", "").replace("Incorporated", "Inc.") + ' ')
							table[2].push("Rep: " + ns.nFormat(ns.read("/company/" + task.location.replaceAll(' ', '').replace('&', 'And') + "/reputation.txt"), "0.0a"))
							break;
						case "Faction":
							table[1].push(" Working in F. " + task.location.replace(" International", "").replace("Incorporated", "Inc.") + ' ')
							table[2].push("Rep: " + ns.nFormat(ns.read("/factions/" + task.location.replaceAll(' ', '').replace('&', 'And') + "/reputation.txt"), "0.0a"))
							break;
						case "Crime":
							table[1].push(" Commiting Crime: " + task.crime + ' ')
							break;
						case "Gym":
							table[1].push(" Training " + task.gymStatType + ' ')
							break;
						case "Class":
							table[1].push(" Studying in " + task.location + ' ')
							break;
						default:
							table[1].push(task.type)
							break;
					}
					if (task.type != "Company" && task.type != "Faction")
						table[2].push("City: " + info.city)
					table[3].push("Hack: " + (stats.hacking.toString()).padEnd(8) + ("Str: " + stats.strength).padEnd(14))
					table[4].push(" Cha: " + (stats.charisma.toString()).padEnd(8) + ("Def: " + stats.defense).padEnd(14))
					table[5].push(" Agi: " + (stats.agility.toString()).padEnd(8) + ("Dex: " + stats.dexterity).padEnd(14))
				} else {
					if (stats.shock > 0) {
						table[1].push("Recovery:")
						table[2].push(Graph.bar(1 - (stats.shock / 100), 34))
					} else {
						table[1].push("Synchronize:")
						table[2].push(Graph.bar(stats.sync / 100, 34))
					}
					table[3].push("")
					table[4].push("")
					table[5].push("")
				}
			}
			ns.print(Graph.table(table2, 'first', 'center'))
			ns.print(Graph.table(table3, 'first', 'center'))
		}
	}

	async function displayServers(servers, search = null) {
		let myServers = []; let hackedServers = []; let toHackServers = [];
		let file = ns.read("myServers.txt")
		if (file != "")
			myServers = file.split(',')
		let totalIncome = 0; let incomeArray = []
		let myTable = []; let showServer = false;
		for (let index in servers) {
			let server = servers[index]
			let name = server.name;
			if (server.ram == 0 && myServers.includes(name + "_hack")) {
				name += "_hack"
			}
			if (ns.fileExists("base.js", name) || (ns.getServerMoneyAvailable(server.name) != server.startmoney && ns.getServerSecurityLevel(server.name) != server.startsecurity)) {
				if (search == server.name) {
					showServer = true;
				}
				hackedServers.push(index)
			} else if (server.startmoney > 0)
				toHackServers.push(index)
		}
		if (showServer !== false) {
			myTable.push([hackedServers.length.toString().padStart(3) + '/' + (hackedServers.length + toHackServers.length) + " Hacked servers  ", "Status", " Income  "])
		} else {
			myTable.push([hackedServers.length.toString().padStart(3) + '/' + (hackedServers.length + toHackServers.length) + " Hacked servers  ", "Status", "Money level", "Security level", " Income  "])
		}
		for (let i = 0; i < hackedServers.length; i++) {
			let index = hackedServers[i]
			let server = servers[index]
			if (server.maxmoney > 0) {
				let line = []; let name = server.name;
				let mLevel; let sLevel; let income = 0;
				if (server.ram == 0) {
					name += "_hack"
				}
				if (server.name == name || myServers.includes(name)) {
					await ns.scp(server.name + "Income.txt", name, "home")
					if (ns.read(server.name + "Income.txt") != "")
						ns.mv("home", server.name + "Income.txt", "/logs/income/" + server.name + ".txt")
				}
				let file = ns.read("/logs/income/" + server.name + ".txt")
				if (server.name == search) {
					showServer = i;
					/*for (let j = file.length - 1; 2 < j && j > file.length - 101; j--) {
						let aux=parseInt(file[j].split('-')[0])
						if(aux!=NaN)
							incomeArray.unshift(aux)
					}*/
				}
				if (file != "") {
					income = parseInt(file)
					totalIncome += income;
				}
				line.push(server.name)
				let money = ns.getServerMoneyAvailable(server.name);
				let security = ns.getServerSecurityLevel(server.name);
				mLevel = money / server.maxmoney
				sLevel = server.minsecurity / security
				if (isHacking[index] == true) {
					line.push("Hacking 100%")
					if (!(mLevel > 2 / 3 && sLevel > 2 / 3))
						isHacking[index] = false;
				} else {
					if (mLevel > 0.99 && sLevel > 0.99) {
						isHacking[index] = true;
						line.push("Hacking 100%")
					} else {
						let hacked = false
						if (server.name == name || myServers.includes(name))
							hacked = ns.fileExists("base.js", name)
						if ((!hacked && mLevel <= 0.9) || (hacked && mLevel < 1)) {
							line.push("Grow " + ns.nFormat(mLevel * 100, '00.000') + '%')
						} else {
							line.push("Weak " + ns.nFormat(sLevel * 100, '00.000') + '%')
						}
					}
				}
				if (showServer === false) {
					line.push(Graph.bar(mLevel, 50, true))
					line.push(Graph.bar(1 - sLevel, 50))
				}
				line.push(ns.nFormat(income, '0.000 a'))
				myTable.push(line)
			}
		}
		let display;
		if (showServer !== false) {
			myTable.push([`${myServers.length}/${maxMyServers} Purchased Servers`, "", ns.nFormat(totalIncome, '0.000 a')])
			display = Graph.table(myTable, ["both", showServer], ["right", "center", "center", "center", "right"])
			let boxHeight = hackedServers.length + 5;
			if (showServer > 0 && showServer < hackedServers.length - 1)
				boxHeight++
			display = Graph.concatGraphs(display, Graph.box(100, boxHeight, ["fluctuation graph not implemented yet"], 'center'))//,Graph.graphBar(hackedServers.length + 3, incomeArray).split('\n')))
		} else {
			myTable.push([`${myServers.length}/${maxMyServers} Purchased Servers`, "", "", "Total Income: ".padStart(50, ' '), ns.nFormat(totalIncome, '0.000 a')])
			display = Graph.table(myTable, "both", ["right", "center", "center", "center", "right"])
		}
		ns.print(display)
		if (toHackServers.length > 0) {
			let output = ""; let output2 = "";
			let index = toHackServers[0]
			let maxLen = 145
			output2 += servers[index].name;
			for (let i = 1; i < toHackServers.length; i++) {
				index = toHackServers[i]
				output2 += ','
				if (maxLen < output2.length + servers[index].name.length + 1) {
					output += output2 + "\n"
					output2 = ""
				} else {
					output2 += ' '
				}
				output2 += servers[index].name
			}
			if (output == "" && output2.length < 135)
				output = "Servers To Hack: " + output2
			else
				output = "Servers To Hack: \n" + output + output2
			ns.print(Graph.box(148, null, output.split('\n'), "center"));
		}
	}

	function serversDictionary() {
		let serversData = [];
		ns.read("SERVERDATA.txt").split("\n").forEach(function (s) {
			serversData.push(s.split(','))
		})
		serversData.shift();
		let dictionary = [];
		serversData.forEach(function (data) {
			dictionary.push({
				name: data[0],
				hacklevel: parseInt(data[1]),
				ports: parseInt(data[2]),
				ram: parseInt(data[3]),
				grow: parseFloat(data[4]),
				maxmoney: parseFloat(data[5]),
				minsecurity: parseFloat(data[6]),
				startmoney: parseFloat(data[7]),
				startsecurity: parseFloat(data[8])
			})
		})
		/*for (let key in dictionary) {
			let output=""
			for (let key2 in dictionary[key]) {
				output+=key2+":"+dictionary[key][key2]+" "
			}
			ns.print(output)
		}
		ns.print(dictionary[0].name)*/
		return dictionary
	}

	function displayBladeburner(all = false) {
		try {
			let list = JSON.parse(ns.read("/bladeburner/actions.txt")).blackOps
			let listDone = ns.read("/bladeburner/doneBlackOps.txt")
			let rank = ns.read("/bladeburner/rank.txt")
			let output = [["", "Black Operations", ("Rank Level (Current:" + ns.nFormat(rank, "0.000a") + ')').padEnd(49, ' ') + "Needed", "Success Chance"]]
			let rankLevel = []
			ns.read("/bladeburner/blackOpsRanks.txt").split(',').forEach((r) => rankLevel.push(parseInt(r)))
			for (let i = 0; i < list.length; i++) {
				let operation;
				list[i].length < 12 ? operation = list[i] : operation = list[i].replace("Operation ", "")
				let line = []
				if (listDone.includes(operation))
					line.push('√')
				else
					line.push(' ')
				line.push(operation)
				let chance = ns.read("/bladeburner/successChance/" + list[i].replaceAll(' ', '') + ".txt")
				if (chance.includes(',')) {
					chance = chance.split(',')
					chance = (parseFloat(chance[0]) + parseFloat(chance[1])) / 2
				}
				if (!all && line[0] == ' ') {
					let aux;
					if ((chance > rank / rankLevel[i] && chance != 1) || rank > rankLevel[i])
						aux = "Chance(" + ns.nFormat(chance * 100, "0.00") + '%)' + Graph.bar(chance, 100)
					else
						aux = "Rank(" + ns.nFormat(rank, "0.0a") + '/' + ns.nFormat(rankLevel[i], "0.0a") + ')' + Graph.bar(rank / rankLevel[i], 100)
					ns.print(Graph.table([[(i + 1) + '/' + list.length, "Black Op: " + operation, aux]]))
					return;
				}
				if (chance == 1) {
					chance = ' 100% ' + Graph.bar(1, 50)
				} else {
					chance = ns.nFormat(chance * 100, "00.00") + '%' + Graph.bar(chance, 50)
				}
				line.push(Graph.bar(rank / rankLevel[i], 50) + ns.nFormat(rankLevel[i], "0.0a").replace(".0", "").padStart(5, ' '))
				line.push(chance)
				output.push(line)
			}
			ns.print(Graph.table(output, "first"))
		} catch { }
	}

	function displayMarket(all = false) {
		let symbols = ns.read("/stock/symbols.txt").split(',')
		let fileNames = ["price", "volatility", "forecast", "maxShares", "myShares", "invested"]
		let total = 0;
		let maxLength = 40;
		let company;
		let access = [p.hasWseAccount, p.hasTixApiAccess, p.has4SData, p.has4SDataTixApi]
		if (access.toString() === "true,true,true,true") {
			let data = [["Company Name and symbol", "Price", "Volatility", "Forecast", "Max Shares", "My Shares", "Invested"]];
			for (let i = 0; i < symbols.length; i++) {
				company = ns.read("/stock/" + symbols[i] + "/name.txt").split(',')[0].padEnd(maxLength + 5 - symbols[i].length, '-') + symbols[i]
				let aux = [company];
				for (let j = 0; j < fileNames.length; j++) {
					let file = ns.read("/stock/" + symbols[i] + '/' + fileNames[j] + ".txt")
					if (file != "" && file != "0") {
						switch (fileNames[j]) {
							case "myShares":
								aux.push(parseFloat(parseFloat(file) / parseFloat(ns.read("/stock/" + symbols[i] + "/maxShares.txt")) * 100).toFixed(3) + "%")
								break;
							case "forecast":
								aux.push(ns.nFormat(file - 0.5, '0.000a'))
								break;
							case "invested":
								if (!isNaN(parseFloat(file)))
									total += parseFloat(file)
							default:
								try {
									aux.push(ns.nFormat(file, '0.000a'))
								} catch {
									aux.push(ns.nFormat(0, '0.000a'))
								}
								break
						}
					} else
						aux.push("0")
				}
				if (all || aux[5] !== "0" || aux[6] !== "0")
					data.push(aux)
			}
			data.push(["Powered by 4Sigma Market Data Feed", "", "", "", "", "   Total:", ns.nFormat(total, '0.000a')])
			ns.print(Graph.table(data, "both", "center"))
		} else {
			ns.print(Graph.box(null, null, " No info from StockMarket "))
		}
	}

	async function displayAugments(sortBy = 1, showAll = false, aug) {
		let printOutput = ""
		let selected = "";
		let count = 0
		let keyNames = JSON.parse(ns.read("/augments/names.txt"))
		let installed = ns.read("/augments/installed.txt").split(',')
		let purchased = ns.read("/augments/purchased.txt").split(',')
		let own = installed.concat(purchased)
		let all = ns.read("/augments/allAugments.txt").split(',')
		let graftables = ns.read("/augments/graftables.txt").split(',')
		let installedTable = "";
		let purchasedTable = [["Purchased Augments"]]
		//installed augments
		if (showAll) {
			purchasedTable[0].unshift("")
			installedTable = [["", "Installed Augments"]]
			installed.forEach(function (p) {
				if (p != "") {
					installedTable.push([count, p])
					if (parseInt(aug) == count)
						selected = p
					count++;
				}
			})
			installedTable = Graph.table(installedTable, 'first')
		}
		//purchased augments
		purchased.forEach(function (p) {
			if (p != "") {
				if (showAll) {
					purchasedTable.push([count, p])
					if (parseInt(aug) == count)
						selected = p
					count++;
				} else
					purchasedTable.push([p])
			}
		})
		let toBuy = ns.read("/augments/toBuy.txt")
		let augsTable = ""
		purchasedTable.length > 1 ? augsTable = Graph.table(purchasedTable, 'first') : null
		let prices = ns.read("/augments/augsPrice.txt").split('\n')
		let graft = ns.read("/augments/graftables.txt");
		let grafting = ns.read("/augments/grafting.txt").split(',')
		let graftStarted = parseInt(grafting[1])
		grafting = grafting[0]
		let graftArray = graft.split(',');
		let graftPrices = ns.read("/augments/graftPrices.txt").split(',');
		let p = JSON.parse(ns.read("/logs/playerStats.txt"))
		let myFactions = p.factions
		let factionsRep = [["Factions", "Rep", "Favor"]]
		//factions
		myFactions.forEach(function (f) {
			let fac = f.replaceAll(' ', '').replace('&', 'And')
			let rep = ns.read("/factions/" + fac + "/reputation.txt")
			let fav = ns.read("/factions/" + fac + "/favor.txt")
			try {
				if (f == p.currentWorkFactionName)
					rep = parseFloat(rep) + p.workRepGained
				factionsRep.push([f, ns.nFormat(rep, '0.0a'), ns.nFormat(fav, '0.0a')])
			} catch { }
		})
		let factionTable = Graph.table(factionsRep, 'first', 'center')
		//grafting augment
		try {
			if (p.workType == "Grafting an Augmentation" && grafting != "") {
				let graftTimes = ns.read("/augments/graftTimes.txt").split(',');
				let time = timeFormat(ns, (parseInt(graftTimes[graftArray.indexOf(grafting)]) + graftStarted) - new Date().getTime())
				let grafTable = [["Grafting"], [grafting + ' ' + time]]
				if (showAll) {
					grafTable[0].unshift("")
					grafTable[1].unshift(count)
					if (parseInt(aug) == count)
						selected = grafting
					count++;
				}
				augsTable += '\n' + Graph.table(grafTable, 'first', 'center')
			}
		} catch { }
		printOutput = Graph.concatGraphs(augsTable, factionTable) + '\n'
		//to buy augments
		if (toBuy != "") {
			toBuy = toBuy.split(',')
			let output = [];
			for (let i in toBuy) {
				let line = [];
				for (let aux of prices) {
					aux = aux.split(',')
					if (aux[0] == toBuy[i]) {
						line = aux
					}
				}
				if (line.length > 0) {
					let factions = []
					myFactions.forEach((f) => ns.read("/factions/" + f.replaceAll(' ', '').replace('&', 'And') + "/augments.txt").includes(toBuy[i]) ? factions.push(f) : null)
					line.push(factions)
					output.push(line)
				}
			}
			let sort = true;
			while (sort) {
				sort = false;
				for (let i = 1; i < output.length; i += 1) {
					if (parseInt(output[i - 1][sortBy]) > parseInt(output[i][sortBy])) {
						sort = true;
						let tmp = output[i - 1];
						output[i - 1] = output[i];
						output[i] = tmp;
					}
				}
			}
			for (let i in output) {
				for (let j in output) {
					if (output[i][0] == output[j][0] && i != j) {
						output.splice(j, 1)
						j--
					}
				}
				output[i][1] = ns.nFormat(output[i][1], '0.0a')
				output[i][2] = ns.nFormat(output[i][2], '0.0a')
				let aux = [];
				output[i][3].forEach(function (e) {
					if (myFactions.includes(e)) {
						aux.push(e)
					}
				})
				output[i][3] = aux.toString().replaceAll(',', ', ');
				if (graft != "") {
					if (graft.includes(output[i][0])) {
						let g = graftArray.indexOf(output[i][0])
						try {
							output[i].push(ns.nFormat(graftPrices[g], '0.0a'))
						} catch { }
					} else {
						output[i].push("-----------")
					}
				}
				if (showAll) {
					if (parseInt(aug) == count)
						selected = output[i][0]
					output[i].unshift(count)
					count++;
				}
			}
			prices[0] = prices[0].split(',')
			prices[0][0] = "Augments to buy"
			prices[0].push("Factions with the augment")
			if (graft != "")
				prices[0].push("Graft Price")
			if (showAll)
				prices[0].unshift("")
			output.unshift(prices[0])
			printOutput += Graph.table(output, 'first')
		} else {
			printOutput += Graph.box(null, null, " No augments to buy yet ")
		}
		//other augments
		if (showAll) {
			let others = []; let line = [];
			for (let i in all) {
				if (!own.includes(all[i]) && !toBuy.includes(all[i]) && grafting != all[i] || all[i] == "NeuroFlux Governor") {
					prices.forEach((a) => a.includes(all[i]) ? line = a.split(',') : null)
					if (line.length > 0) {
						let factions = []
						myFactions.forEach((f) => ns.read("/factions/" + f.replaceAll(' ', '').replace('&', 'And') + "/augments.txt").includes(all[i]) ? factions.push(f) : null)
						line.push(factions)
						if (parseInt(aug) == count)
							selected = line[0]
						line.unshift(count)
						count++;
						others.push(line)
					}
				}
			}
			for (let g of graftables) {
				line = [g, 0, 0];
				if (!own.includes(g) && !toBuy.includes(g) && !all.includes(g) && grafting != g) {
					let factions = []
					myFactions.forEach((f) => ns.read("/factions/" + f.replaceAll(' ', '').replace('&', 'And') + "/augments.txt").includes(g) ? factions.push(f) : null)
					line.push(factions)
					if (parseInt(aug) == count)
						selected = line[0]
					line.unshift(count)
					count++;
					others.push(line)
				}
			}
			for (let i in others) {
				for (let j = 0; j < others.length; j++) {
					if (others[i][1] == others[j][1] && i != j) {
						others.splice(j, 1)
						j--
					}
				}
				others[i][2] = ns.nFormat(others[i][2], '0.0a')
				others[i][3] = ns.nFormat(others[i][3], '0.0a')
				if (graft != "") {
					if (graft.includes(others[i][1])) {
						let g = graftArray.indexOf(others[i][1])
						try {
							others[i].push(ns.nFormat(graftPrices[g], '0.0a'))
						} catch { }
					} else {
						others[i].push("---------")
					}
				}
			}
			others.unshift(["", "Others", "Price", "Rep", "Factions with the augment"])
			if (graft != "")
				others[0].push("Graft Price")
			printOutput += '\n' + Graph.table(others, 'first')


		}
		if (selected != "") {
			let augDetail = [[selected]]
			let info = [["Info"]];
			let file = ns.read("/augments/data/" + keyNames[selected] + ".txt")
			if (file != "") {
				file = JSON.parse(file)
				for (let key in file) {
					if (key == "info" || key == "stats") {
						let aux = file[key]
						let array = []
						while (aux.length > 50) {
							let index = aux.lastIndexOf(' ', 50)
							if (index < 0)
								break;
							array.push(aux.slice(0, index))
							aux = aux.slice(index + 1)
							//await ns.sleep(0)
						}
						array.push(aux)
						for (let line of array)
							info.push([line])
					} else
						augDetail.push([key.replaceAll('_', ' ') + ": " + file[key]])
				}
			}
			let augInfo = Graph.table(augDetail, 'first', 'center');
			if (info.length > 2)
				augInfo = Graph.concatGraphs(augInfo, Graph.table(info, 'first', 'center'))
			ns.print(Graph.concatGraphs(installedTable, augInfo))
		} else {
			ns.print(installedTable)
		}
		ns.print(printOutput)
	}

	function displayGang() {
		let myGang = ns.read("/gang/info.txt")
		let gangs = ns.read("/gang/otherGangs.txt")
		if (myGang != "" && gangs != "") {
			myGang = JSON.parse(myGang)
			gangs = JSON.parse(gangs)
			let myGangTable = [[myGang.faction]]
			for (let key in myGang) {
				if (key !== 'faction' && key !== 'chance' && key !== 'territory') {
					if (key !== 'power' || myGang.territory == 1) {
						if (key !== "isHacking" && key !== "territoryWarfareEngaged")
							myGang[key] = parseFloat(myGang[key]).toFixed(3)
						myGangTable.push([key + ": " + myGang[key]])
					}
				}
			}
			myGangTable = Graph.table(myGangTable, 'first', 'center')
			if (myGang.territory < 1) {
				let total = 0; let count = 0;
				let gangsTable = [["Names", "Power", "Territory", "ChanceToWinClash"]]
				for (let g in gangs) {
					let aux = [g]
					aux.push(parseInt(gangs[g].power))
					aux.push(parseFloat(gangs[g].territory * 100).toFixed(4) + '%')
					if (g == myGang.faction)
						aux.push('-------')
					else {
						aux.push(parseFloat(gangs[g].chance * 100).toFixed(5) + '%')
						total += gangs[g].chance; count++;
					}
					gangsTable.push(aux)
				}
				gangsTable.push(["", "", "", "Total: " + (total / count * 100).toFixed(2) + '%'])
				gangsTable = Graph.table(gangsTable, 'both', 'center')
				ns.print(Graph.concatGraphs(myGangTable, gangsTable))
			} else
				ns.print(myGangTable)
		} else {
			let karma = parseInt(54000 + ns.heart.break())
			let text = " No gangs yet "
			if (karma > 0)
				text += "| " + karma + " karma is missing to get there "
			ns.print(Graph.box(null, null, text))
		}
	}
}