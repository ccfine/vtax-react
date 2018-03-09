"use strict"

let fs = require("fs");
const CHANDAO_ISSUES_URL = 'http://120.76.154.196/zentao/bug-view-'
const text = fs.readFileSync("CHANGELOG.md","utf-8");
const reg = /(https:\/\/github\.com\/Slebee\/vtax\/issues\/)(\d*)/g
const nextStr = text.replace(reg,($1,$2,$3)=>{
    return `${CHANDAO_ISSUES_URL}${$3}.html`
})
fs.writeFile("CHANGELOG.md",nextStr,function(err){
    if(err){
        console.log(err);
    }else{
        console.log("bug链接替换至禅道链接成功！");
    }
})