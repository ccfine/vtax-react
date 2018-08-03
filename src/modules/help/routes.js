import {wrapPage} from 'compoments'
import AcountPassword from './acountPassword'
import ContactUs from './contactUs'
import FileCenter from './fileCenter'
import UserProtocal from './userProtocal'
const PATH = `/help`;
const Help_Routes = [
    {
        path:`${PATH}/fileCenter`,
        component:wrapPage('文档中心',FileCenter),
        name:'文档中心',
        exact:true,
    },{
        path:`${PATH}/acountPassword`,
        component:wrapPage('账户密码',AcountPassword),
        name:'账户密码',
        exact:true,
    },{
        path:`${PATH}/userProtocal`,
        component:wrapPage('用户协议',UserProtocal),
        name:'用户协议',
        exact:true,
    },{
        path:`${PATH}/contactUs`,
        component:wrapPage('联系我们',ContactUs),
        name:'联系我们',
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/fileCenter`,

    }
]

export default Help_Routes