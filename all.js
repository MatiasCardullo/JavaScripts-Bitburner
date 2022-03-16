/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL')
	ns.enableLog('exec')
	ns.enableLog('sleep')
	let servers = scanServers();
	let allServers = servers[0];
	let serversWithMoney = servers[1];
	let serversWithMoneyWithoutRam = servers[3];
	var serverMaxOut = [];
	let serversWithRam = servers[2];
	var singularity = ns.args[0]
	var getGang = ns.args[0]
	var homeRAM;
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
	var symbolMap = [
		["AERO", "AeroCorp", "aerocorp"],
		["APHE", "Alpha Enterprises", "alpha-ent"],
		["BLD", "Blade Industries", "blade"],
		["CLRK", "Clarke Incorporated", "clarkinc"],
		["CTK", "CompuTek", "comptek"],
		["CTYS", "Catalyst Ventures", "catalyst"],
		["DCOMM", "DefComm", "defcomm"],
		["ECP", "ECorp", "ecorp"],
		["FLCM", "Fulcrum Technologies", "fulcrumtech"],
		["FNS", "FoodNStuff", "foodnstuff"],
		["FSIG", "Four Sigma", "4sigma"],
		["GPH", "Global Pharmaceuticals", "global-pharm"],
		["HLS", "Helios Labs", "helios"],
		["ICRS", "Icarus Microsystems", "icarus"],
		["JGN", "Joe's Guns", "joesguns"],
		["KGI", "KuaiGong International", "kuai-gong"],
		["LXO", "LexoCorp", "lexo-corp"],
		["MDYN", "Microdyne Technologies", "microdyne"],
		["MGCP", "MegaCorp", "megacorp"],
		["NTLK", "NetLink Technologies", "netlink"],
		["NVMD", "Nova Medical", "nova-med"],
		["OMGA", "Omega Software", "omega-net"],
		["OMN", "Omnia Cybersystems", "omnia"],
		["OMTK", "OmniTek Incorporated", "omnitek"],
		["RHOC", "Rho Contruction", "rho-construction"],
		["SGC", "Sigma Cosmetics", "sigma-cosmetics"],
		["SLRS", "Solaris Space Systems", "solaris"],
		["STM", "Storm Technologies", "stormtech"],
		["SYSC", "SysCore Securities", "syscore"],
		["TITN", "Titan Laboratories", "titan-labs"],
		["UNV", "Universal Energy", "univ-energy"],
		["VITA", "VitaLife", "vitalife"],
		["WDS", "Watchdog Security", ""]
	];
	var facServers = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "The-Cave", "w0r1d_d43m0n"];
	ns.exec("displayServers.js", "home", 1, serversWithMoney.toString());
	let iteration = 0;
	let ramServer;
	let output;
	while (true) {
		//try to buy tor and upgrade home kernels and ram if we have the singularity and there is enough money
		
		ns.exec("autoContract.js", "home")
		while (ns.scriptRunning("autoContract.js", "home")) { await ns.sleep(0) }
		let myServers = ns.getPurchasedServers()
		homeRAM = ns.getServerMaxRam("home")
		if (homeRAM > 512) {
			ramServer = 512*2
		} else {
			ramServer=homeRAM*2;
		}
		if (myServers.length < 25) {
			ns.exec("buyServer.js", "home", 1, serversWithMoneyWithoutRam.toString(), ramServer);
		}
		ns.print(myServers.length+"/25")
		if (singularity) {
			if (!tor && ns.getServerMoneyAvailable("home") >= 200000) {
				if(ns.exec("/singularity/buyTor.js", "home")!=0){
					while (!ns.fileExists("/singularity/player/tor.txt")) { await ns.sleep(0) }
					tor = true;
				}
			}
			if (ns.read("/singularity/coreCost.txt") < ns.getServerMoneyAvailable("home")) {
				ns.exec("/singularity/upgradeHomeCores.js", "home");
				while (ns.scriptRunning("/singularity/upgradeHomeCores.js", "home")) { await ns.sleep(0) }
				ns.exec("/singularity/upgradeHomeCoresCost.js", "home");
			}
			if (ns.read("/singularity/RAMCost.txt") < ns.getServerMoneyAvailable("home")) {
				ns.exec("/singularity/upgradeHomeRAM.js", "home");
				while (ns.scriptRunning("/singularity/upgradeHomeRAM.js", "home")) { await ns.sleep(0) }
				ns.exec("/singularity/upgradeHomeRAMCost.js", "home");
			}
			ns.exec("/singularity/joinFactions.js", "home");
			while (ns.scriptRunning("/singularity/joinFactions.js", "home")) { await ns.sleep(0) }
			ns.exec("/singularity/augments.js", "home");
			while (ns.scriptRunning("/singularity/augments.js", "home")) { await ns.sleep(0) }
			if (!ns.scriptRunning("/singularity/crime.js", "home")&&myServers.length < 25)
				ns.exec("/singularity/crime.js", "home",1,getGang,false);
		}
		if (ns.getServerMoneyAvailable("home") > 1000000000000 && !ns.scriptRunning("stockTest.js", "home")) {
			ns.exec("stockTest.js", "home")
		}
		await rootServers(allServers);
		await maxOutServers(serversWithMoney, serversWithRam, myServers);
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
		let myServers = ns.getPurchasedServers();
		for (let i = 0; i < myServers.length; i++) {
			let index = servers.indexOf(myServers[i])
			if (index !== -1)
				servers.splice(index, 1);
		}
		return [servers, serversWithMoney, serversWithRam, serversWithMoneyWithoutRam];
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
			} else if (facServers.indexOf(server) != -1)
				if (await backdoor(server))
					facServers.shift()
		}
	}

	async function hackServers(serversWithMoney, serversWithRam, myServers) {

	}

	async function maxOutServers(serversWithMoney, serversWithRam, myServers) {
		let script = "base.js";
		let script2 = "base2.js";
		let server = serversWithMoney[0];
		await hackServer(script, server, server, ns.getServerMaxMoney(server), ns.getServerMinSecurityLevel(server), 99.9999);
		for (let i = 1; i < serversWithMoney.length; i++) {
			server = serversWithMoney[i];
			if (!serverMaxOut.includes(server) && serverMaxOut.length < serversWithMoney.length) {
				let maxM = ns.getServerMaxMoney(server);
				let minL = ns.getServerMinSecurityLevel(server);
				let money = ns.getServerMoneyAvailable(server);
				let security = ns.getServerSecurityLevel(server);
				let ram = ns.getServerMaxRam(server);
				let percM = parseInt(money / maxM * 100);
				let percL = parseInt(minL / security * 100);
				if (!ns.scriptRunning(script2, "home")) {
					await hackServer(script2, "home", server, maxM, minL, 85);
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
							/*if (skip)
								continue;*/
							for (let j = 0; j < myServers.length; j++) {
								//ns.print(myServers[j] + " " + server)
								if (!ns.scriptRunning(script, myServers[j])) {
									if (await hackServer(script2, myServers[j], server, maxM, minL, 99.9999))
										break;
								}
							}
						} else {
							ns.killall(server)
							await hackServer(script, server, server, maxM, minL, 99.9999);
						}
					} else if (!serverMaxOut.includes(server)) {
						serverMaxOut.push(server);
					}

				} else {
					if (ns.serverExists(server + "_hack")) {
						if (percM < 90 || percL < 90) {
							for (let j = 0; j < serversWithRam.length; j++) {
								if (!ns.scriptRunning(script, serversWithRam[j])) {
									if (await hackServer(script2, serversWithRam[j], server, maxM, minL, 99.9999))
										break;
								}
							}
							for (let j = 0; j < myServers.length; j++) {
								if (!ns.scriptRunning(script, myServers[j])) {
									if (await hackServer(script2, myServers[j], server, maxM, minL, 99.9999))
										break;
								}
							}
						} else if (!ns.scriptRunning(script, server + "_hack")) {
							ns.killall(server + "_hack")
							await hackServer(script, server + "_hack", server, maxM, minL, 99.9999);
							serverMaxOut.push(server);
						}
					}
				}
			}
		}
	}

	async function hackServer(script, server, hackServer, maxM, minL, perc) {
		let ram; //let count = 0;
		let maxRam = ns.getServerMaxRam(server)
		if (perc != null)
			ram = (maxRam / 100) * perc;
		else
			ram = maxRam - ns.getServerUsedRam(server) - 1;
		if (ns.hasRootAccess(server) && ns.hasRootAccess(hackServer) && ram < maxRam - ns.getServerUsedRam(server)) {
			let thread = ram / ns.getScriptRam(script);
			await ns.scp(script, server)
			if (script == "base2.js" && server != "home") {
				let percM = parseInt(ns.getServerMoneyAvailable(hackServer) / maxM * 100);
				let percL = parseInt(minL / ns.getServerSecurityLevel(hackServer) * 100);
				if (percM < 90 || percL < 90) {
					await ns.sleep(0)
					for (let j = 0; j < thread / 4; j++) {
						if (/*count < 10 && */!ns.scriptRunning("base-" + j + ".js", server, maxM)) {
							ns.mv(server, script, "base-" + j + ".js")
							await ns.scp(script, server)
							ns.exec("base-" + j + ".js", server, 4, hackServer, maxM)
							//count++;
						}
					}
				}
				else
					return true;
			}
			else {
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
			//ns.toast(`Buying ${item.name} for ${ns.nFormat(item.price * 1000000, '($ 0.00 a)')}`)
		}

	}

	async function backdoor(server) {
		if (singularity && ns.getScriptRam("/singularity/backdoor.js") <= homeRAM - ns.getServerUsedRam("home")) {
			let path = scanNode("home", server, [])
			ns.exec("/singularity/connect.js", "home", 1, path[0])
			await ns.sleep(100);
			for (let i = 1; i < path.length; i++) {
				ns.exec("/singularity/connect.js", "home", 1, path[i])
				await ns.sleep(100);
			}
			ns.exec("/singularity/backdoor.js", "home")
			ns.toast(`Installing backdoor ${server}`)
			await ns.sleep(5000);
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

	function scanNode(node, target, scanedServers) {
		let servers = ns.scan(node).filter((server) => !scanedServers.includes(server));
		scanedServers.push(...servers);

		if (servers.includes(target)) return [target];

		for (let server of servers) {
			const path = scanNode(server, target, scanedServers);
			if (path) return [server, ...path]
		}

		return '';
	}
}