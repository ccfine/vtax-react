/**
 * Created by liuliyuan on 2018/11/5.
 */
import {AsyncComponent} from 'compoments'

const LoginLog = AsyncComponent(() => import("./loginLog"), "登陆日志")
const TaskResume = AsyncComponent(() => import("./taskResume"), "任务履历")
const DataResume = AsyncComponent(() => import("./dataResume"), "数据履历")

const ICON_URL_PATH = '/assets/routes_avatar/';
const PATHS = '/web/systemManage/interfaceLog';

const InterfaceLog_Routes = [
    {
        path:`${PATHS}/loginLog`,
        component:LoginLog,
        name:'登陆日志',
        icon:{
            url:`${ICON_URL_PATH}loginLog.svg`,
            backgroundColor:'#56C7F3'
        },
        exact:true,
    },{
        path:`${PATHS}/taskResume`,
        component:TaskResume,
        name:'任务履历',
        icon:{
            url:`${ICON_URL_PATH}taskResume.svg`,
            backgroundColor:'#6CCCCA'
        },
        exact:true,
    },{
        path:`${PATHS}/dataResume`,
        component:DataResume,
        name:'数据履历',
        icon:{
            url:`${ICON_URL_PATH}dataResume.svg`,
            backgroundColor:'#6CCCCA'
        },
        exact:true,
    },{
        path:`${PATHS}`,
        redirect:true,
        to:`${PATHS}/taxReturnsCustom`,
    }
]
export default InterfaceLog_Routes