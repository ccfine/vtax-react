/**
 * author       : zhouzhe
 * createTime   : 2018/11/30 12:21
 * description  : 编辑组件
 */

import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { Editor } from 'react-draft-wysiwyg'
import './popModal.less'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

class EditorComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        
    }

    onEditorStateChange = (editorState) => {
        const htmlText = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        this.props.onChange && this.props.onChange(htmlText)
    }

    componentWillReceiveProps(nextProps){
        // if ('value' in nextProps) {
        //     const value = nextProps.value
        //     const blocksFromHtml = htmlToDraft(value)
        //     const { contentBlocks, entityMap } = blocksFromHtml
        //     const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        //     const editorState = EditorState.createWithContent(contentState);
        //     this.setState({editorState})
        // }
    }

    render() {
        let editorProps = {}
        const value = this.props.value
        const blocksFromHtml = htmlToDraft(value)
        const { contentBlocks, entityMap } = blocksFromHtml
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const editorState = EditorState.createWithContent(contentState);
        editorProps.defaultEditorState = editorState;
        return (
            <div className="editor-content">
                <Editor
                    // toolbarClassName="toolbarClassName"
                    wrapperClassName="message-wrapper"
                    editorClassName="message-editor"
                    {...editorProps}
                    toolbar={{
                        // options: ['image'],
                    }}
                    onEditorStateChange={this.onEditorStateChange}
                />
            </div>
        )
    }
}

export default EditorComponent
