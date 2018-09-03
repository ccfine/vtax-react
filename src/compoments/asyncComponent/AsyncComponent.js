/**
 * author       : zhouzhe
 * createTime   : 2018/08/31 16:37
 * description  : react路由懒加载组件
 */
import React, { Component } from 'react';

export default (importComponent, title) => {
    class AsyncComponent extends Component {
        constructor(props) {
            super(props);
            this.state = {
                'mod': null
            };
        }
    
        async componentWillMount() {
            const {default: mod} = await importComponent();
            document.title = title;
            this.setState({
                mod: mod.default || mod
            });
        }
    
        render() {
            const C = this.state.mod;
            return C ? <C {...this.props} /> : null;
        }
    }

    return AsyncComponent;
}