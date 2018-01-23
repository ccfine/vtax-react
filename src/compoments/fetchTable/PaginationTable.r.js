import React from 'react'
import {Pagination,Spin} from 'antd'
import CountTable from './CountTable.r'

export default (props)=>{
    return <Spin spinning={props.loading}>
                <CountTable 
                            size='small'
                            {...props} 
                            pagination={false}
                            loading={false}
                            />
                {props.pagination && <Pagination showSizeChanger={true}
                            showQuickJumper={true}
                            defaultCurrent={1} 
                            hideOnSinglePage={true} 
                            pageSize={10} 
                            showTotal={total => `总共 ${total} 条`}
                            pageSizeOptions={['10','20','30','40','50','60','70','80','90','100']}
                            {...props.pagination}
                            size={props.size?props.size:'small'}
                            // total={500} 
                            // current={3}
                            // onChange={(page, pageSize)=>{}}
                            // onShowSizeChange={(current, size)=>{}}
                            className='ant-table-pagination'
                            />
                }
            </Spin>
}