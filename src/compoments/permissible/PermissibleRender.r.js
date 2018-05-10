/**
 * Created by liuliyuan on 2018/5/9.
 */
import { Component } from 'react';
import PropTypes from 'prop-types';
import intersection from 'lodash/intersection'; //取出各数组中全等的元素，使用SameValueZero方式平等比较。
import difference from 'lodash/difference'; //只要array中比[values]中多出的值，都会返回，不管个数出现了几次

/**
 * 普通组件
 *
 必填：
 userPermissions是为当前用户设置的权限数组
 requiredPermissions是所需权限的数组
 RestrictedComponent 是要呈现的组件

 可选：
 oneperm - 只需要一个必需的权限（布尔）
 renderOtherwise - 如果权限不匹配，则显示另一个组件（用户不被允许）。
 */
export class PermissibleRender extends Component {
    static propTypes = {
        oneperm: PropTypes.bool,
        userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
        requiredPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
        children: PropTypes.element.isRequired,
        renderOtherwise: PropTypes.element,
    }

    checkPermissions() {
        const { userPermissions, requiredPermissions, oneperm } = this.props;

        if (oneperm) {
            return intersection(userPermissions, requiredPermissions).length;
        }

        return difference(requiredPermissions, userPermissions).length === 0;
    }

    render() {
        const { children, userPermissions, requiredPermissions, renderOtherwise } = this.props;

        if (!children || !userPermissions || !requiredPermissions) {
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
