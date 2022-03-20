/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL')
	let number = 0; let operation;
	switch (typeof (ns.args[0])) {
		case 'number':
			//while (true) {
				let time = new Date().getTime();
				number = parseFloat(ns.args[0]);
				let output = await divisible(ns, number, true);
				ns.tprint(new Date().getTime() - time)
			//}
			ns.alert("Divisibles: " + output[0])
			ns.alert(`Primes between 1 and ${number}: ${output[1]}`)
			ns.alert("Happy Number: " + isHappy(ns, number))

			break;
		case 'string':
			switch (ns.args[0]) {
				case "ulam":
					if (ns.args[1] == null)
						for (let i = 0; i < 1000; i++) {
							ns.tprint(await ulam(ns, 130, i))
							await ns.sleep(200)
						}
					else
						ns.tprint(await ulam(ns, ns.args[1], ns.args[2]))
					break;
				case "prime":
					ns.tprint(await isPrime(ns, ns.args[1]))
					break;
				case "happy":
					ns.tprint(isHappy(ns.args[1]))
					break;
				case "factorial":
					ns.tprint(factorial(ns.args[1]))
					break;
				case "factorion":
					ns.tprint(isFactorion(ns.args[1]))
					break;
				case "leyland":
					ns.tprint(isLeyland(ns.args[1]))
					break;
				case "leyland2":
					ns.tprint(isLeyland(ns.args[1], true))
					break;
				case "resolve":
					operation = ns.args[1];
					ns.tprint(operation)
					operation = resolve(ns, operation);
					ns.tprint(operation);
					break;
				default:
					ns.tprint(ns.args[0] + '?')
					break;
			}
			break;
	}
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
		//ns.print(array[i])
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
	let negative = false
	//let symbols = ['^', '√', '*', '/']
	let pow = array.indexOf('^')
	let output;
	//ns.tprint(array)
	if (pow !== -1) {
		let first = 0; let last = array.length - 1;
		for (let i = pow + 1; i < array.length; i++) {
			if (isNaN(array[i])) {
				if (array[i] == '-' && pow + 1 == i) {
					//negative = true;
					continue;
				}
				last = i
				break;
			}
			//ns.tprint('i'+array[i])
		}
		ns.tprint(string.slice(pow + 1, last))
		let exp = parseInt(string.slice(pow + 1, last));
		/*if (negative){
			exp = 0 - exp
			negative = false;
		}*/
		for (let i = pow - 1; i > 0; i--) {
			if (isNaN(array[i])) {
				first = i + 1
				if (array[i] == '-') {
					first--;
					negative = true;
				}
				break;
			}
			//ns.tprint('i'+array[i])
		}
		ns.tprint(string.slice(first, pow))
		let base = parseInt(string.slice(first, pow));
		ns.tprint(exp)
		ns.tprint(base)
		output = Math.pow(base, exp);
		if (output < 0)
			output = '(' + output + ')'
		return string.slice(0, first) + output + string.slice(last)
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
	for (let i = 1; i <= number; i++) {
		if (i % 1000000 == 0) {
			await ns.sleep(0)
		}
		string = `${aux}% - ${outputPrim.length} primes and ${outputDivs.length} divisibles`
		if (number % i == 0 && i != number) {
			outputDivs.push(i)
		}
		if (checkPrimes) {
			aux = parseFloat(i / number * 100).toFixed(2)
			if (await isPrime(ns, i))
				outputPrim.push(i)
		} else {
			aux = parseFloat(i / (number / 2 + 1) * 100).toFixed(2)
			if (i > number / 2)
				break;
		}
		if (string != `${aux}% - ${outputPrim.length} primes and ${outputDivs.length} divisibles`) {
			ns.clearLog()
			ns.print(string);
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
export async function isPrime(ns, input) {
	if (input % 2 == 0 || input % 5 == 0)
		return false;
	let fin = Math.sqrt(input)
	for (let i = 3; i < fin; i+=2) {
		if(input % i == 0)
			return false;
		if(i % 1000001 == 0)
			await ns.sleep(0)
	}
	if (input > 1) {
		return true;
	}
	return false
}

/** @param {NS} ns **/
export async function ulam(ns, size, start = 0, func = isPrime) {
	//https://en.wikipedia.org/wiki/Ulam_spiral
	let block = '█▌';
	let space = '  ';
	let output = "";
	var steps = 1 + start;
	let flip = 1;
	var itineration = 1;
	if (size % 2 == 0)
		size++;
	let x = Math.floor(size / 2); let y = Math.floor(size / 2);
	//let aux;
	let matrix = new Array(size)
	for (let y = 0; y < matrix.length; y++) {
		matrix[y] = new Array(size).fill(0)
	}
	matrix[y][x] = await func(ns, steps) ? block : space;
	while (steps - start < size * size) {
		for (let h = 0; h < itineration; h++) {
			steps++;
			if (steps - start > size * size)
				break;
			x += flip;
			matrix[y][x] = await func(ns, steps) ? block : space;
			//ns.print(x+" "+y+" "+await isPrime(ns,steps));
		}
		flip = (-flip);
		for (let h = 0; h < itineration; h++) {
			steps++;
			if (steps - start > size * size)
				break;
			y += flip;
			matrix[y][x] = await func(ns, steps) ? block : space;
			//ns.print(x+" "+y+" "+await isPrime(ns,steps));
		}
		itineration++;
	}
	for (let y = 0; y < matrix.length; y++) {
		output += "\n";
		for (let x = 0; x < matrix[y].length; x++)
			output += matrix[y][x]
	}
	return output;
}

/** @param {NS} ns **/
export function isHappy(input) {
	//https://en.wikipedia.org/wiki/Happy_number
	let nums = [];
	let number = 0;
	let string = input.toString()
	nums.push(input)
	while (true) {
		for (let h = 0; h < string.length; h++) {
			number += Math.pow(parseInt(string[h]), 2)
		}
		if (number === 1) {
			return true;
		} else {
			if (nums.includes(number))
				return false;
			nums.push(number)
			string = number.toString()
			number = 0
		}
	}
}

export function factorial(input) {
	let number = null
	if (input >= 0) {
		number = 1;
		for (let i = parseInt(input); i > 0; i--) {
			number *= i;
		}
	}
	return number
}

export function isFactorion(input) {
	let number = 0;
	let string = input.toString();
	for (let i = 0; i < string.length; i++) {
		number += factorial(string[i]);
	}
	return number == parseInt(input)
}

export function isLeyland(input, second = false) {
	if (input >= 0) {
		for (let y = 2; y < input; y++) {
			for (let x = y; x < input; x++) {
				if (!second && Math.pow(x, y) + Math.pow(y, x) == input) {
					return true;
				} else if (second && Math.pow(x, y) - Math.pow(y, x) == input) {
					return true;
				}
			}
		}
		return false
	}
}