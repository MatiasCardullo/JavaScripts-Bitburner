/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('run')
	ns.disableLog('sleep')
	for (let i = 0; i < 7000; i++) {
		let num = ns.nFormat(i, "000")
		let serie = Math.ceil(i / 1000)
		let path = "/fscp/serie" + serie + '/' + num + ".txt"
		if (ns.read(path) == "") {
			let pid
			do {
				pid = ns.run("wget.js", 1, "https://scp-wiki.wikidot.com/scp-" + num, path,
					'<div id="page-content">', '<div class="footer-wikiwalk-nav">', '\n</div>')
				await ns.sleep(100)
			} while (pid == 0)
			ns.print(" Downloading file scp-" + i)
		}
	}
}