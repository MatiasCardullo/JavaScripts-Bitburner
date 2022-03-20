/** @param {NS} ns **/
export async function main(ns) {
	let files = ns.ls("home", ".msg").concat(ns.ls("home", ".lit"));
	let youGotmail = new Audio("https://www.thesoundarchive.com/email/youGotmail.wav")
	if (ns.read("mail.txt")=="") {
		let fileLog = ns.read("mail.txt").split(',')
		if (files.length != fileLog.length) {
			youGotmail.play()
			files.forEach((e) => fileLog.includes(e) ? null : ns.toast("You got mail! "+e, "success", 180000))
			ns.write("mail.txt", files, 'w')
		}
	} else {
		ns.write("mail.txt", files, 'w')
	}
}