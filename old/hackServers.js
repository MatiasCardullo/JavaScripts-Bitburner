/** @param {NS} ns
 ***/
function collect_server_names(ns) {
    let fromServers = ['home'];
    let checkedServers = [];
    let serverConnections = new Map();

    for (let i = 0; i < 10000; i++) { // 'infinite' loop
        if (fromServers.length == 0) {
            break;
        }

        let server = fromServers.pop();
        checkedServers.push(server);

        serverConnections.set(server, []);

        for (let conServer of ns.scan(server)) {
            if (conServer == ".") { continue; }

            serverConnections.get(server).push(conServer);

            if (!checkedServers.includes(conServer)) {
                fromServers.push(conServer);
            }
        }
    }

    checkedServers.shift(); // remove home
    return [checkedServers, serverConnections];
}

/** 
 * @param {string} targetServer
 * @param {Map<string, string[]>} serverCons
 * **/
function find_path_to_home(targetServer, serverCons) {
    let path = [];
    let target = targetServer;

    // check every value for targetServer, store the key
    for (let i = 0; i < 100; i++) { // 'infinite' loop
        if (target == 'home') {
            break;
        }

        find_keys: {
            for (let server of serverCons.keys()) {
                let serversToSearch = serverCons.get(server);

                if (serversToSearch.includes(target)) {
                    if (!path.includes(server)) {
                        path.unshift(server);
                        target = server;
                    }
                    break find_keys;
                }
            }
        }
    }

    return path;
}


/** @param {NS} ns **/
export async function main(ns) {
    // Collect all the servers recursively
    let [servers, serverCons] = collect_server_names(ns);

    // Sort them by `hackAnalyzeChance`
    servers.sort((a, b) => ns.hackAnalyzeChance(a) - ns.hackAnalyzeChance(b));

    // Open their ports + nuke them
    servers.forEach((s) => {
        ns.brutessh(s);
        ns.httpworm(s);
        ns.ftpcrack(s);
        ns.relaysmtp(s);

        if (ns.getServerNumPortsRequired(s) <= 4) {
            ns.nuke(s);
        }
        else { ns.tprint(`Can't nuke: ${s}`); }
    });

    // Backdoor
    // servers.forEach((s) => {
    //     if (ns.hasRootAccess(s)) {
    //         // Connect to each server
    //         let path = find_path_to_home(s, serverCons);

    //         for (let server of path) {
    //             ns.connect(server);
    //         }

    //         await ns.installBackdoor();

    //         ns.connect("home");
    //     }
    // });
}