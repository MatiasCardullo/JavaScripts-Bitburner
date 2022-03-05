/** @param {NS} ns **/
export function main(ns){
    ns.tprint(mp3ToBase64(ns,ns.args[0]))
    //ns.write("test.txt",,"w")
}

/** @param {NS} ns **/
export function mp3ToBase64(ns,audioFile) {
    var file = ns.read(audioFile)
    //ns.print(file)
    return btoa(unescape(encodeURIComponent(file)))
}

/** @param {NS} ns **/
export function urlToBase64(url) {
  const getBase64 = async (url) => {
    try {
        var result =  await  axios
            .get(url, {
                responseType: 'arraybuffer'
            })
            .then(response =>  new Buffer.from(response.data, 'binary').toString('base64'))


        return { data: result}
    }catch (e) {
        return {error: e};
    }
}
}