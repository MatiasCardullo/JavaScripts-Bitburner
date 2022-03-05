/** @param {NS} ns **/
export async function main(ns) {
	let triangle = ns.args[0];
    //[[5], [3,9], [6,7,4],[2,6,8,3],[7,2,6,3,6],[1,6,8,3,9,4],[8,8,2,5,5,7,5],[7,9,8,9,6,2,7,4],[1,2,7,3,1,3,1,4,7],[7,5,7,1,3,3,8,3,2,2]]
	// Util function to find
	// minimum sum for a path
	function minSumPath()
	{
		
		// For storing the result
		// in a 1-D array, and
		// simultaneously updating
		// the result.
		let memo = [];
		let n = triangle.length - 1;
	
		// For the bottom row
		for(let i = 0; i < triangle[n].length; i++)
			memo[i] = triangle[n][i];
	
		// Calculation of the
		// remaining rows, in
		// bottom up manner.
		for(let i = triangle.length - 2; i >= 0; i--)
			for(let j = 0;
					j < triangle[i].length; j++)
				memo[j] = triangle[i][j] +
						Math.min(memo[j],
								memo[j + 1]);
	
		// Return the
		// top element
		return memo[0];
	}
	
	// Driver code
	ns.tprint(minSumPath());
}