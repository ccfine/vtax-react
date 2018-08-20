/**
 * Created by liuliyuan on 2018/5/9.
 */
import { Component } from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import intersection from 'lodash/intersection'; //取数组的交集 _.initial([1, 2, 3]); => [1, 2]
import difference from 'lodash/difference'; // _.difference([3, 2, 1], [4, 2]);  => [3, 1]

/**
 * 普通组件
 *
 必填：
 RestrictedComponent 是要呈现的组件
 userPermissions 是为当前用户设置的权限数组
 options 是所需权限的数组

 可选：
 oneperm- 布尔值确定只需要其中一个权限而不需要所有通过的权限（默认值）
 true: 一个权限必须匹配
 false: 所有权限必须匹配
 renderOtherwise- 如果权限不匹配，则显示另一个组件（用户不被允许）。
 */
class PermissibleRender extends Component {
    static propTypes = {
        oneperm: PropTypes.bool,
        userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
        //options: PropTypes.arrayOf(PropTypes.string).isRequired,
        children: PropTypes.element.isRequired,
        renderOtherwise: PropTypes.element,
    }

    static defaultProps = {
        oneperm:true,
    }

    checkPermissions() {
        const { userPermissions, options, oneperm } = this.props;

        if (oneperm) {
            return intersection(userPermissions, options).length;
        }

        return difference(options, userPermissions).length === 0;
    }

    render() {
        const { children, userPermissions, options, renderOtherwise } = this.props;

        //TODO：当权限是管理员的时候直接放行  type 只有两种权限 1：普通用户 8192：管理员
        if(parseInt(this.props.type,0) === 8192 ){
            return children;
        }else{
            if (!children || !userPermissions || !options) {
                return null;
            }
            if (this.checkPermissions()) {
                return children;
            } else if (renderOtherwise) {
                return renderOtherwise;
            }
            return null;
        }

    }
}

export default connect(state=>({
    options:state.user.getIn(['personal','options']),
    type:state.user.getIn(['personal','type'])
}))(PermissibleRender)
