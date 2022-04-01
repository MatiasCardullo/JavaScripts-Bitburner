import * as Graph from "./lib/graph.js";
import { getInput, setInput } from "./lib/basicLib.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');
	let serversData = [];
	ns.read("SERVERDATA.txt").split("\n").forEach(function (s) {
		serversData.push(s.split(','))
	})
	serversData.shift()
	let dictionary = [];
	serversData.forEach(function (data) {
		dictionary.push({
			name: data[0],
			hacklevel: parseInt(data[1]),
			ports: parseInt(data[2]),
			ram: parseInt(data[3]),
			grow: parseInt(data[4]),
			maxmoney: parseInt(data[5]),
			minsecurity: parseInt(data[6]),
			startmoney: parseInt(data[7]),
			startsecurity: parseInt(data[8])
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
	let isHacking = new Array(serversData.length);
	isHacking.fill(null)
	ns.tail()
	while (true) {
		ns.clearLog()
		await displayServers(dictionary, getInput());
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
		if (showServer!==false) {
			myTable.push([" " + hackedServers.length + '/' + (hackedServers.length + toHackServers.length) + " Hacked servers  ", "Status", " Income  "])
		} else {
			myTable.push([" " + hackedServers.length + '/' + (hackedServers.length + toHackServers.length) + " Hacked servers  ", "Status", "Money level", "Security level", " Income  "])
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
						ns.mv("home", server.name + "Income.txt", "/logs/" + server.name + "Income.txt")
				}
				let file = ns.read("/logs/" + server.name + "Income.txt")
				if (server.name == search) {
					showServer=i;
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
					if (mLevel > 0.9 && sLevel > 0.9) {
						isHacking[index] = true;
						line.push("Hacking 100%")
					} else {
						let hacked = false
						if (server.name == name || myServers.includes(name))
							hacked = ns.fileExists("base.js", name)
						if ((!hacked && mLevel <= 0.9) || (hacked && mLevel < 1)) {
							line.push("Grow " + (mLevel * 100).toFixed(3) + '%')
						} else {
							line.push("Weak " + (sLevel * 100).toFixed(3) + '%')
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
		if (showServer!==false) {
			myTable.push([`${myServers.length}/25 Purchased Servers`, "", ns.nFormat(totalIncome, '0.000 a')])
			display = Graph.table(myTable, ["both",showServer], ["right", "center", "center", "center", "right"])
			let boxHeight=hackedServers.length+5;
			if(showServer>0&&showServer<hackedServers.length-1)
				boxHeight++
			display = Graph.concatGraphs(display, Graph.box(100,boxHeight))//,Graph.graphBar(hackedServers.length + 3, incomeArray).split('\n')))
		} else {
			myTable.push([`${myServers.length}/25 Purchased Servers`, "", "", "Total Income: ".padStart(50, ' '), ns.nFormat(totalIncome, '0.000 a')])
			display = Graph.table(myTable, "both", ["right", "center", "center", "center", "right"])
		}
		ns.print(display)
		if (toHackServers.length > 0) {
			let output = ""; let output2 = "";
			let index = toHackServers[0]
			output += "Servers To Hack:\n"
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
			output += output2
			ns.print(Graph.box(148, null, output.split('\n'), "center"));
		}
	}

}