/**
 * Created by liuliyuan on 2018/5/30.
 */
import React from 'react';
import {Link} from 'react-router-dom'
import Exception from 'compoments/exception';

export default () => (
    <Exception type="403" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />
);