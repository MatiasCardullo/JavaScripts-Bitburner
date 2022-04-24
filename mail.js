/** @param {NS} ns **/
export async function main(ns) {
	let path = "/logs/mail.txt"
	let fileLog = ns.read(path).split(',')
	let files = ns.ls("home", ".msg").concat(ns.ls("home", ".lit"));
	if (files.length != fileLog.length) {
		new Audio("https://www.thesoundarchive.com/email/youGotmail.wav").play()
		files.forEach((e) => fileLog.includes(e) ? null : ns.toast("You got mail! " + e, "success", 180000))
		ns.write(path, files, 'w')
	}
}