/**
 * author       : liuliyuan
 * createTime   : 2017/12/19 15:53
 * description  :
 */
import React, { Component } from 'react'

class EquityRelation extends Component {


    componentDidMount() {

    }

    mounted = true;
    componentWillUnmount(){
        this.mounted = null;
    }

    componentWillReceiveProps(nextProps){

    }

    render() {
        return (
            <div className="basicInfo">
                股权关系
            </div>
        )
    }
}
export default EquityRelation