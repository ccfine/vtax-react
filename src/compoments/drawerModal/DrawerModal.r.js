/**
 * Created by liuliyuan on 2018/11/5.
 */
import React,{Component} from 'react'
import {Drawer} from 'antd'
import {SearchTable} from 'compoments'

export default class DrawerModal extends Component{
    state={
        tableKey:Date.now(),
    }
    refreshTable = ()=>{
        this.setState({
            tableKey:Date.now()
        })
    }
    componentWillReceiveProps(nextProps){
        if(!this.props.visible && nextProps.visible){
            //TODO: Modal在第一次弹出的时候不会被初始化，所以需要延迟加载
            setTimeout(()=>{
                this.refreshTable()
            },200)
        }
    }
    render(){
        const { tableKey } = this.state;
        const { title,visible,onClose,drawerOptions,searchTableOptions,children} = this.props;
        return(
        <Drawer
            title={title}
            placement="top"
            //closable={true}
            visible={visible}
            width={'100%'}
            height={'100%'}
            //getContainer={document.getElementsByClassName("ant-layout-content")[0]}
            onClose={()=>onClose(false)}
            maskClosable={false}
            destroyOnClose={true}
            style={{
                height: 'calc(100% - 55px)',
                minHeight: '100vh',

            }}
            {...drawerOptions}
        >
            <div className='oneLine'>
                <SearchTable
                    searchOption={{
                        fields:searchTableOptions.searchOption.fields,
                        ...searchTableOptions.searchOption
                    }}
                    doNotFetchDidMount={searchTableOptions.doNotFetchDidMount || true}
                    spinning={searchTableOptions.searchTableLoading}
                    tableOption={{
                        key: (searchTableOptions.tableOption && searchTableOptions.tableOption.key) || tableKey,
                        ...searchTableOptions.tableOption
                    }}
                    {...searchTableOptions}
                />
                {
                    children ? children : null
                }
            </div>
        </Drawer>
        )
    }
}
