/**
 * Created by liuliyuan on 2018/11/15.
 */
import {AsyncComponent} from 'compoments'
import strategies from 'config/routingAuthority.config'
const TaxReturnProgressTrackTable = AsyncComponent(() => import("./taxReturnProgressTrackTable"), "纳税申报进度跟踪表")
const ICON_URL_PATH = '/assets/routes_avatar/'
const PATH = `/web/reportManage/progressAnalysis`
const business = strategies['reportManage']['progressAnalysis'];

const progressAnalysis_Routes = [
    {
        path: `${PATH}/taxReturnProgressTrackTable`,
        component: TaxReturnProgressTrackTable,
        name: "纳税申报进度跟踪表",
        icon: {
            url: `${ICON_URL_PATH}taxReturnProgressTrackTable.svg`,
            backgroundColor: "#2E8A57"
        },
        authorityInfo: business["taxReturnProgressTrackTable"].options,
        exact: true
    },
    {
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/generalTaxpayerVATReturn`,
    }
]

export default progressAnalysis_Routes