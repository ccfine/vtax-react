/**
 * Created by liurunbin on 2018/1/24.
 */
import React from 'react'
import {Input, Icon} from 'antd';
export default class EditableCell extends React.Component {
    state = {
        editable: false,
    }
    handleChange = (e) => {
    }
    check = () => {
        //this.setState({ editable: false });

    }
    edit = () => {
        this.setState({ editable: true });
    }
    render() {
        const { value } = this.state;
        const {editAble,getFieldDecorator,fieldName} = this.props;
        return (
            <div className="editable-cell">
                {
                    editAble ?
                        <div className="editable-cell-input-wrapper">
                            {
                                getFieldDecorator(`${fieldName}`)(
                                    <Input
                                        onChange={this.handleChange}
                                    />
                                )
                            }
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            {value || ' '}
                            <Icon
                                type="edit"
                                className="editable-cell-icon"
                                onClick={this.edit}
                            />
                        </div>
                }
            </div>
        );
    }
}