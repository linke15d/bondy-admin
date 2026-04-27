const TokenKey = "mtoken";

export function getToken() {
    // return Cookies.get(TokenKey)
    return localStorage.getItem(TokenKey);
}

export function setToken(token) {
    // return Cookies.set(TokenKey, token)
    return localStorage.setItem(TokenKey, token);
}

export function removeToken() {
    // return Cookies.remove(TokenKey)
    return localStorage.removeItem(TokenKey);
}

export function getStorage(key) {
    // return Cookies.get(key)
    return localStorage.getItem(key);
}

export function setStorage(key, value) {
    // return Cookies.set(key, value)
    return localStorage.setItem(key, value);
}

export function removeStorage(key) {
    // return Cookies.remove(key)
    return localStorage.removeItem(key);
}

export function clearStorage(){
    return localStorage.clear()
}

export function removeSession(key){
    window.sessionStorage.removeItem(key);
}