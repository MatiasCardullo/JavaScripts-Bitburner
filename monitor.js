import * as Graph from "./lib/graph.js";
import { getInput, setInput } from "./lib/basicLib.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');
	let dictionary = serversDictionary()
	let isHacking = new Array(dictionary.length);
	isHacking.fill(null)
	ns.tail()
	let loop = false;
	let count = 0;
	let input; let selected = "servers";
	while (true) {
		ns.clearLog()
		input = getInput()
		if (input != selected)
			switch (input) {
				case "market":
				case "servers":
				case "augments":
				case "gang":
					selected = input;
					break;
				case "loop":
					loop = !loop;
					setInput("")
					break;

			}
		if (loop) {
			count++;
			switch (parseInt(count / 1500)) {
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
				default:
					count = 0;
					break;
			}
		}
		switch (selected) {
			case "servers":
				await displayServers(dictionary, input);
				break;
			case "market":
				displayMarket()
				break;
			case "augments":
				if (input == "rep")
					displayAugments(2)
				else
					displayAugments()
				break;
			case "gang":
				displayGang()
				break;
		}
		await ns.sleep(0)
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
			myTable.push([`${myServers.length}/25 Purchased Servers`, "", ns.nFormat(totalIncome, '0.000 a')])
			display = Graph.table(myTable, ["both", showServer], ["right", "center", "center", "center", "right"])
			let boxHeight = hackedServers.length + 5;
			if (showServer > 0 && showServer < hackedServers.length - 1)
				boxHeight++
			display = Graph.concatGraphs(display, Graph.box(100, boxHeight))//,Graph.graphBar(hackedServers.length + 3, incomeArray).split('\n')))
		} else {
			myTable.push([`${myServers.length}/25 Purchased Servers`, "", "", "Total Income: ".padStart(50, ' '), ns.nFormat(totalIncome, '0.000 a')])
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

	function displayMarket() {
		let symbols = ns.read("/stock/symbols.txt").split(',')
		let fileNames = ["price", "volatility", "forecast", "maxShares", "myShares", "invested"]
		let total = 0;
		let maxLength = 40;
		let company;
		if (Array.isArray(symbols)) {
			let data = [["Company", "Price", "Volatility", "Forecast", "Max Shares", "My Shares", "Invested"]];
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
				data.push(aux)
			}
			data.push(["", "", "", "", "", "Total:", ns.nFormat(total, '0.000a')])
			ns.print(Graph.table(data, "both", "right"))
		} else {
			ns.print(Graph.box(null, null, "No info from StockMarket"))
		}
	}

	function displayAugments(sortBy = 1) {
		let purchased = [["Purchased Augments"]]
		ns.read("/logs/purchasedAugments.txt").split(',').forEach((p) => purchased.push([p]))
		let augsTable = Graph.table(purchased, 'first', 'center')
		let prices = ns.read("/augments/augsPrice.txt").split('\n')
		let toBuy = ns.read("/logs/augmentsToBuy.txt")
		let myFactions = ns.read("/logs/factions.txt").replaceAll(' ', '').replace('&', 'And')
		let factionsRep = [["Factions", "Rep", "Favor"]]
		myFactions.split(',').forEach(function (f) {
			let rep = ns.read("/factions/" + f + "/reputation.txt")
			let fav = ns.read("/factions/" + f + "/favor.txt")
			try {
				factionsRep.push([f, ns.nFormat(rep, '0.0a'), ns.nFormat(fav, '0.0a')])
			} catch { }
		})
		let factionTable = Graph.table(factionsRep, 'first', 'center')
		ns.print(Graph.concatGraphs(factionTable, augsTable))
		try {
			if (toBuy != "") {
				toBuy = toBuy.split(',')
				let output = [];
				for (let i in toBuy) {
					let line = [];
					prices.forEach((a) => a.includes(toBuy[i]) ? line = a.split(',') : null)
					if (line.length > 0) {
						let factions = []
						ns.ls("home", "/augments.txt").forEach((f) => ns.read(f).includes(toBuy[i]) ? factions.push(f) : null)
						for (let j in factions) {
							factions[j] = factions[j].split('/')[2]
						}
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
					output[i][1] = ns.nFormat(output[i][1], '0.0a')
					output[i][2] = ns.nFormat(output[i][2], '0.0a')
					let aux = [];
					output[i][3].forEach(function (e) {
						if (myFactions.includes(e)) {
							aux.push(e)
						}
					})
					output[i][3] = aux;
				}
				prices[0] = prices[0].split(',')
				prices[0][0] = "Augments to buy"
				prices[0].push("Factions with the augment")
				output.unshift(prices[0])
				ns.print(Graph.table(output, 'first', 'center'))
			}
		} catch {

		}
	}

	function displayGang(){
		ns.print(ns.read("/gang/otherGangs.txt"))
		ns.print(ns.read("/gang/info.txt"))
	}
}