/** @param {NS} ns **/
export async function main(ns) {
	let fileLog = ns.read("mail.txt").split(',')
	let files = ns.ls("home", ".msg").concat(ns.ls("home", ".lit"));
	let sound = new Audio("https://www.thesoundarchive.com/email/youGotmail.wav")
	if (files.length > fileLog.length) {
		files.forEach(function (e) {
			if (!fileLog.includes(e)) {
				fileLog.push(e)
				ns.toast("You got mail! " + e, "success", 180000)
			}
		})
		sound.play()
		await ns.write("mail.txt", fileLog, 'w')
		await ns.sleep(2000)
	}

	function newMail(m) {

	}
}