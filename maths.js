export var primesLog = [];

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL')
	//ns.tail()
	if (ns.fileExists("primes.txt")) {
		let aux = ns.read("primes.txt")
		if (aux.includes(',')) {
			primesLog = aux.split(',').map(Number)
		}
	}
	let number; let operation;
	if (ns.args[0] == null || typeof (ns.args[0]) == "number") {
		if (ns.args[0] == null)
			number = parseInt(Math.random() * 100000);
		else
			number = ns.args[0];
		let output = await divisible(ns, number, true);
		ns.alert("Divisibles: " + output[0])
		ns.alert(`Primes between 1 and ${number}: ${output[1]}`)
		ns.write("primes.txt", primesLog, 'w');
	} else if (ns.args[0] == "ulam") {
		if( ns.args[1]==null){
			for (let i = 0; i < 1000; i++) {
				await ulam(ns, 130,i)
				await ns.sleep(100)
			}
		}else
			await ulam(ns, ns.args[1],ns.args[2])
	} else {
		operation = ns.args[0];
		ns.tprint(operation)
		operation = resolve(ns, operation);
		ns.tprint(operation);
	}
	//number = parseInt(number)

	/*let arrays = await divisible(ns, number, true)
	let divs = arrays[0];
	let primes = arrays[1];
	ns.tprint("divisibles " + divs)
	ns.tprint("primes " + primes)*/
}

/** @param {NS} ns **/
export function resolve(ns, string = "") {
	let startParentheses = null; let startBrackets = null; let startBraces = null; let start = null;
	startParentheses = string.lastIndexOf('(')
	if (startParentheses == -1) {
		startBrackets = string.lastIndexOf('[')
		if (startBrackets == -1) {
			startBraces = string.lastIndexOf('{')
			if (startBraces == -1) {
				start = string.lastIndexOf('+');
			} else { start = startBraces }
		} else { start = startBrackets }
	} else { start = startParentheses }

	let array = string.split("");
	//ns.tprint(array);
	for (let i = start; i < array.length; i++) {
		ns.print(array[i])
		if (startParentheses !== -1) {
			if (array[i] == ')') {
				string = string.slice(0, startParentheses) + ' ' + resolve2(ns, string.slice(startParentheses + 1, i)) + ' ' + string.slice(i + 1, string.length);
				ns.tprint(string);
				return resolve(ns, string);
			} else if (array[i] == '[' || array[i] == ']' || array[i] == '{' || array[i] == '}') {
				return "error in grouping symbols, " + array[i] + " at " + i + " position"
			}
		} else if (startBrackets !== -1) {
			if (array[i] == ']') {
				string = string.slice(0, startBrackets) + ' ' + resolve2(ns, string.slice(startBrackets + 1, i)) + ' ' + string.slice(i + 1, string.length);
				ns.tprint(string);
				return resolve(ns, string);
			} else if (array[i] == '{' || array[i] == '}') {
				return "error in grouping symbols, " + array[i] + " at " + i + " position"
			}
		} else if (startBraces !== -1 && array[i] == '}') {
			string = string.slice(0, startBraces) + ' ' + resolve2(ns, string.slice(startBraces + 1, i)) + ' ' + string.slice(i + 1, string.length);
			ns.tprint(string);
			return resolve(ns, string);
		} else if (array[start] == '+') {
			return resolve2(ns, string.slice(start + 1));
		}
	}
	return "solved"
}

/** @param {NS} ns **/
export function resolve2(ns, string = "") {
	let array = string.split("");
	let pow = string.lastIndexOf('^')
	let output;
	ns.tprint(string)
	if (pow !== -1) {
		let first = 0; let last = array.length - 1;
		for (let i = pow + 1; i < array.length; i++) {
			if (isNaN(array[i])) {
				last = i - 1
			}
		}
		for (let i = pow - 1; i > 0; i--) {
			if (isNaN(array[i])) {
				first = i + 1
			}
		}
		ns.tprint(array[first])
		ns.tprint(array[last])
		let base = string.slice(first, pow - 1);
		let exp = string.slice(pow + 1, last);
		ns.tprint(base)
		ns.tprint(exp)
		output = Math.pow(base, exp);
		if (output < 0)
			output = '(' + output + ')'
		return string.slice(0, first - 1) + output + string.slice(last + 1)
	}
	return string;
}

/** @param {NS} ns **/
export async function divisible(ns, number, checkPrimes = false) {
	let outputDivs = [];
	let outputPrim = [];
	let string = "";
	//ns.alert("imprimiendo en aproximadamente " + parseFloat(number / 2 / 10000000 / 4.2).toFixed(2) + " segundos")
	let aux = 0;
	ns.print(aux + "%");
	for (let i = 1; i < number; i++) {
		if (i % 100000 == 0) {
			await ns.sleep(0)
		}
		if (string != `${aux}% - ${outputPrim.length} primes and ${outputDivs.length} divisibles`) {
			ns.clearLog()
			ns.print(string);
		}
		aux = parseFloat(i / (number / 2 + 1) * 100).toFixed(2)
		string = `${aux}% - ${outputPrim.length} primes and ${outputDivs.length} divisibles`
		if (number % i == 0) {
			outputDivs.push(i)
		}
		if (checkPrimes) {
			if (await isPrime(ns, i))
				outputPrim.push(i)
		} else {
			if (i > number / 2)
				break;
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

/** @param {NS} ns **/
export async function isPrime(ns, number) {
	let skip = false;
	let maxPrime; let start = 3;
	let leng = primesLog.length;
	if (leng > 0) {
		//ns.tprint(primesLog)
		maxPrime = primesLog[leng - 1]
		if (maxPrime >= number)
			skip = primesLog.includes(number)
	}
	if (skip)
		return true;
	if (number % 2 == 0)
		return false;
	let fin = Math.sqrt(number)
	for (let i = start; i < fin; i += 2) {
		if (i % 100000 == 0)
			await ns.sleep(0)
		if (number % i == 0)
			return false;
	}
	if (number > 1) {
		primesLog.push(number)
		return true;
	}
	else
		return false
}

/** @param {NS} ns **/
export async function ulam(ns, size, start = 0) {
	let block = '█▌';
	let space = '  ';
	let output = "";
	var steps = 1+start;
	let flip = 1;
	var itineration = 1;
	ns.clearLog()
	if (size % 2 == 0)
		size++;
	let x = Math.floor(size / 2); let y = Math.floor(size / 2);
	//let aux;
	let matrix = new Array(size)
	for (let y = 0; y < matrix.length; y++) {
		matrix[y] = new Array(size).fill(0)
	}
	matrix[y][x] = await isPrime(ns,steps)?block:space;
	while (steps-start < size * size) {
		for (let h = 0; h < itineration; h++) {
			steps++;
			if (steps-start > size * size)
				break;
			x += flip;
			matrix[y][x] =await isPrime(ns,steps)?block:space;
			//ns.print(x+" "+y+" "+await isPrime(ns,steps));
		}
		flip = (-flip);
		for (let h = 0; h < itineration; h++) {
			steps++;
			if (steps-start > size * size)
				break;
			y += flip;
			matrix[y][x] =await isPrime(ns,steps)?block:space;
			//ns.print(x+" "+y+" "+await isPrime(ns,steps));
		}
		itineration++;
	}
	ns.print("");
	for (let y = 0; y < matrix.length; y++) {
		for (let x = 0; x < matrix[y].length; x++) 
			output+=matrix[y][x]
		ns.tprint(output);output=""
	}
}