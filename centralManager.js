import { inputcommands, execSafeScript, execScript } from "./lib/basicLib.js";
import { speak } from "./sounds/voice.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL')
	ns.enableLog('exec')
	//ns.enableLog('sleep')
	let augs; let goStanek; let gInfo;
	let hacknetN; let sleeves;
	let bnData = JSON.parse(ns.read("/logs/bitnodeMultipliers.txt"))
	let maxMyServers = Math.ceil(25 * bnData.PurchasedServerLimit)
	let servers = scanServers();
	let allServers = servers[0];
	let serversWithMoney = servers[1];
	let serversWithRam = servers[2];
	let serversWithMoneyWithoutRam = servers[3];
	var serverMaxOut = [];
	var singularity = ns.args[0]
	let doCrime = ns.args[1]
	let getGang = ns.args[2]
	let setGang = ns.args[3]
	var homeRAM;
	var b = false, f = false, r = false, h = false, s = false;
	let minPorts = [0, 50000, 50000, 50000, 50000, 50000];
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

	ns.exec("monitor.js", "home");
	await ns.sleep(5000)
	ns.tail()
	let ramServer; let player;
	let stopMarket = false
	let alertBonusGang = 0
	let alertBonusBB = 0
	await execSafeScript(ns, "getPlayer.js")
	while (true) {
		gInfo = ns.read("/gang/info.txt")
		augs = ns.read("/augments/installed.txt")
		goStanek = "/augments/stanek/activeFragments.txt" != "" && augs != "" && !augs.includes("Stanek's Gift - Serenity")
		hacknetN = ns.read("/hacknet/count.txt")
		sleeves = ns.read("/sleeves/count.txt")
		player = JSON.parse(ns.read("/logs/playerStats.txt"))
		let myServers = ns.read("myServers.txt").split(',')
		homeRAM = ns.getServerMaxRam("home")
		if (homeRAM > 1024) {
			ramServer = 1024
		} else {
			ramServer = homeRAM;
		}
		//ns.print(serverMaxOut.length, serverMaxOut)
		/*if (player.currentWorkFactionDescription == "carrying out hacking contracts" && !ns.scriptRunning("share.js", "home")) {
			let pid;
			do {
				await ns.sleep(0)
				pid = ns.exec("share.js", "home", homeRAM / 4 / 4)
			} while (pid == 0)
		}*/
		if (ns.isRunning("/stock/market.js", "home", true, "", "", ""))
			stopMarket = true
		if (!stopMarket && !ns.scriptRunning("/stock/market.js", "home") && player.bitNodeN != 12 && (ns.getServerMoneyAvailable("home") > 25000000000 * bnData.FourSigmaMarketDataApiCost ||
			(player.hasWseAccount && player.hasTixApiAccess && player.has4SData && player.has4SDataTixApi))) {
			ns.exec("/stock/market.js", "home")
		}
		if (maxMyServers > 0 && myServers.length !== maxMyServers)
			await execSafeScript(ns, "buyServer.js", "home", serversWithMoneyWithoutRam.toString(), ramServer);
		await execSafeScript(ns, "/cct/manager.js")
		await execSafeScript(ns, "/hacknet/manager.js", "home", goStanek)
		if (singularity) {
			if (!player.tor && ns.getServerMoneyAvailable("home") > 200000) {
				await execSafeScript(ns, "/singularity/buyTor.js")
			}
			if (ns.read("/logs/coreCost.txt") < ns.getServerMoneyAvailable("home")) {
				await execSafeScript(ns, "/singularity/upgradeHomeCores.js")
				await execSafeScript(ns, "/singularity/upgradeHomeCoresCost.js");
			}
			if (ns.read("/logs/RAMCost.txt") < ns.getServerMoneyAvailable("home") && (4096 > homeRAM || ns.read("activeFragments.txt") != "")) {
				await execSafeScript(ns, "/singularity/upgradeHomeRAM.js");
				await execSafeScript(ns, "/singularity/upgradeHomeRAMCost.js");
			}
			if (sleeves == "") {
				if ((doCrime && myServers.length < maxMyServers) || (getGang && gInfo == "") && !ns.scriptRunning("/singularity/crime.js", "home")) {
					let pid = await execScript(ns, "/singularity/crime.js", "home", getGang, false);
					while (homeRAM < 64 && ns.isRunning(pid)) { await ns.sleep(0) }
				}
				if ((!doCrime || (doCrime && myServers.length == maxMyServers)) &&
					(!player.inBladeburner || augs.includes("The Blade's Simulacrum"))) {
					await execSafeScript(ns, "/singularity/company.js")
				}
			}
			if (ns.read("/sleeves/count.txt") != "" || ((!getGang || gInfo !== "") && (!doCrime || myServers.length == parseInt(maxMyServers)))
				/*&& ns.getServerMoneyAvailable("home") < parseFloat(ns.read("/augments/minPrice.txt"))*/) {
				if (player.inBladeburner) {
					if (augs.includes("The Blade's Simulacrum") || !player.isWorking)
						if (!ns.scriptRunning("/bladeburner/manager.js", "home"))
							await execScript(ns, "/bladeburner/manager.js", "home");
				} else {
					if (player.strength < 100 || player.defense < 100 || player.dexterity < 100 || player.agility < 100) {
						if (!ns.scriptRunning("/singularity/crime.js", "home")) {
							let pid = await execScript(ns, "/singularity/crime.js", "home", false, false);
							while (homeRAM < 64 && ns.isRunning(pid)) { await ns.sleep(0) }
						}
					} else if (!ns.scriptRunning("/bladeburner/join.js", "home"))
						await execSafeScript(ns, "/bladeburner/join.js");
				}
			}
			let list = ns.read("/factions/invitations.txt")
			await execSafeScript(ns, "/factions/checkInvitations.js")
			if (list != ns.read("/factions/invitations.txt"))
				await execSafeScript(ns, "/factions/join.js")
			if (homeRAM < 64) {
				await execSafeScript(ns, "/augments/manager.js", "home", doCrime);
				await execSafeScript(ns, "/sleeves/manager.js");
			} else {
				if (!ns.scriptRunning("/augments/manager.js", "home"))
					await execScript(ns, "/augments/manager.js", "home", doCrime);
				if (!ns.scriptRunning("/sleeves/manager.js", "home"))
					await execScript(ns, "/sleeves/manager.js");
			}
			if (-54000 > ns.heart.break() && setGang && !ns.scriptRunning("/gang/manager.js", "home"))
				await execScript(ns, "/gang/manager.js")
			if (augs.includes("The Red Pill") || ns.read("/bladeburner/doneBlackOps.txt").includes("Operation Daedalus"))
				await execScript(ns, "/singularity/destroyW0r1dD43m0n.js", "home", 12, "jumper.js")
			if (goStanek && hacknetN != "") {
				hacknetN = parseInt(hacknetN)
				for (let i = 0; i < hacknetN; i++) {
					let server = "hacknet-node-" + i
					if (ns.serverExists(server) && ns.getServerMaxRam(server) > 16) {
						await ns.scp("/augments/stanek/chargeFragment.js", server)
						await ns.scp("/augments/stanek/activeFragments.txt", server)
						await ns.scp("/augments/stanek/manager2.js", server)
						if (!ns.isRunning("/augments/stanek/manager2.js", server, server, "", "", ""))
							await execScript(ns, "/augments/stanek/manager2.js", server, server)
					}
				}
			}
			if (player.factions.includes("Church of the Machine God") && !ns.scriptRunning("/augments/stanek/manager.js", "home"))
				await execScript(ns, "/augments/stanek/manager.js")
			if (alertBonusGang == 0 && gInfo !== "" && ns.gang.getBonusTime() < 1000)
				alertBonusGang = 1
			if (alertBonusBB == 0 && player.inBladeburner && ns.bladeburner.getBonusTime() < 1000)
				alertBonusBB = 1
			/*if (ns.gang.getBonusTime() < 1000 && ns.bladeburner.getBonusTime() < 1000)
				eval("window.open('cc:=C:\\Users\\Nexxus\\Desktop\\GitHub\\Bitburner\\JavaScripts-Bitburner\\closeBitburner.bat');")*/
			if (alertBonusGang == 1) {
				alertBonusGang = 2
				ns.toast("Gang: bonus time over", "success", null)
			}
			if (alertBonusBB == 1) {
				alertBonusBB = 2
				ns.toast("Bladeburner: bonus time over", "success", null)
			}
		}
		await rootServers(allServers);
		await maxOutServers(serversWithMoney, serversWithRam, myServers);
		await execSafeScript(ns, "mail.js");
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
			if (ns.getServerMaxRam(servers[i]) > 0 && !servers[i].includes("hacknet"))
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
		let facServers = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "The-Cave", "fulcrumassets"]
		let bServers = ns.read("/logs/backdoor.txt")
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
			} else if (ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel() && !bServers.includes(server)/* && facServers.includes(server)*/)
				if (await backdoor(server)) {
					let output = "";
					if (bServers != "")
						output += ','
					output += server
					await ns.write("/logs/backdoor.txt", output, 'a')
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
			if (!serverMaxOut.includes(server)) {
				let maxM = ns.getServerMaxMoney(server);
				let minL = ns.getServerMinSecurityLevel(server);
				let money = ns.getServerMoneyAvailable(server);
				let security = ns.getServerSecurityLevel(server);
				let ram = ns.getServerMaxRam(server);
				let percM = parseInt(money / maxM * 100);
				let percL = parseInt(minL / security * 100);
				if (!ns.scriptRunning("baseHome.js", "home")) {
					await hackServer("baseHome.js", "home", server, maxM, minL);
				}
				if (ram > 0) {
					if (!ns.scriptRunning(script, server)) {
						if (percM < 90 || percL < 90) {
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
							if (count >= runInParalel && serverMaxOut.length < serversWithMoney.length) {
								break;
							}
						} else {
							if (!ns.scriptRunning(script, server))
								ns.killall(server)
							await hackServer(script, server, server, maxM, minL, 99.9999);
						}
					} else if (!serverMaxOut.includes(server)) {
						serverMaxOut.push(server); continue;
					}
				} else {
					let doIt = false
					let ramServer
					if (ns.serverExists(server + "_hack")) {
						ramServer = server + "_hack"
						doIt = true
					} else if (ns.serverExists("hacknet-node-" + noRam)) {
						ramServer = "hacknet-node-" + noRam
						doIt = true
					}
					if (doIt) {
						if (!ns.scriptRunning(script, ramServer)) {
							if (percM < 90 || percL < 90) {
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
								if (count >= runInParalel && serverMaxOut.length < serversWithMoney.length) {
									break;
								}
							} else {
								if (!ns.scriptRunning(script, ramServer))
									ns.killall(ramServer)
								await hackServer(script, ramServer, server, maxM, minL, 99.9999);
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
		if (!ns.hasRootAccess(server))
			return;
		let ram = 4;
		let maxRam = ns.getServerMaxRam(server)
		if (perc != null) {
			ram = (maxRam / 100) * perc;
		} else {
			maxRam = Math.min(4096, maxRam)
			if (maxRam > 1024) {
				ram = 1024;
			} else if (maxRam > 128) {
				ram = maxRam - 96;
			} else if (maxRam > 64) {
				ram = 16;
			}
		}
		await ns.scp(script, server);
		let percM = parseInt(ns.getServerMoneyAvailable(hackServer) / maxM * 100);
		let percL = parseInt(minL / ns.getServerSecurityLevel(hackServer) * 100);
		let thread = ram / ns.getScriptRam(script);
		if (goStanek && maxRam > 16 && server.includes("_hack") && !ns.scriptRunning("base.js", server) && percM < 100 && percL < 100) {
			if (ns.getServerUsedRam(server) < ns.getServerMaxRam(server)) {
				await ns.scp("/augments/stanek/chargeFragment.js", server)
				await ns.scp("/augments/stanek/activeFragments.txt", server)
				await ns.scp("/augments/stanek/manager2.js", server)
				if (!ns.isRunning("/augments/stanek/manager2.js", server, server, "", "", ""))
					await execScript(ns, "/augments/stanek/manager2.js", server, server)
			}
		}
		else if (ns.hasRootAccess(hackServer) && ram < maxRam - ns.getServerUsedRam(server)) {
			if (script == "base2.js" && server != "home") {
				if (percM < 90 || percL < 90) {
					for (let j = 0; j < thread / 4; j++) {
						if (!ns.scriptRunning("base-" + j + ".js", server, maxM)) {
							ns.mv(server, script, "base-" + j + ".js")
							await ns.scp(script, server)
							ns.exec("base-" + j + ".js", server, 4, hackServer, maxM)
						}
					}
					await ns.sleep(0)
				}
				else
					return true;
			} else {
				if (script == "base.js") {
					let text = "Running Hack Script in " + server
					speak(text, 11)
					ns.toast(text)
				}
				do {
					ns.kill("/augments/stanek/manager2.js", server, server, "", "", "")
				} while (ns.scriptRunning("/augments/stanek/manager2.js", server))
				let pid;
				do {
					pid = ns.exec(script, server, thread, hackServer, maxM, minL, thread);
					await ns.sleep(0)
				} while (pid == 0)
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
		let text = "Installing backdoor in " + server
		if (singularity) {
			await execSafeScript(ns, "/singularity/connect.js", "home", server)
			let pid = await execScript(ns, "/singularity/backdoor.js")
			speak(text, 11)
			ns.toast(text)
			while (ns.isRunning(pid)) { await ns.sleep(0) }
			await execScript(ns, "/singularity/connect.js", "home", "home")
			return true;
		} else {
			if (inputcommands(`run connect.js ${server}`)) {
				await ns.sleep(200)
				if (inputcommands(`backdoor`)) {
					speak(text, 11)
					ns.toast(text)
					await ns.sleep(5000)
					return (inputcommands(`home`))
				}
			}
			return false;
		}
	}
}