import React from 'react'
import {render} from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import App from './App'
import 'moment/locale/zh-cn'
import './index.css'

moment.locale('zh-cn')

render(<LocaleProvider locale={zhCN}><App /></LocaleProvider>, document.getElementById('root'));
registerServiceWorker();
