/**
 * Created by liuliyuan on 2018/4/17.
 */
import React, { Component } from "react";
import { message,Spin } from "antd";
import { request } from "utils";
import UserDetail from "./UserDetail.react.@0.0.1";

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
    getParams() {
        return this.props.match.params.user.split("-");
    }
    componentDidMount() {
        const [orgId, userId] = this.getParams();
        this.fetchAllPermission();
        this.fetchUserInfo(userId);
        this.fetchPermission(orgId, userId);
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
    fetchPermission(orgid, userid) {
        this.setState({ permissionLoading: true });
        request
            .get(`/sysUser/queryUserPermissions/${orgid}/${userid}`)
            .then(({ data }) => {
                if (data.code === 200) {
                    const permissions = data.data;
                    this.mounted &&
                        this.setState({
                            permissionLoading: false,
                            checkedPermission: [
                                ...permissions.userPermissions,
                                ...permissions.rolePermissions
                            ]
                        });
                } else {
                    this.setState({ permissionLoading: false });
                    message.error(data.msg);
                }
            })
            .catch(err => {
                this.setState({ permissionLoading: false });
                message.error(err.message);
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
        const {
                userInfo,
                checkedPermission,
                allPermission,
                permissionLoading,
                loaded
            } = this.state,
            [orgId] = this.getParams();

        return (
            <Spin spinning={!loaded}>
                <h2 style={{ margin: "10px 0 5px 16px" }}>
                    {userInfo["realname"]}
                </h2>
                {userInfo.id ? (
                    <UserDetail
                        orgId={orgId}
                        userInfo={userInfo}
                        checkedPermission={checkedPermission}
                        allPermission={allPermission}
                        permissionLoading={permissionLoading}
                    />
                ) : null}
            </Spin>
        );
    }
}

export default UserManagementDetail;
