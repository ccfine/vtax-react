/**
 * Created by liuliyuan on 2018/4/17.
 */
import React, { Component } from "react";
import { message,Icon } from "antd";
import { request } from "utils";
import UserDetail from "./UserDetail.react.@0.0.1";
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

class UserManagementDetail extends Component {
    state = {
        userInfo: {},
        checkedPermission: [],
        loaded: false,
        permissionLoading: true,
        allPermission: []
    };

    mounted = true;
    componentWillUnmount() {
        this.mounted = null;
    }
    componentDidMount() {
        const userId = this.props.match.params.id;
        this.fetchAllPermission();
        this.fetchUserInfo(userId);
    }
    fetchAllPermission() {
        this.setState({ permissionLoading: true });
        request
            .get("/permissions")
            .then(({ data }) => {
                if (data.code === 200) {
                    this.setState({
                        allPermission: data.data,
                        permissionLoading: false
                    });
                } else {
                    message.error(data.msg, 4);
                    this.setState({ permissionLoading: false });
                }
            })
            .catch(err => {
                message.error(err.message, 4);
                this.setState({ permissionLoading: false });
            });
    }
    fetchUserInfo(userid) {
        this.setState({
            loaded: false
        });
        request
            .get(`/sysUser/find/${userid}`)
            .then(({ data }) => {
                if (data.code === 200) {
                    const newUserInfo = data.data;
                    this.mounted &&
                        this.setState({
                            userInfo: newUserInfo,
                            loaded: true
                        });
                } else {
                    this.setState({
                        loaded: true
                    });
                    message.error(data.msg);
                }
            })
            .catch(err => {
                this.setState({
                    loaded: true
                });
                message.error(err.message);
            });
    }
    render() {
        const {  location } = this.props;
        const {
                userInfo,
                // checkedPermission,
                allPermission,
                // permissionLoading,
                loaded
            } = this.state;

        return (
            <div>
                <div style={{ margin: "0px 0 6px 6px" }}>
                    <Link
                        style={{fontSize:'12px',color:'rgb(153, 153, 153)',marginRight:12}}
                        to={{
                        pathname: `/web/systemManage/userPermissions/userManage`,
                        state:{
                            ...location.state,
                        }
                    }}>
                        <Icon type="left" /><span>返回</span>
                    </Link>
                </div>
                {
                    <UserDetail
                        orgId={location && location.state && location.state.orgId}
                        userInfo={userInfo}
                        allPermission={allPermission}
                        userLoading = {!loaded}
                    />
                }
            </div>
        );
    }
}

export default withRouter(UserManagementDetail);
