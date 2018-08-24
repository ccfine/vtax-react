// Created by liuliyuan on 2018/8/23
/**
 * 两种校验token过期的设置
 */

/*import moment from 'moment';
const parseJwt = (token) =>{
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
    // return JSON.parse(decodeURIComponent(escape($window.atob(base64))));
}
const jwt = parseJwt(request.getToken());
let d = new Date(0); // The 0 here is the key, which sets the date to the epoch
d.setUTCSeconds(jwt.exp);
if(!moment(d).isBefore(moment(), 'seconds')){}*/


// token解析
const urlBase64Decode=(str)=>  {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
        case 0: { break; }
        case 2: { output += '=='; break; }
        case 3: { output += '='; break; }
        default:{
            console.log('非法base64url字符串!')
            //throw '非法base64url字符串!';
        }
    }
    return decodeURIComponent(escape(window.atob(output))); //polifyll https://github.com/davidchambers/Base64.js
}
const decodeToken=(token)=>  {
    let parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('JWT必须有3个部分');
    }
    let decoded = urlBase64Decode(parts[1]);
    if (!decoded) {
        throw new Error('无法解码令牌n');
    }
    return JSON.parse(decoded);
}
const getTokenExpirationDate=(token)=>  {
    let decoded;
    decoded = decodeToken(token);
    if(typeof decoded.exp === "undefined") {
        return null;
    }
    let d = new Date(0); // The 0 here is the key, which sets the date to the epoch
    d.setUTCSeconds(decoded.exp);
    return d;
};
const isTokenExpired=(token, offsetSeconds)=>{
    let d = getTokenExpirationDate(token);
    offsetSeconds = offsetSeconds || 0;
    if (d === null) {
        return false;
    }
    // Token expired?
    return (d.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
};

export default isTokenExpired