/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL')
	//ns.tail()
	let number;
	if (ns.args[0] == null) {
		number = Math.random() * 1000000
	} else {
		number = ns.args[0]
	}
	number = parseInt(number)
	let arrays = await divisible(ns, number, true)
	//ns.tprint(arrays)
	let divs = arrays[0];
	let primes = arrays[1];
	ns.tprint("divisibles " + divs)
	ns.tprint("primes " + primes)
}

export async function divisible(ns, number, checkPrimes=false) {
	let outputDivs = [];
	let outputPrim = [];
	//ns.alert("imprimiendo en aproximadamente " + parseFloat(number / 2 / 10000000 / 4.2).toFixed(2) + " segundos")
	if(!Number.isInteger(checkPrimes)){
		checkPrimes=number
	}
	let aux=0;
	ns.print(aux+"%");
	for (let i = 1; i < number / 2 + 1; i++) {
		if (i % 1000000 == 0) {
			await ns.sleep(0)
		}
		if(aux!=parseFloat(i/(number/2+1)*100).toFixed(2)){
			ns.clearLog()
			ns.print(aux+"% primes :"+outputPrim);
			ns.print("divs :" +outputDivs);
			aux=parseFloat(i/(number/2+1)*100).toFixed(2)
		}
		if (number % i == 0) {
			outputDivs.push(i)
			if (checkPrimes>outputPrim.length && await isPrime(ns, i)) {
				outputPrim.push(i)
			}
		}
	}
	if (number > 1) {
		outputDivs.push(number)
		if (checkPrimes && outputPrim.length == 0 && number > 1) {
			outputPrim.push(number)
		}
	}
	return [outputDivs, outputPrim]
}

export async function isPrime(ns, number) {
	for (let i = 2; i < number / 2 + 1; i++) {
		if (i % 10000000 == 0) {
			await ns.sleep(0)
		}
		if (number % i == 0) {
			return false;
		}
	}
	if (number > 1)
		return true;
	else
		return false
}