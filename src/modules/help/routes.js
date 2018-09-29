import {AsyncComponent} from 'compoments'

const FileCenter = AsyncComponent(() => import('./fileCenter'), '文档中心');
const AcountPassword = AsyncComponent(() => import('./acountPassword'), '账户密码');
const UserProtocal = AsyncComponent(() => import('./userProtocal'), '用户协议');
const ContactUs = AsyncComponent(() => import('./contactUs'), '联系我们');

const PATH = `/help`;
const Help_Routes = [
    {
        path:`${PATH}/fileCenter`,
        component: FileCenter,
        name:'文档中心',
        exact:true,
    },{
        path:`${PATH}/acountPassword`,
        component: AcountPassword,
        name:'账户密码',
        exact:true,
    },{
        path:`${PATH}/userProtocal`,
        component: UserProtocal,
        name:'用户协议',
        exact:true,
    },{
        path:`${PATH}/contactUs`,
        component: ContactUs,
        name:'联系我们',
        exact:true,
    },{
        path:`${PATH}`,
        redirect:true,
        to:`${PATH}/fileCenter`,

    }
]

export default Help_Routes