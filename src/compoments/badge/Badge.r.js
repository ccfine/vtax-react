/**
 * author       : zhouzhe
 * createTime   : 2018/11/26 12:22
 * description  :
 */
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.less';

class Badge extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    static propTypes={
        text:PropTypes.string,
        style: PropTypes.string,
        bgcolor: PropTypes.string
    }
    static defaultProps={
        
    }
    render() {
        const {text, style, bgcolor} = this.props;
        let re = /^#/;
        const statusCls = classNames({
            [`badge-status-dot`]: true,
            [`badge-status-dot-${bgcolor}`]: re.test(bgcolor) ? false : true,
        });
        const styles = re.test(bgcolor) ? {background: bgcolor} : style;
        return (
            <span>
                <span className={statusCls} style={styles} />
                <span className="badge-status-text">{text}</span>
            </span>
        );
    }
}

export default Badge