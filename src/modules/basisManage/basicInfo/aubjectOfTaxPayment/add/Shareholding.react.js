/**
 * author       : liuliyuan
 * createTime   : 2017/12/19 15:52
 * description  :
 */
import React, { Component } from 'react'

class Shareholding extends Component {


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
                股东持股
            </div>
        )
    }
}
export default Shareholding