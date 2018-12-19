/**
 * author       : zhouzhe
 * createTime   : 2018/12/18 23:37
 * description  : 新编辑组件
 */

import React, { Component } from 'react'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import './popModal.less'

class NewEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editorState: BraftEditor.createEditorState(null),
            controls: [
                'undo', 'redo', 'separator',
                'text-color', 'bold', 'italic', 'underline', 'separator',
                'fullscreen',
            ]
        }
    }

    componentDidMount() {
        
    }

    handleEditorChange = (editorState) => {
        this.setState({ editorState })
        const htmlString = editorState.toHTML()
        this.props.onChange && this.props.onChange(htmlString)
    }

    // 获取纯文本内容
    getTextString = () => {
        const { editorState } = this.state;
        return editorState.toText();
    }

    preview = () => {

        if (window.previewWindow) {
            window.previewWindow.close()
        }

        window.previewWindow = window.open()
        window.previewWindow.document.write(this.buildPreviewHtml())
        window.previewWindow.document.close()

    }

    buildPreviewHtml () {
        return `
          <!Doctype html>
          <html>
            <head>
              <title>预览公告内容</title>
              <style>
                html,body{
                  height: 100%;
                  margin: 0;
                  padding: 0;
                  overflow: auto;
                  background-color: #f0f2f5;
                }
                .container{
                    box-sizing: border-box;
                    width: 1000px;
                    max-width: 100%;
                    min-height: 100%;
                    margin: 0 auto;
                    padding: 30px 20px;
                    overflow: hidden;
                    background-color: #fff;
                    border-right: solid 1px #eee;
                    border-left: solid 1px #eee;
                }
                .container img,
                .container audio,
                .container video{
                  max-width: 100%;
                  height: auto;
                }
                .container p{
                  white-space: pre-wrap;
                  min-height: 1em;
                }
                .container pre{
                  padding: 15px;
                  background-color: #f1f1f1;
                  border-radius: 5px;
                }
                .container blockquote{
                  margin: 0;
                  padding: 15px;
                  background-color: #f1f1f1;
                  border-left: 3px solid #d1d1d1;
                }
              </style>
            </head>
            <body>
              <div class="container">${this.state.editorState.toHTML()}</div>
            </body>
          </html>
        `
    
    }

    handleFullscreen = (bol) => {
        const isFullTrue = [
            'undo', 'redo', 'separator',
            'font-size', 'line-height', 'letter-spacing', 'separator',
            'text-color', 'bold', 'italic', 'underline', 'separator',
            'text-indent', 'text-align', 'separator',
            'headings', 'separator',
            'hr', 'separator',
            'clear', 'separator',
            'fullscreen',
        ];
        const isFullFalsh = [
            'undo', 'redo', 'separator',
            'text-color', 'bold', 'italic', 'underline', 'separator',
            'fullscreen',
        ]
        this.setState({controls: bol ? isFullTrue : isFullFalsh})
    }

    render() {
        const { value } = this.props;
        const { controls } = this.state;
        const extendControls = [
            {
                key: 'custom-button',
                type: 'button',
                text: '预览',
                onClick: this.preview
            }
        ]
        const editorState = BraftEditor.createEditorState(value)
        return (
            <BraftEditor
                className="my-editor"
                defaultValue={editorState}
                controls={controls}
                extendControls={extendControls}
                onChange={this.handleEditorChange}
                onFullscreen={this.handleFullscreen}
                placeholder="请输入公告内容"
            />
        )
    }
}

export default NewEditor
