export const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','M','N','P','Q','R','S','T','U','V','W','X','Y','Z'];

// prefix:'A',titles:'XXXX'或['XXX1','XXX2'],colLength:2
export const generateRow = (prefix ,titles, colLength,cellProps)=>{
    let cols = [];
    if(Array.isArray(titles)){
        titles.forEach(title=>{
            cols.push({value:title,readOnly:true})
        })
    }else if(titles){
        cols.push({value:titles,readOnly:true})
    }

    for(let i=0;i<colLength;i++){
        cols.push({key:`${prefix}${i+1}`,...cellProps})
    }
    return cols;
}

// arr:['XXX',['XXX','xxX']] colLength:2 startAlphabet:'B' startIndex:1(在标题后面增加索引)
export const generateRows = (arr,colLength,startAlphabet='A',startIndex=0,cellProps)=>{
    let alphabetStartIndex = alphabet.findIndex(ele=>ele === startAlphabet);
    let rows = [];
    let addIndex = startIndex;
    arr.forEach(titles => {
        let newTitles = [];
        if(Array.isArray(titles)){
            newTitles = [...titles];
        }else if(titles){
            newTitles.push(titles);
        }

        if(startIndex>0){
            newTitles.push(addIndex++);
        }
        rows.push(generateRow(alphabet[alphabetStartIndex++],newTitles,colLength,cellProps))
    });
    return rows;
}