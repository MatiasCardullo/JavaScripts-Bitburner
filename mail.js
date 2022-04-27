/** @param {NS} ns **/
export async function main(ns) {
	let fileLog = ns.read("mail.txt").split(',')
	let files = ns.ls("home", ".msg").concat(ns.ls("home", ".lit"));
	let sound = new Audio("https://www.thesoundarchive.com/email/youGotmail.wav")
	if (files.length != fileLog.length) {
		sound.play()
		files.forEach((e) => fileLog.includes(e) ? null : ns.toast("You got mail! " + e, "success", 180000))
		await ns.write("mail.txt", files, 'w')
		while (!sound.ended) { await ns.sleep(0) }
	}
}