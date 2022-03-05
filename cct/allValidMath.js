/** @param {NS} ns **/
export async function main(ns) {
    function getExprUtil(res, curExp, input, target, pos, curVal, last) {
        // true if whole input is processed with some
        // operators
        if (pos == input.length) {
            // if current value is equal to target
            //then only add to final solution
            // if question is : all possible o/p then just
            //push_back without condition
            if (curVal == target)
                res.push(curExp);
            return;
        }

        // loop to put operator at all positions
        for (let i = pos; i < input.length; i++) {
            // ignoring case which start with 0 as they
            // are useless for evaluation
            if (i != pos && input[pos] == '0')
                break;

            // take part of input from pos to i
            let part = input.substr(pos, i + 1 - pos);

            // take numeric value of part
            let cur = parseInt(part, 10);

            // if pos is 0 then just send numeric value
            // for next recursion
            if (pos == 0)
                getExprUtil(res, curExp + part, input, target, i + 1, cur, cur);
            // try all given binary operator for evaluation
            else {
                getExprUtil(res, curExp + "+" + part, input, target, i + 1, curVal + cur, cur);
                getExprUtil(res, curExp + "-" + part, input, target, i + 1, curVal - cur, -cur);
                getExprUtil(res, curExp + "*" + part, input, target, i + 1, curVal - last + last * cur, last * cur);
            }
        }
    }

    // Below method returns all possible expression
    // evaluating to target
    function getExprs(input, target) {
        let res = [];
        getExprUtil(res, "", input, target, 0, 0, 0);
        return res;
    }

    let input = ns.args[0].toString();
    let target = ns.args[1];
    let res = getExprs(input, target);
    ns.tprint(res);
}