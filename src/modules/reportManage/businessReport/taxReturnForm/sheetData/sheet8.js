import {generateRows,alphabet} from './sheetUtils'
export const sheet_8 = [
    [
        {value:'增值税减免税申报明细表',readOnly:true,colSpan:7}
    ],
    [
        {value:'一、减税项目',readOnly:true,colSpan:7}
    ],
    [
        {value:'减税性质代码及名称',readOnly:true,rowSpan:2},
        {value:'栏次',readOnly:true,rowSpan:2},
        {value:'期初余额',readOnly:true},
        {value:'本期发生额',readOnly:true},
        {value:'本期应抵减税额',readOnly:true},
        {value:'本期实际抵减税额',readOnly:true},
        {value:'期末余额',readOnly:true}
    ],
    [
        {value:'1',readOnly:true},
        {value:'2',readOnly:true},
        {value:'3=1+2',readOnly:true},
        {value:'4≤3',readOnly:true},
        {value:'5=3-4',readOnly:true}
    ],
    ...generateRows([[],[],[]],7,'A'),
    [
        {value:'二、免税项目',readOnly:true,colSpan:7}
    ],
    [
        {value:'免税性质代码及名称',readOnly:true,rowSpan:2},
        {value:'栏次',readOnly:true,rowSpan:2},
        {value:'免征增值税项目销售额',readOnly:true},
        {value:'免税销售额扣除项目本期实际扣除金额',readOnly:true},
        {value:'扣除后免税销售额',readOnly:true},
        {value:'免税销售额对应的进项税额',readOnly:true},
        {value:'免税额',readOnly:true}
    ],
    [
        {value:'1',readOnly:true},
        {value:'2',readOnly:true},
        {value:'3=1-2',readOnly:true},
        {value:'4',readOnly:true},
        {value:'5',readOnly:true}
    ],
    ...generateRows([[],[],[]],7,'D'),
];


export const composeGrid_8 = (grid,data)=>{
    let freeLength = data['free'].value, /* 免税项目长度 */
        reduceLength = data['reduce'].value,/* 减税项目长度 */
        reduceStart = 'A', /* 减税开始下标 */
        freeStart = alphabet[reduceLength],/* 免税开始下标 */
        freeParam = [],reduceParam=[]; /* 减税，免税的参数 */

    /* 为了迎合之前的生成行的方法，生成等量的空数组作为行数标志 */
    for(let i =0;i<freeLength;i++)freeParam.push([]);
    for(let i =0;i<reduceLength;i++)reduceParam.push([]);
    let freeRows = generateRows(freeParam,7,freeStart),
        reduceRows = generateRows(reduceParam,7,reduceStart);
    
    /* 将新的grid拼凑出来 */
    let newGrid = [];
    newGrid = [sheet_8[0],sheet_8[1],sheet_8[2],sheet_8[3],...reduceRows,
                sheet_8[7],sheet_8[8],sheet_8[9],...freeRows];
    
    /* 调用润彬的方法生成最终显示需要的grid */
    newGrid = dataReander(newGrid,data);

    return newGrid;
}

/* 润彬的数据填充方法 -- 来自 Sheet */
function dataReander(prevGrid,asyncData){
    let nextData = [
        ...prevGrid
    ];
    const sheetData = asyncData;
    return nextData.map( item =>{
        return item.map( deepItem =>{
            for(let key in sheetData){
                if(deepItem.key === key){
                    return sheetData[key];
                }
            }
            return deepItem;
        });
    });
}