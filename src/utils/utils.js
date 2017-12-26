/**
 * author       : liuliyuan
 * createTime   : 2017/12/16 9:45
 * description  :
 */

const fMoney = (s,n=2)=>{

    if(s === "" || s === 0 || typeof (s) === 'undefined'){
        return '0.00';
    }else{
        n = n > 0 && n <= 20 ? n : 2;
        s = Math.floor(parseFloat((s + "").replace(/[^\d\\.-]/g, "")) * 100 ) /100 + "";
        let l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1] || 0;
        if(r===0 || r.length ===1){
            r+='0';
        }
        let t = "";
        for(let i = 0; i < l.length; i ++ )
        {
            t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + r;
    }
}

const digitUppercase=(n)=> {
    const fraction = ['角', '分'];
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟'],
    ];
    let num = Math.abs(n);
    let s = '';
    fraction.forEach((item, index) => {
        s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '');
    });
    s = s || '整';
    num = Math.floor(num);
    for (let i = 0; i < unit[0].length && num > 0; i += 1) {
        let p = '';
        for (let j = 0; j < unit[1].length && num > 0; j += 1) {
            p = digit[num % 10] + unit[1][j] + p;
            num = Math.floor(num / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }

    return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}

//数组删除的方法
Array.prototype.remove = function(index){
    if(isNaN(index) || index > this.length){
        return false;
    }
    for(let i=0,n=0;i<this.length;i++){
        if(this[i] !== this[index]){
            this[n++] = this[i];
        }
    }
    this.length -= 1;
}


export {
    fMoney,
    digitUppercase
}