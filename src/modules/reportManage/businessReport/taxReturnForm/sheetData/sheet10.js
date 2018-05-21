import {generateRows} from './sheetUtils'
export default [
    [
        {value:'增值税预缴税款表',readOnly:true,colSpan:6},
    ],
    [
        {value:'预征项目和栏次',readOnly:true,rowSpan:2,colSpan:2},
        {value:'销售额',readOnly:true},
        {value:'扣除金额',readOnly:true},
        {value:'预征率',readOnly:true},
        {value:'预征税额',readOnly:true}
    ],[
        {value:'1',readOnly:true},
        {value:'2',readOnly:true},
        {value:'3',readOnly:true},
        {value:'4',readOnly:true}
    ],
    ...generateRows(['建筑服务','销售不动产','出租不动产','合计'],4,'A',1)
];