/** @param {NS} ns **/
export async function main(ns) {
	let fileLog = ns.read("mail.txt").split(',')
	let files = ns.ls("home", ".msg").concat(ns.ls("home", ".lit"));
	let sound = new Audio("https://www.thesoundarchive.com/email/youGotmail.wav")
	if (files.length != fileLog.length) {
		files.forEach((e) => fileLog.includes(e) ? null : newMail(e))
		sound.play()
		await ns.write("mail.txt", fileLog, 'w')
		await ns.sleep(2000)
	}

	function newMail(m) {
		fileLog.push(m)
		ns.toast("You got mail! " + m, "success", 180000)
	}
}