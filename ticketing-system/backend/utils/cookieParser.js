function getCookies(cookies) {

    const cookie = {}

    if (!cookies) return cookie;


    cookies.split(';').forEach(element => {
        let [name, value = ""] = element.split('=');

        name = name.trim();
        value = value.trim();

        if (name) {
            cookie[name] = value;
        }
    });
    
    return cookie;
}

module.exports = getCookies;