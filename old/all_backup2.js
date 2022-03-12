/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL')
	//ns.enableLog('purchaseServer')hackSeserverrver
	let servers = scanServers();
	let allServers = servers[0];
	let serversWithMoney = servers[1];
	var serverMaxOut = [];
	let incomeArray = new Array(serversWithMoney.length)
	incomeArray.fill([-1, 0])
	let serversWithRam = servers[2];
	var b = false, f = false, r = false, h = false, s = false; var tor = false;
	let minPorts = [0, 5000, 5000, 5000, 5000, 5000];
	for (let i = 0; i < allServers.length; i++) {
		let port = ns.getServerNumPortsRequired(allServers[i]);
		let hacklevel = ns.getServerRequiredHackingLevel(allServers[i]);
		if (minPorts[port] > hacklevel && hacklevel != 1)
			minPorts[port] = hacklevel;
	}
	var prices = [
		{ price: 0.5, name: 'BruteSSH.exe', level: minPorts[1] },
		{ price: 1.5, name: 'FTPCrack.exe', level: minPorts[2] },
		{ price: 5, name: 'relaySMTP.exe', level: minPorts[3] },
		{ price: 30, name: 'HTTPWorm.exe', level: minPorts[4] },
		{ price: 250, name: 'SQLInject.exe', level: minPorts[5] }
	];
	var facServers = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "The-Cave", "w0r1d_d43m0n"];
	ns.tail();
	//ns.exec("killAll.js", "home")
	await ns.sleep(1000)

	while (true) {
		//try to buy tor if there is money and ram avaible
		if (!tor && ns.getServerMoneyAvailable("home") >= 200000 && ns.getServerMaxRam("home") - ns.getServerUsedRam("home") >= ns.getScriptRam("buyTor.js"))
			ns.exec("buyTor.js", "home"); tor = true;
		await rootServers(allServers);
		ns.clearLog();
		incomeArray = displayServers(serversWithMoney, incomeArray);
		await maxOutServers(serversWithMoney, serversWithRam);
	}

	function scanServers() {
		let servers = ["home"];
		let serversWithMoney = [];
		let serversWithRam = [];
		for (let i = 0; i < servers.length; i++) {
			var thisScan = ns.scan(servers[i]);
			for (let j = 0; j < thisScan.length; j++)
				if (servers.indexOf(thisScan[j]) === -1)
					servers.push(thisScan[j]);
		}
		let sort = true;
		while (sort) {
			sort = false;
			for (var i = 1; i < servers.length; i += 1) {
				if (ns.getServerRequiredHackingLevel(servers[i - 1]) > ns.getServerRequiredHackingLevel(servers[i])) {
					sort = true;
					var tmp = servers[i - 1];
					servers[i - 1] = servers[i];
					servers[i] = tmp;
				}
			}
		}
		for (let i = 0; i < servers.length; i++) {
			if (ns.getServerMaxMoney(servers[i]) > 0)
				serversWithMoney.push(servers[i]);
			if (ns.getServerMaxRam(servers[i]) > 0)
				serversWithRam.push(servers[i]);
		}
		let myServers = ns.getPurchasedServers();
		for (let i = 0; i < myServers.length; i++) {
			let index = servers.indexOf(myServers[i])
			if (index !== -1)
				servers.splice(index, 1);
		}
		return [servers, serversWithMoney, serversWithRam];
	}

	function displayServers(servers, incomeArray) {
		var hackedServers = [];
		var toHackServers = [];
		var maxNameLength = 0;
		var output; var totalIncome = 0; var income;
		for (let i = 0; i < servers.length; i++) {
			if (ns.hasRootAccess(servers[i])) {
				hackedServers.push(servers[i])
				if (servers[i].length > maxNameLength)
					maxNameLength = servers[i].length
			} else
				toHackServers.push(servers[i])
		}
		ns.print("   " + hackedServers.length + " Hacked Servers:");
		for (let i = 0; i < hackedServers.length; i++) {
			output = ""; var perc; income = 0;
			var maxM = ns.getServerMaxMoney(hackedServers[i]);
			var minL = ns.getServerMinSecurityLevel(hackedServers[i]);
			var money = ns.getServerMoneyAvailable(hackedServers[i]);
			var security = ns.getServerSecurityLevel(hackedServers[i]);
			income = ns.getScriptIncome("base.js", hackedServers[i], hackedServers[i], maxM, minL)
			if (income > incomeArray[i][1]) {
				incomeArray[i] = [incomeArray[i][0], income];
			} else if (incomeArray[i][0] == -1 || income < incomeArray[i][0]) {
				incomeArray[i] = [income, incomeArray[i][1]];
			}
			//ns.alert(hackedServers[i]+" "+incomeArray[i][0] +" "+ incomeArray[i][1])
			income = (incomeArray[i][0] + incomeArray[i][1]) / 2
			//ns.alert(income)
			if (maxM != money) {
				output += " Growing " + hackedServers[i] + " ";
				perc = parseFloat(money / maxM * 100).toFixed(2);
			} else if (minL != security) {
				output += "  Weaken " + hackedServers[i] + " ";
				perc = parseFloat(minL / security * 100).toFixed(2);
			} else {
				output += " Hacking " + hackedServers[i] + " ";
				perc = parseFloat(100).toFixed(1);
			}
			var aux = perc;
			for (let j = output.length; j < maxNameLength + 10; j++)
				output += "_";
			output += "[";
			for (let j = 0; j < 100; j++) {
				if (aux >= 1) {
					output += "█"; aux--;
				} else {
					output += "-";
				}
			}
			output += "]" + perc + "%";
			if (income > 0) {
				output += " Income: " + parseFloat(income).toFixed(2);
				totalIncome += income;
			}
			ns.print(output);
		}
		if (totalIncome > 0) {
			output = ""
			for (let j = 0; j < maxNameLength + 113; j++) {
				output += " ";
			}
			output += "Total Income: " + parseInt(totalIncome);
			ns.print(output);
		}
		if (toHackServers.length > 0) {
			output = "   Next level required: " + ns.getServerRequiredHackingLevel(toHackServers[0])
			output += " | " + toHackServers.length + " Servers To Hack:"
			ns.print(output);
			output = toHackServers[0];
			for (let i = 1; i < toHackServers.length; i++)
				output += ", " + toHackServers[i]
			ns.print(output);
		}
		return incomeArray;
	}

	async function rootServers(servers) {
		if (!s) {
			purchaseExe();
			s = ns.fileExists("sqlinject.exe");
			if (!h) {
				h = ns.fileExists("httpworm.exe");
				if (!r) {
					r = ns.fileExists("relaysmtp.exe");
					if (!f) {
						f = ns.fileExists("ftpcrack.exe");
						if (!b)
							b = ns.fileExists("brutessh.exe");
					}
				}
			}
		}
		for (let i = 0; i < servers.length; i++) {
			let server = servers[i];
			if (!ns.hasRootAccess(server)) {
				let port = 0;
				if (b) {
					ns.brutessh(server); port++;
				}
				if (f) {
					ns.ftpcrack(server); port++;
				}
				if (r) {
					ns.relaysmtp(server); port++;
				}
				if (h) {
					ns.httpworm(server); port++;
				}
				if (s) {
					ns.sqlinject(server); port++;
				}
				if (ns.getServerNumPortsRequired(server) <= port && ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()) {
					ns.nuke(server);
					if (facServers.indexOf(server) != -1)
						while (!await backdoor(server))
							facServers.shift()
				}
			}
		}
	}

	async function maxOutServers(serversWithMoney, serversWithRam) {
		let script = "base.js";
		let script2 = "base2.js";
		let myServers = ns.getPurchasedServers();
		let server = serversWithMoney[0];
		await hackServer(script, server, server, ns.getServerMaxMoney(server), ns.getServerMinSecurityLevel(server), 99.9999);
		for (let i = 1; i < serversWithMoney.length; i++) {
			server = serversWithMoney[i];
			if (ns.hasRootAccess(server) && serverMaxOut.indexOf(server) === -1) {
				let skip = false;
				let maxM = ns.getServerMaxMoney(server);
				let minL = ns.getServerMinSecurityLevel(server);
				let money = ns.getServerMoneyAvailable(server);
				let security = ns.getServerSecurityLevel(server);
				let ram = ns.getServerMaxRam(server);
				let percM = parseInt(money / maxM * 100);
				let percL = parseInt(minL / security * 100);
				if (ram > 0) {
					if (percM < 90 || percL < 90) {
						if (!ns.scriptRunning(script2, "home")) {
							await hackServer(script2, "home", server, maxM, minL, 95);
						}
						for (let j = 0; j < serversWithRam.length; j++) {
							if (!ns.scriptRunning(script, serversWithRam[j]) &&
								ram - ns.getServerUsedRam(serversWithRam[j]) >= ns.getScriptRam(script2)) {
								if (await hackServer(script2, serversWithRam[j], server, maxM, minL, 99.9999)) {
									break; skip = true;
								}
							}
						}
						if (skip)
							continue;
						for (let j = 0; j < myServers.length; j++) {
							if (!ns.scriptRunning(script, myServers[j]) &&
								ram - ns.getServerUsedRam(myServers[j]) >= ns.getScriptRam(script2)) {
								if (await hackServer(script2, myServers[j], server, maxM, minL, 99.9999))
									break;
							}
						}
					} else if (!ns.scriptRunning(script, server)) {
						ns.killall(server)
						await hackServer(script, server, server, maxM, minL, 99.9999);
						serverMaxOut.push(server);
					}

				} else {
					if (!ns.serverExists(server + "_hack")) {
						ns.purchaseServer(server + "_hack", 512);
					} else {
						if (percM > 100 && percL > 100) {
							if (!ns.scriptRunning(script, server + "_hack")) {
								ns.killall(server + "_hack")
								await hackServer(script, server + "_hack", server, maxM, minL, 99.9999);
								serverMaxOut.push(server);
							}
						}
					}
				}
			}
		}
	}

	async function hackServer(script, server, hackServer, maxM, minL, perc) {
		let ram;
		if (perc != null)
			ram = (ns.getServerMaxRam(server) / 100) * perc;
		else
			ram = ns.getServerMaxRam(server) - ns.getServerUsedRam(server) - 1;
		if (ram < ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) {
			let thread = ram / ns.getScriptRam(script);
			await ns.scp(script, server)
			if (script == "base2.js" && server != "home") {
				let percM = parseInt(ns.getServerMoneyAvailable(hackServer) / maxM * 100);
				let percL = parseInt(minL / ns.getServerSecurityLevel(hackServer) * 100);
				if (percM < 90 || percL < 90) {
					for (let j = 0; j < thread / 2; j++) {
						ns.mv(server, script, "base-" + j + ".js")
						await ns.scp(script, server)
						ns.exec("base-" + j + ".js", server, 2, hackServer, maxM, minL)
						await ns.sleep(0)
					}
				}
				else
					return true;
			}
			else
				ns.exec(script, server, thread, hackServer, maxM, minL)
		}
		return false;
	}

	function purchaseExe() {
		let ownmoney = ns.getServerMoneyAvailable('home')
		let available = prices
			.filter((p) => { return !ns.fileExists(p.name) })
			.filter((p) => { return (p.price * 1000000) < ownmoney })
			.filter((p) => { return p.level <= ns.getHackingLevel() })
		if (available.length > 0) {
			let item = available[0]
			if (inputcommands(`buy ${item.name}`))
				ns.toast(`Buying ${item.name} for ${ns.nFormat(item.price * 1000000, '($ 0.00 a)')}`)
		}
	}

	async function backdoor(server) {
		if (inputcommands(`run connect.js ${server}`)) {
			await ns.sleep(500)
			if (inputcommands(`backdoor`)) {
				ns.toast(`backdooring ${server}`)
				await ns.sleep(5000)
				return (inputcommands(`home`))
			}
		}
		return false;
	}

	function inputcommands(input) {
		let terminalInput = ''
		eval('terminalInput = document.getElementById("terminal-input")')
		if (!terminalInput)
			return false;
		terminalInput.value = input;
		const handler = Object.keys(terminalInput)[1];
		terminalInput[handler].onChange({ target: terminalInput });
		terminalInput[handler].onKeyDown({ keyCode: 13, preventDefault: () => null });
		return true;
	}
}