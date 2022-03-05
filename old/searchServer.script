//Uses a DFS to find the path to the specified server and then prints the path
//to Terminal.

//The target server's HOSTNAME must be a string passed in as an argument to the script.
//It is CASE-SENSITIVE.
//If an invalid hostname is passed the script will probably just run forever.

target = args[0];

visited = [];
stack = [];
parentTracker = [];
origin = getHostname();
stack.push(origin);

while(stack.length > 0) {
    node = stack.pop();
    print("DFS processing server " + node);
    if (visited.includes(node)) {
        //Do nothing. Essentially a "continue" but that doesn't exist yet
    } else {
        if (node == target) {break;}
        visited.push(node);
        nextNodes = scan(node);
        for (i = 0; i < nextNodes.length; ++i) {
            stack.push(nextNodes[i]);

            //Keep track of the nodes "parent" so we can re-create the path
            //Ignore entries that start at the origin
            if (nextNodes[i] != origin) {
                pair = [nextNodes[i], node];
                parentTracker.push(pair);
            }
        }
    }
}

print("Target found. About to re-create path");
print("parentTracker size: " + parentTracker.length);
path = [];
i = target;
while (i != getHostname()) {
    path.push(i);
    print("Re-creating path at " + i);

    //Search through the parentTracker array to find this nodes parent
    for (j = 0; j < parentTracker.length; ++j) {
        pair = parentTracker[j];
        if (pair[0] == i) {
            i = pair[1];
            break;
        }
    }
}

path.reverse();
tprint(path);