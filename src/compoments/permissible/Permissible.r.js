/**
 * Created by liuliyuan on 2018/5/9.
 */
import React,{Component} from 'react'
import PropTypes from 'prop-types';
import intersection from 'lodash/intersection';
import difference from 'lodash/difference';

/**
 * 普通组件
 *
     必填：
         RestrictedComponent是要呈现的组件
         userPermissions是为当前用户设置的权限数组
         requiredPermissions是所需权限的数组

     可选：
         oneperm- 布尔值确定只需要其中一个权限而不需要所有通过的权限（默认值）
            true: 一个权限必须匹配
            false: 所有权限必须匹配
         renderOtherwise- 如果权限不匹配，则显示另一个组件（用户不被允许）。
 */

export function Permissible(
    RestrictedComponent,
    userPermissions,
    requiredPermissions,
    callbackFunction,
    oneperm,
) {
    const permissionsStatus = oneperm
        ? intersection(userPermissions, requiredPermissions).length
        : difference(requiredPermissions, userPermissions).length === 0;

    class PermissibleHOC extends Component {
        static propTypes = {
            oneperm: PropTypes.bool,
            history: PropTypes.object, // eslint-disable-line react/forbid-prop-types
        };

        componentWillMount() {
            if (!permissionsStatus) {
                this.runCallback();
            }
        }

        runCallback() {
            if (callbackFunction) {
                return callbackFunction({
                        userPermissions,
                        requiredPermissions,
                    },
                    this.props.history);
            }
            return;
        }

        render() {
            if (permissionsStatus) {
                return <RestrictedComponent {...this.props}/>;
            }
            return null;
        }
    }
    return PermissibleHOC;
}