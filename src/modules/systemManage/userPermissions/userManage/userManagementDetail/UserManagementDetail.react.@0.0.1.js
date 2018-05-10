/**
 * Created by liuliyuan on 2018/4/17.
 */
import React, { Component } from "react";
import { message } from "antd";
import { request } from "utils";
import UserDetail from "./UserDetail.react.@0.0.1";

class UserManagementDetail extends Component {
    state = {
        userInfo: {},
        checkedPermission: [],
        loaded: false
    };

    mounted = true;
    componentWillUnmount() {
        this.mounted = null;
    }
    getParams() {
        return this.props.match.params.user.split("|");
    }
    componentDidMount() {
        const [orgId, userId] = this.getParams();
        this.fetchUserInfo(userId);
        this.fetchPermission(orgId, userId);
    }
    fetchPermission(orgid, userid) {
        request
            .get(`/sysUser/queryUserPermissions/${orgid}/${userid}`)
            .then(({ data }) => {
                if (data.code === 200) {
                    const permissions = data.data;
                    this.mounted &&
                        this.setState({
                            checkedPermission: [
                                ...permissions.userPermissions,
                                ...permissions.rolePermissions
                            ]
                        });
                } else {
                    message.error(data.msg);
                }
            })
            .catch(err => {
                message.error(err);
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
                    message.error(data.msg);
                }
            })
            .catch(err => {
                message.error(err);
            });
    }
    render() {
        const { userInfo, checkedPermission } = this.state,
            [orgId] = this.getParams();

        return (
            <div>
                <h2 style={{ margin: "10px 0 5px 16px" }}>
                    {userInfo["realname"]}
                </h2>
                {userInfo.id ? (
                    <UserDetail
                        orgId={orgId}
                        fetchUserInfo={this.fetchUserInfo.bind(this)}
                        userInfo={userInfo}
                        checkedPermission={checkedPermission}
                    />
                ) : null}
            </div>
        );
    }
}

export default UserManagementDetail;
