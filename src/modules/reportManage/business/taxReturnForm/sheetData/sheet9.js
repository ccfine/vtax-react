import {generateRows} from './sheetUtils'
export default [
    [
        {value:'营改增税负分析测算明细表',readOnly:true,colSpan:18},
    ],
    [
        {value:'项目及栏次',readOnly:true,rowSpan:3,colSpan:4},
        {value:'增值税',readOnly:true,colSpan:7},
        {value:'营业税',readOnly:true,colSpan:7}
    ],
    [
        {value:'不含税销售额',readOnly:true,rowSpan:2},
        {value:'销项(应纳)税额',readOnly:true,rowSpan:2},
        {value:'价税合计',readOnly:true,rowSpan:2},
        {value:'服务、不动产和无形资产扣除项目本期实际扣除金额',readOnly:true,rowSpan:2},
        {value:'扣除后',readOnly:true,colSpan:2},
        {value:'增值税应纳税额（测算）',readOnly:true,rowSpan:2},
        {value:'原营业税税制下服务、不动产和无形资产差额扣除项目',readOnly:true,colSpan:5},
        {value:'应税营业额',readOnly:true,rowSpan:2},
        {value:'营业税应纳税额',readOnly:true,rowSpan:2}
    ],
    [
        {value:'含税销售额',readOnly:true},
        {value:'销项(应纳)税额',readOnly:true},
        {value:'期初余额',readOnly:true},
        {value:'本期发生额',readOnly:true},
        {value:'本期应扣除金额',readOnly:true},
        {value:'本期实际扣除金额',readOnly:true},
        {value:'期末余额',readOnly:true}
    ],
    [
        {value:'计税方法',readOnly:true},
        {value:'应税项目代码及名称',readOnly:true},
        {value:'增值税税率或征收率',readOnly:true},
        {value:'营业税税率',readOnly:true},
        {value:'1',readOnly:true},
        {value:'2=1×增值税税率或征收率',readOnly:true},
        {value:'3=1+2',readOnly:true},
        {value:'4',readOnly:true},
        {value:'5=3-4',readOnly:true},
        {value:'6=5÷(100%+增值税税率或征收率)×增值税税率或征收率',readOnly:true},
        {value:'7',readOnly:true},
        {value:'8',readOnly:true},
        {value:'9',readOnly:true},
        {value:'10=8+9',readOnly:true},
        {value:'11（11≤3且11≤10）',readOnly:true},
        {value:'12=10-11',readOnly:true},
        {value:'13=3-11',readOnly:true},
        {value:'14=13×营业税税率',readOnly:true},
    ],
    ...generateRows(['一般计税','简易计税','合计'],17,'A')
];