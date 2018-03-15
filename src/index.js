/**
 * babel polyfill
 * */
import "core-js/fn/array/find-index"
import "core-js/fn/array/find"
import "core-js/fn/string/starts-with"
import "core-js/fn/number/is-nan"
import "core-js/fn/number/parse-float"

import React from 'react'
import {render} from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import App from './App'
import './index.css'

moment.locale('zh-cn')

render(<LocaleProvider locale={zhCN}><App /></LocaleProvider>, document.getElementById('root'));
registerServiceWorker();
