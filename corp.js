/** @param {NS} ns **/
export async function main(ns) {
	
	let employees = JSON.parse(await ns.read('employees.txt')) // this is the file you need to feed with debug data
	let scores = []
	for (let e of employees) {
		scores.push(score(e.data));
	}

	let ranks = rank(ns, scores);
	// ns.tprint(JSON.stringify(ranks))

	let positions = {
		"RandD": [],
		"Operations" : [],
		"Engineer": [],
		"Business": [],
		"Management": []
	}
	let nbEmployees = ranks.length
	while(ranks.length > 0) {
		for(const[job, employees] of Object.entries(positions)) {
			//ns.tprint("Job: " + job + " " + positions[job].length + " already assigned, limited to " + getRatio(job) * nbEmployees)
			if(positions[job].length >= getRatio(job) * nbEmployees)
				continue;
			//ns.tprint(job)			
			if(ranks.length === 0)
				break;
			let best = ranks.reduce((p,c) => p[job] > c[job] ? c : p )
			//ns.tprint("Best for " + job + " is " + best.name + " with rank " + best[job])
			positions[job].push( ranks.splice(ranks.indexOf(best), 1)[0] )
		}
	}

	ns.tprint("Set engineers first to avoid losing quality: " + positions["Engineer"].map(e => e.name)  )
	ns.tprint("Then R&D: " + positions["RandD"].map(e => e.name)  )
	ns.tprint("Then Operations: " + positions["Operations"].map(e => e.name)  )
	ns.tprint("Then Management: " + positions["Management"].map(e => e.name)  )
	ns.tprint("Finally, business can do something: " + positions["Business"].map(e => e.name)  )

}

function rank(ns, scores) {
	let ope = (scores.slice()).sort((a, b) => a.Operations - b.Operations).reverse()
	let eng = scores.slice().sort((a, b) => a.Engineer - b.Engineer).reverse()
	let bzn = scores.slice().sort((a, b) => a.Business - b.Business).reverse()
	let mgmt = scores.slice().sort((a, b) => a.Management - b.Management).reverse()
	let rand = scores.slice().sort((a, b) => a.RandD - b.RandD).reverse()
	return scores.map(e => ({
		"name": e.name,
		"Operations": ope.indexOf(e) + 1, "opeScore": e.Operations,
		"Engineer": eng.indexOf(e) + 1, "engScore": e.Engineer,
		"Business": bzn.indexOf(e) + 1, "bznScore": e.Business,
		"Management": mgmt.indexOf(e) + 1, "mgmtScore": e.Management,
		"RandD": rand.indexOf(e) + 1, "randScore": e.RandD,
	}))
}

function score(e) {
	return {
		"name": e.name,
		"Operations": e.int * 0.6 + e.cha * 0.1 + e.exp * 1.0 + e.cre * 0.5 + e.eff * 1.0,
		"Engineer": e.int * 1.0 + e.cha * 0.1 + e.exp * 1.5 + e.cre * 0.0 * e.eff * 1.0,
		"Business": e.int * 0.4 + e.cha * 1.0 + e.exp * 0.5 + e.cre * 0.0 + e.eff * 0.0,
		"Management": e.int * 0.0 + e.cha * 2.0 + e.exp * 1.0 + e.cre * 0.2 + e.eff * 0.7,
		"RandD": e.int * 1.5 + e.cha * 0.0 + e.exp * 0.8 + e.cre * 1.0 + e.eff * 0.5
	}
}

function getRatio(job) {
	switch (job) {
		case "Operations":
			return 50/100; // 50%;
		case "Engineer":
			return 20/100; // 20%;
		case "Business":
			return 5/100; // 5%
		case "Management":
			return 5/100; // 5%
		case "RandD":
			return 20/100; // 20%
	}
}