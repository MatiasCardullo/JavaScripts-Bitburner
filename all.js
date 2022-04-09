import { inputcommands, execSafeScript } from "./lib/basicLib.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL')
	ns.enableLog('exec')
	let servers = scanServers();
	let allServers = servers[0];
	let serversWithMoney = servers[1];
	let serversWithMoneyWithoutRam = servers[3];
	var serverMaxOut = [];
	let serversWithRam = servers[2];
	var singularity = ns.args[0]
	var doCrime = ns.args[1]
	var getGang = ns.args[2]
	var setGang = ns.args[3]
	var homeRAM;
	var b = false, f = false, r = false, h = false, s = false;
	let minPorts = [0, 5000, 5000, 5000, 5000, 5000];
	for (let i = 0; i < allServers.length; i++) {
		let port = ns.getServerNumPortsRequired(allServers[i]);
		let hacklevel = ns.getServerRequiredHackingLevel(allServers[i]);
		if (minPorts[port] > hacklevel && hacklevel != 1)
			minPorts[port] = hacklevel;
	}
	var prices = [
		{ price: 0.6, name: 'BruteSSH.exe', level: minPorts[1] },
		{ price: 1.5, name: 'FTPCrack.exe', level: minPorts[2] },
		{ price: 5, name: 'relaySMTP.exe', level: minPorts[3] },
		{ price: 30, name: 'HTTPWorm.exe', level: minPorts[4] },
		{ price: 250, name: 'SQLInject.exe', level: minPorts[5] }
	];
	
	await ns.sleep(10000)
	ns.exec("monitor.js", "home");
	ns.tail()
	let ramServer;
	while (true) {
		let myServers = ns.read("myServers.txt").split(',')
		homeRAM = ns.getServerMaxRam("home")
		if (homeRAM > 512) {
			ramServer = 512 * 2
		} else {
			ramServer = homeRAM * 2;
		}
		//ns.print(serverMaxOut.length, serverMaxOut)
		if ((ns.getServerMoneyAvailable("home") > 25000000000 || ns.read("/stock/access.txt") == "true,true,true,true") && !ns.scriptRunning("stockTest.js", "home")) {
			ns.exec("stockTest.js", "home")
		}
		await execSafeScript(ns, "autoContract.js")
		if (setGang) {
			await execSafeScript(ns, "/singularity/gang.js")
		}
		if (singularity) {
			if (!ns.serverExists("darkweb") && ns.getServerMoneyAvailable("home") > 200000) {
				ns.exec("/singularity/buyTor.js", "home")
			}
			if (ns.read("/singularity/coreCost.txt") < ns.getServerMoneyAvailable("home")) {
				await execSafeScript(ns, "/singularity/upgradeHomeCores.js")
				await execSafeScript(ns, "/singularity/upgradeHomeCoresCost.js");
			}
			if (ns.read("/singularity/RAMCost.txt") < ns.getServerMoneyAvailable("home")) {
				await execSafeScript(ns, "/singularity/upgradeHomeRAM.js");
				await execSafeScript(ns, "/singularity/upgradeHomeRAMCost.js");
			}
			if (myServers.length < 25 && doCrime) {
				if (doCrime && !ns.scriptRunning("/singularity/crime.js", "home"))
					ns.exec("/singularity/crime.js", "home", 1, getGang, false);
				while (homeRAM < 64 && ns.scriptRunning("/singularity/crime.js", "home")) { await ns.sleep(0) }
			} else {
				await execSafeScript(ns, "/singularity/company.js")
				if (homeRAM > 32) {
					ns.exec("/singularity/augments.js", "home");
					while (homeRAM < 64 && ns.scriptRunning("/singularity/augments.js", "home")) { await ns.sleep(0) }
				}
			}
			await execSafeScript(ns, "/singularity/joinFactions.js")
		}
		await rootServers(allServers);
		await maxOutServers(serversWithMoney, serversWithRam, myServers);
		if (myServers.length < 25) {
			ns.exec("buyServer.js", "home", 1, serversWithMoneyWithoutRam.toString(), ramServer);
		}
		ns.exec("mail.js", "home");
		await ns.sleep(0)

	}

	function scanServers() {
		let servers = ["home"];
		let serversWithMoney = [];
		let serversWithRam = [];
		let serversWithMoneyWithoutRam = [];
		for (let i = 0; i < servers.length; i++) {
			var thisScan = ns.scan(servers[i]);
			for (let j = 0; j < thisScan.length; j++)
				if (servers.indexOf(thisScan[j]) === -1 && thisScan[j] !== "darkweb")
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
		for (let i = 1; i < serversWithMoney.length; i++) {
			if (ns.getServerMaxRam(serversWithMoney[i]) == 0) {
				serversWithMoneyWithoutRam.push(serversWithMoney[i])
			}
		}
		let myServers = ns.read("myServers.txt").split(',').length;
		for (let i = 0; i < myServers.length; i++) {
			let index = servers.indexOf(myServers[i])
			if (index !== -1)
				servers.splice(index, 1);
		}
		return [servers, serversWithMoney, serversWithRam, serversWithMoneyWithoutRam];
	}

	async function rootServers(servers) {
		var facServers = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "The-Cave", "w0r1d_d43m0n", "fulcrumassets"]
		let bServers = ns.read("backdoor.txt")
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
					if (f) {
						ns.ftpcrack(server); port++;
						if (r) {
							ns.relaysmtp(server); port++;
							if (h) {
								ns.httpworm(server); port++;
								if (s) {
									ns.sqlinject(server); port++;
								}
							}
						}
					}
				}
				if (ns.getServerNumPortsRequired(server) <= port && ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()) {
					ns.nuke(server);
				}
			} else if (ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel() && !bServers.includes(server) && facServers.includes(server))
				if (await backdoor(server)) {
					let output = "";
					if (bServers != "")
						output += ','
					output += server
					await ns.write("backdoor.txt", output, 'a')
				}
		}
	}

	async function hackServers(serversWithMoney, serversWithRam, myServers) {

	}

	async function maxOutServers(serversWithMoney, serversWithRam, myServers) {
		let script = "base.js";
		let script2 = "base2.js";
		let server = serversWithMoney[0];
		let runInParalel = Math.ceil(ns.getHackingLevel() / 1000); let count = 0;
		await hackServer(script, server, server, ns.getServerMaxMoney(server), ns.getServerMinSecurityLevel(server), 99.9999);
		for (let i = 1; i < serversWithMoney.length; i++) {
			server = serversWithMoney[i];
			await ns.sleep(0)
			if (!serverMaxOut.includes(server) && serverMaxOut.length < serversWithMoney.length) {
				let maxM = ns.getServerMaxMoney(server);
				let minL = ns.getServerMinSecurityLevel(server);
				let money = ns.getServerMoneyAvailable(server);
				let security = ns.getServerSecurityLevel(server);
				let ram = ns.getServerMaxRam(server);
				let percM = parseInt(money / maxM * 100);
				let percL = parseInt(minL / security * 100);
				if (!ns.scriptRunning(script2, "home")) {
					await hackServer(script2, "home", server, maxM, minL);
				}
				if (ram > 0) {
					if (!ns.scriptRunning(script, server)) {
						if (percM < 90 || percL < 90 && !ns.fileExists(script, server)) {
							for (let j = 0; j < serversWithRam.length; j++) {
								if (!ns.scriptRunning(script, serversWithRam[j])) {
									if (await hackServer(script2, serversWithRam[j], server, maxM, minL, 99.9999))
										break;
								}
							}
							for (let j = 0; j < myServers.length; j++) {
								if (ns.serverExists(myServers[j]) && !ns.scriptRunning(script, myServers[j])) {
									if (await hackServer(script2, myServers[j], server, maxM, minL, 99.9999))
										break;
								}
							}
							count++;
							if (count >= runInParalel) {
								break;
							}
						} else {
							ns.killall(server)
							await hackServer(script, server, server, maxM, minL, 99.9999);
						}
					} else if (!serverMaxOut.includes(server)) {
						serverMaxOut.push(server); continue;
					}
				} else {
					if (ns.serverExists(server + "_hack")) {
						if (!ns.scriptRunning(script, server + "_hack")) {
							if (percM < 90 || percL < 90 && !ns.fileExists(script, server + "_hack")) {
								for (let j = 0; j < serversWithRam.length; j++) {
									if (!ns.scriptRunning(script, serversWithRam[j])) {
										if (await hackServer(script2, serversWithRam[j], server, maxM, minL, 99.9999))
											break;
									}
								}
								for (let j = 0; j < myServers.length; j++) {
									if (ns.serverExists(myServers[j]) && !ns.scriptRunning(script, myServers[j])) {
										if (await hackServer(script2, myServers[j], server, maxM, minL, 99.9999))
											break;
									}
								}
								count++;
								if (count >= runInParalel) {
									break;
								}
							} else {
								ns.killall(server + "_hack")
								await hackServer(script, server + "_hack", server, maxM, minL, 99.9999);
							}
						} else {
							serverMaxOut.push(server); continue;
						}
					}
				}
			}
		}
	}

	async function hackServer(script, server, hackServer, maxM, minL, perc = null) {
		let ram = 8;
		let maxRam = ns.getServerMaxRam(server)
		if (perc != null) {
			ram = (maxRam / 100) * perc;
		} else if (maxRam > 1024) {
			ram = maxRam - 128;
		} else if (maxRam > 64) {
			ram = maxRam - 64;
		}
		if (ns.hasRootAccess(server) && ns.hasRootAccess(hackServer) && ram < maxRam - ns.getServerUsedRam(server)) {
			let thread = ram / ns.getScriptRam(script);
			await ns.scp(script, server)
			if (script == "base2.js" && server != "home") {
				let percM = parseInt(ns.getServerMoneyAvailable(hackServer) / maxM * 100);
				let percL = parseInt(minL / ns.getServerSecurityLevel(hackServer) * 100);
				if (percM < 90 || percL < 90) {
					await ns.sleep(0)
					for (let j = 0; j < thread / 4; j++) {
						if (!ns.scriptRunning("base-" + j + ".js", server, maxM)) {
							ns.mv(server, script, "base-" + j + ".js")
							await ns.scp(script, server)
							ns.exec("base-" + j + ".js", server, 4, hackServer, maxM)
						}
					}
				}
				else
					return true;
			}
			else {
				if (script == "base.js")
					ns.toast("Running Hack Script in " + server)
				ns.exec(script, server, thread, hackServer, maxM, minL, thread);
			}
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
			if (singularity) {
				ns.exec("/singularity/buyProgram.js", "home", 1, item.name)
			} else if (!inputcommands(`buy ${item.name}`))
				return;
		}

	}

	async function backdoor(server) {
		if (singularity && ns.getScriptRam("/singularity/backdoor.js") <= homeRAM - ns.getServerUsedRam("home")) {
			ns.exec("/singularity/connect.js", "home", 1, server)
			while (ns.scriptRunning("/singularity/connect.js", "home")) { await ns.sleep(0) }
			ns.exec("/singularity/backdoor.js", "home")
			ns.toast(`Installing backdoor ${server}`)
			while (ns.scriptRunning("/singularity/backdoor.js", "home")) { await ns.sleep(0) }
			ns.exec("/singularity/connect.js", "home", 1, "home")
			return true;
		} else {
			if (inputcommands(`run connect.js ${server}`)) {
				await ns.sleep(200)
				if (inputcommands(`backdoor`)) {
					ns.toast(`Installing backdoor ${server}`)
					await ns.sleep(5000)
					return (inputcommands(`home`))
				}
			}
			return false;
		}
	}
}