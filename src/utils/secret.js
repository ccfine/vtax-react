/**
 * Created by liuliyuan on 2018/11/9.
 */
import CryptoJS from 'crypto-js'//引用AES源码js
import { Base64 } from 'js-base64';
import md5 from 'blueimp-md5'

const key = CryptoJS.enc.Utf8.parse("1234123412ABCDEF");  //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');   //十六位十六进制数作为密钥偏移量


//加密方法
function EncryptAES(word) {
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
}

//解密方法
function DecryptAES(word) {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}
//console.log(EncryptAES('123456'))
//console.log(DecryptAES(Encrypt('123456')))


//DES加密 Pkcs7填充方式
function EncryptByDES(message, key){

    const keyHex = CryptoJS.enc.Utf8.parse(key);

    const encrypted = CryptoJS.DES.encrypt(message, keyHex, {

        mode: CryptoJS.mode.ECB,

        padding: CryptoJS.pad.Pkcs7

    });

    return encrypted.toString();

}

//DES解密
function DecryptByDES(ciphertext, key){

    const keyHex = CryptoJS.enc.Utf8.parse(key);

    // direct decrypt ciphertext

    const decrypted = CryptoJS.DES.decrypt({

        ciphertext: CryptoJS.enc.Base64.parse(ciphertext)

    }, keyHex, {

        mode: CryptoJS.mode.ECB,

        padding: CryptoJS.pad.Pkcs7

    });

    return decrypted.toString(CryptoJS.enc.Utf8);

}
const _key =  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
const _password = Base64.encode(md5('liuliyuan'))
const password = '888888'
//加密
console.log(EncryptByDES(password,_key))
//解密
console.log(DecryptByDES(EncryptByDES(password,_key),_key))

//加密
console.log(EncryptByDES(_password,_key))
//解密
console.log(DecryptByDES(EncryptByDES(_password,_key),_key))

const encrypteds = CryptoJS.DES.encrypt(_password, "Secret Passphrase").toString();
const decrypteds = CryptoJS.DES.decrypt(encrypteds, "Secret Passphrase").toString(CryptoJS.enc.Utf8);

console.log(encrypteds)
console.log(decrypteds)


export {
    DecryptAES,
    EncryptAES,
    EncryptByDES,
    DecryptByDES
}