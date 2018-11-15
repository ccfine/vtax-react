/**
 * author       : chenfeng
 * createTime   : 2017/10/29 14:41
*/

import React, { Component } from "react"
import PropTypes from "prop-types"
import { Dropdown, Button, Icon, Menu } from "antd"
import { request, parseJsonToParams } from "utils"

export default class FileDownload extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    menu: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })),
    disabled: PropTypes.bool,
    setButtonStyle: PropTypes.object,
  }

  render () {
    const { title, disabled, setButtonStyle } = this.props;
    const menu = (
      <Menu>
        {
          this.props.menu.map((item, index) => {
              const url = item['url'].charAt(0) === "/" ?  item['url'].substr(1) : item['url'];
              return (
                  <Menu.Item key={ index }>
                    <a target="_blank" href={`${window.baseURL}${url}?${parseJsonToParams({Authorization:request.getToken(),_t: Date.parse(new Date())/1000,})}`}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>{ item.title }<Icon type="download" style={{ marginLeft: "5px" }} /></div>
                    </a>
                  </Menu.Item>
              )
          })
        }
      </Menu>
    )
    return (
      <Dropdown overlay={ menu } disabled={ disabled }>
          <Button style={{ ...setButtonStyle }} size="small"><Icon type="download" />{ title }</Button>
      </Dropdown> 
    )
  }
}