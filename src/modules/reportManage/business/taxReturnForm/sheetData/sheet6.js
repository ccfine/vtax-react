import { generateRows } from './sheetUtils'
export default [
    [
        {value:'固定资产（不含不动产）进项税额抵扣情况表',readOnly:true,colSpan:3}
    ],
    [
        {value:'项目',readOnly:true},
        {value:'当期申报抵扣的固定资产进项税额',readOnly:true},
        {value:'申报抵扣的固定资产进项税额累计',readOnly:true}
    ],
    ...generateRows([
        '增值税专用发票',
        '海关进口增值税专用缴款书',
        '合计'
    ],2,'A')
];