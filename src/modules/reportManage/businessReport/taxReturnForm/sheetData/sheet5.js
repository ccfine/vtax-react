import {BigNumber} from 'bignumber.js'

const numericReg = new RegExp(`^(0|[1-9][0-9]{0,17})(\\.[0-9]{0,2})?$`);

export default [
    [
        {value:'增值税纳税申报表附列资料（五）',readOnly:true,colSpan:6}
    ],
    [
        {value:'（不动产分期抵扣计算表）',readOnly:true,colSpan:6}
    ],
    [
        { value: '期初待抵扣不动产进项税额', readOnly: true },
        { value: '本期不动产进项税额增加额', readOnly: true },
        { value: '本期可抵扣不动产进项税额', readOnly: true },
        { value: '本期转入的待抵扣不动产进项税额', readOnly: true },
        { value: '本期转出的待抵扣不动产进项税额', readOnly: true },
        { value: '期末待抵扣不动产进项税额', readOnly: true },
    ],
    [
        { value: '1', readOnly: true },
        { value: '2', readOnly: true },
        { value: '3≤1+2+4', readOnly: true},
        { value: '4', readOnly: true},
        { value: '5≤1+4', readOnly: true},
        { value:'6=1+2-3+4-5',readOnly:true}
    ],[
        { key: 'A1', value:'--', readOnly: true },
        { key: 'A2', value:'--', readOnly: true },
        { key: 'A3', value:'--', readOnly: true},
        { key: 'A4', value:'--', readOnly: true},
        { key: 'A5', value:'', readOnly: false,onChange:(oldValue,nextValue,grid,params)=>{
            //5≤1+4
            let a1 = grid[4][0].value,
                a4 = grid[4][3].value;
            let nonValid = !(numericReg.test(nextValue) && numericReg.test(a1) && numericReg.test(a4));
                nonValid = nonValid || (new BigNumber(nextValue)).isGreaterThan((new BigNumber(a1).plus(a4)));
            
            if(nonValid){
                return oldValue;
            }else{
                return nextValue;
            }
        }},
        { key: 'A6', value:'--', readOnly:true}
    ]
];