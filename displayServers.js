/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');
	let servers = ns.args[0].split(',');
	let isHacking = new Array(servers.length);
	isHacking.fill(false)
	ns.tail()
	while (true) {
		ns.clearLog()
		await displayServers(servers);
		await ns.sleep(0)
	}

	async function displayServers(servers) {
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
		//var ownServers=ns.getPurchasedServers()
		ns.print(`   ${hackedServers.length} Hacked Servers:`);
		for (let i = 0; i < hackedServers.length; i++) {
			let server = hackedServers[i]
			output = ""; var perc; income = 0;
			if (ns.getServerMaxRam(server) == 0) {
				try {
					await ns.scp(server + "_log.txt", server + "_hack", "home")
				} catch {

				}
			} else {
				await ns.scp(server + "_log.txt", server, "home")
			}
			try {
				ns.mv("home", server + "_log.txt", "/logs/" + server + "_log.txt")
			} catch {

			}

			let file = ns.read("/logs/" + server + "_log.txt")
			file = file.split(' ')
			for (let j = 3; j < file.length - 1; j++) {
				//ns.print(income)
				income += parseInt(file[j].split('-')[0])
			}
			var maxM = ns.getServerMaxMoney(server);
			var minL = ns.getServerMinSecurityLevel(server);
			var money = ns.getServerMoneyAvailable(server);
			var security = ns.getServerSecurityLevel(server);
			if (isHacking[i]) {
				output += " Hacking " + hackedServers[i] + " ";
				perc = parseFloat(100).toFixed(1);
				if (money / maxM <= 2 / 3)
					isHacking[i] = false;
			} else {
				perc = parseFloat(money / maxM * 50 + minL / security * 50).toFixed(2);
				if (perc == 100) {
					isHacking[i] = true;
					output += ` Hacking ${hackedServers[i]} `;
					perc = parseFloat(100).toFixed(1);
				} else
					output += ` Grow&Weak ${hackedServers[i]} `;
			}

			var aux = perc;
			for (let j = output.length; j < maxNameLength + 12; j++)
				output += "_";
			output += "(";
			for (let j = 0; j < 100; j++) {
				if (aux >= 1) {
					output += "█"; aux--;
				} else if (aux >= 1/2) {
					output += "▌"; aux--;
				} else {
					output += "-";
				}
			}
			output += `)${perc}%`;
			if (income > 0) {
				output += " Income: " + ns.nFormat(income, '0.000 a') //formatNumber(income)
				totalIncome += income;
			}
			ns.print(output);
		}
		if (totalIncome > 0) {
			output = ""
			for (let j = 0; j < maxNameLength + 115; j++) {
				output += " ";
			}
			output += "Total Income: " + ns.nFormat(totalIncome, '0.000 a') //formatNumber(totalIncome);
			ns.print(output);
		}
		if (toHackServers.length > 0) {
			//output = "   Next level required: " + ns.getServerRequiredHackingLevel(toHackServers[0]) + " | " + toHackServers.length + " Servers To Hack:"
			ns.print(`   Next level required: ${ns.getServerRequiredHackingLevel(toHackServers[0])} | ${toHackServers.length} Servers To Hack:`);
			output = toHackServers[0];
			for (let i = 1; i < toHackServers.length; i++)
				output += ", " + toHackServers[i]
			ns.print(output);
		}
	}

}