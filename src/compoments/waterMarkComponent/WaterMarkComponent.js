/*
 * @Author: zhouzhe 
 * @Date: 2018-10-15 11:22:01 
 * @Description: '显示水印高阶组件' 
 * @Last Modified by: zhouzhe
 * @Last Modified time: 2018-10-27 15:17:33
 */
import React, { Component } from 'react';
import watermark from 'utils/WaterMark';
import moment from 'moment';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux'

export default (WrappedComponent, Element) => {
    class WaterComponent extends Component {
        constructor(props) {
            super(props);
            this.state = {};
        }

        componentDidMount() {
            const { isAuthed, realName, username } = this.props;
            if (isAuthed) {
                let el = document.querySelectorAll('.water_mark');
                if (Element) {
                    let water_mark = el[0].querySelectorAll(`.${Element}`)[0];
                    water_mark.style.position = 'relative';
                    watermark({ Element: water_mark, watermark_txt:`${realName},${username},${moment().format('YYYY-MM-DD HH:mm')}`});
                    return;
                }
                for (let index = 0; index < el.length; index++) {
                    const water_mark = el[index];
                    watermark({ Element: water_mark, watermark_txt:`${realName},${username},${moment().format('YYYY-MM-DD HH:mm')}`});
                }
            }
        }
        
        render() {
            return (
                <div className="water_mark" style={{position: "relative"}}>
                    <WrappedComponent {...this.props} />
                </div>
            );
        }
    }

    return withRouter(connect(state=>({
        isAuthed:state.user.get('isAuthed'),
        realName:state.user.getIn(['personal','realname']),
        username:state.user.getIn(['personal','username']),
    }))(WaterComponent))
}