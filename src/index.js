import React from 'react'
import {render} from 'react-dom'
import { unregister } from './registerServiceWorker';
import App from './App'
import './index.css'

render(<App />, document.getElementById('root'));
unregister();
