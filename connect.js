const emulateTerminalAction = (input) => {
    const terminalEl = eval('document').querySelector("#terminal-input");
    const propsKey = Object.keys(terminalEl)[1];

    terminalEl[propsKey].onChange({ target: { value: input } });
    terminalEl[propsKey].onKeyDown({ keyCode: 13, preventDefault: () => { } });
}

/** @param {NS} ns **/
const scanNode = (ns, node, target, scanedServers) => {
    let servers = ns.scan(node).filter((server) => !scanedServers.includes(server));
    scanedServers.push(...servers);

    if (servers.includes(target)) return `connect ${target}`;

    for (let server of servers) {
        const path = scanNode(ns, server, target, scanedServers);
        if (path) return `connect ${server}; ${path}`
    }

    return '';
};

/** @param {NS} ns **/
export async function main(ns) {
    const [target] = ns.args;

    if (!target) {
        ns.toast('Target to connect not provided!', "error", 10000)
        return;
    }

    let scanedServers = [];
    const path = scanNode(ns, ns.getHostname(), target, scanedServers)

    if (path) {
        emulateTerminalAction(path);
        //emulateTerminalAction('clear');
    }
    else {
        ns.toast('Path Not Found', "error", 10000)
    }

}