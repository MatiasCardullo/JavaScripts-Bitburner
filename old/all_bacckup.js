/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL')
	//ns.enableLog('purchaseServer')
	let servers = scanServers();
	let allServers = servers[0];
	let serversWithMoney = servers[1];
	let serversWithRam = servers[2];
	var b = false, f = false, r = false, h = false, s = false; var tor = false;
	let minPorts=[0,5000,5000,5000,5000,5000];
	for (let i = 0; i < allServers.length; i++) {
		let port=ns.getServerNumPortsRequired(allServers[i]);
		let hacklevel=ns.getServerRequiredHackingLevel(allServers[i]);
		if(minPorts[port]>hacklevel&&hacklevel!=1)
			minPorts[port]=hacklevel;
	}
	var prices = [
			{ price: 0.5, name: 'BruteSSH.exe', level: minPorts[1] },
			{ price: 1.5, name: 'FTPCrack.exe', level: minPorts[2] },
			{ price: 5, name: 'relaySMTP.exe', level: minPorts[3] },
			{ price: 30, name: 'HTTPWorm.exe', level: minPorts[4] },
			{ price: 250, name: 'SQLInject.exe', level: minPorts[5] }
		];
	ns.tail();

	while (true) {
		//try to buy tor if there is money and ram avaible
		if (!tor && ns.getServerMoneyAvailable("home") >= 200000 && ns.getServerMaxRam("home") - ns.getServerUsedRam("home") >= ns.getScriptRam("buyTor.js"))
			ns.exec("buyTor.js", "home"); tor = true;
		rootServers(allServers);
		buyServer(256)
		displayServers(serversWithMoney);
		await maxOutServers(serversWithMoney, serversWithRam);
		await ns.sleep(0);
		ns.clearLog();
	}

	function buyServer(ram) {
		/*let cant=ns.getPurchasedServers();
		let max=ns.getPurchasedServerLimit();
		if(cant<max)*/
		ns.purchaseServer("myServer", ram)

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
		let sort=true;
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
		for (let i = 0; i < servers.length; i++){
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

	function displayServers(servers) {
		var hackedServers = [];
		var toHackServers = [];
		var output = "";
		for (let i = 0; i < servers.length; i++) {
			if (ns.hasRootAccess(servers[i]))
				hackedServers.push(servers[i])
			else
				toHackServers.push(servers[i])
		}
		ns.print("   " + hackedServers.length + " Hacked Servers:");
		for (let i = 0; i < hackedServers.length; i++) {
			output = ""; var perc;
			var maxM = ns.getServerMaxMoney(hackedServers[i]);
			var minL = ns.getServerMinSecurityLevel(hackedServers[i]);
			var money = ns.getServerMoneyAvailable(hackedServers[i]);
			var security = ns.getServerSecurityLevel(hackedServers[i]);
			if (maxM != money) {
				output += " Growing " + hackedServers[i] + " ";
				perc = parseFloat(money / maxM * 100).toFixed(2);
			} else if (minL != security) {
				output += "  Weaken " + hackedServers[i] + " ";
				perc = parseFloat(minL / security * 100).toFixed(2);
			} else {
				output += " Hacking " + hackedServers[i] + " ";
				perc = 100;
			}
			if (perc != 0) {
				var aux = perc;
				for (let j = output.length; j < 35; j++)
					output += "_";
				output += "[";
				for (let j = 0; j < 100; j++) {
					if (aux >= 1) {
						output += "█"; aux--;
					} else {
						output += "-";
					}
				}
				output += "]" + perc.toString() + "%";
			}
			ns.print(output);
		}
		ns.print("");
		output ="   Next level required: " + ns.getServerRequiredHackingLevel(toHackServers[0])
		output += " | " + toHackServers.length + " Servers To Hack:"
		ns.print(output);
		output=toHackServers[0];
		for (let i = 1; i < toHackServers.length; i++)
			output += ", " + toHackServers[i]
		ns.print(output);
	}

	function rootServers(servers) {
		if (!s){
			purchaseExe();
			s = ns.fileExists("sqlinject.exe");
			if (!h) {
				h = ns.fileExists("httpworm.exe");
				if (!r){
					r = ns.fileExists("relaysmtp.exe");
					if (!f){
						f = ns.fileExists("ftpcrack.exe");
						if (!b)
							b = ns.fileExists("brutessh.exe");
					}
				}
			}
		}
		for (let i = 0; i < servers.length; i++) {
			let server = servers[i];
			let port=0;
			if (!ns.hasRootAccess(server)) {
				if(b){
					ns.brutessh(server);port++;
				}
				if(f){
					ns.ftpcrack(server);port++;
				}
				if(r){
					ns.relaysmtp(server);port++;
				}
				if(h){
					ns.httpworm(server);port++;
				}
				if(s){
					ns.sqlinject(server);port++;
				}
				if (ns.getServerNumPortsRequired(server) <= port && ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()) {
					ns.nuke(server);
				}
			}
		}
	}

	async function maxOutServers(serversWithMoney, serversWithRam) {
		let script = "base.js";
		let script2 = "base2.js";
		let myServers = ns.getPurchasedServers();
		let aux = 0;
		for (let i = 0; i < serversWithMoney.length; i++) {
			let maxM = ns.getServerMaxMoney(serversWithMoney[i]);
			let minL = ns.getServerMinSecurityLevel(serversWithMoney[i]);
			let money = ns.getServerMoneyAvailable(serversWithMoney[i]);
			let security = ns.getServerSecurityLevel(serversWithMoney[i]);
			let root = ns.hasRootAccess(serversWithMoney[i]);
			let ram = ns.getServerMaxRam(serversWithMoney[i]);
			let percM = parseInt(money / maxM * 100);
			let percL = parseInt(minL / security * 100);
			if (root) {
				if (ram > 0) {
					if (percM < 90 && percL < 90) {
						if (!ns.scriptRunning(script2, "home")) {
							await hackServer(script2, "home", serversWithMoney[i], maxM, minL, 85);
						}
						for (let j = 0; j < serversWithRam.length; j++) {
							if (!ns.scriptRunning(script2, serversWithRam[j]) && !ns.scriptRunning(script, serversWithRam[j])) {
								await hackServer(script2, serversWithRam[j], serversWithMoney[i], maxM, minL, 99.9999);
							}
						}
						for (let j = 0; j < myServers.length; j++) {
							if (!ns.scriptRunning(script2, myServers[j]) && !ns.scriptRunning(script, myServers[j])) {
								await hackServer(script2, myServers[j], serversWithMoney[i], maxM, minL, 99.9999);
							}
						}
					} else {
						if (ns.scriptRunning(script2, serversWithMoney[i])) {
							ns.killall(serversWithMoney[i])
						}
					}
					if (!ns.scriptRunning(script, serversWithMoney[i])) {
						await hackServer(script, serversWithMoney[i], serversWithMoney[i], maxM, minL, 99.9999);
					}
				} else {
					try{
						if (myServers.length>0&&!ns.scriptRunning(script, myServers[aux])) {
							ns.killall(myServers[aux])
							await hackServer(script, myServers[aux], serversWithMoney[i], maxM, minL, 99.9999);
							aux++;
						}
					}catch{
						
					}
					
				}
			}
		}
	}

	async function hackServer(script, server, hackServer, maxM, minL, perc) {
		let ram = (ns.getServerMaxRam(server) / 100) * perc;
		if (ram < ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) {
			let thread = ram / ns.getScriptRam(script);
			await ns.scp(script, server)
			ns.exec(script, server, thread, hackServer, maxM, minL)
		}
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