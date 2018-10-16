/**
 * Created by liuliyuan on 2018/5/12.
 */
import React, {Component} from 'react';
import {Modal, Spin} from 'antd';
import {SearchTable} from 'compoments';
import {fMoney, parseJsonToParams} from 'utils';


const searchFields = [
    {
        label:'SAP凭证号',
        fieldName:'voucherNumSap',
        type:'input',
        span:8,
        componentProps:{ }
    }
]

const columns = [{
    title: '利润中心',
    dataIndex: 'profitCenterName',
    width: 200
}, {
    title: '项目分期',
    dataIndex: 'stagesNum',
    width: 200
}, {
    title: '凭证日期',
    dataIndex: 'voucherDate',
    width: 200
}, {
    title: 'SAP凭证号',
    dataIndex: 'voucherNumSap',
    width: 200
}, {
    title: '凭证摘要',
    dataIndex: 'voucherAbstract',
    width: 200
}, {
    title: '借方科目名称',
    dataIndex: 'debitSubjectName',
    width: 200
}, {
    title: '科目名称',
    dataIndex: 'debitSubjectName',
    render: (text, record) => (text.trim() !== '0' && text.trim()) || record.creditSubjectName,
    width: 150
}, {
    title: '借方科目代码',
    dataIndex: 'debitSubjectCode',
    render: (text, record) => (text.trim() !== '0' && text.trim()) || record.creditSubjectCode,
    width: 150
}, {
    title: '借方金额',
    dataIndex: 'debitAmount',
    render: text => fMoney(text),
    className: "table-money",
    width: 120
}];

export default class ViewDocumentDetails extends Component {
    static defaultProps = {
        visible: true
    };
    state = {
        loaded: true,
        /**
         * params条件，给table用的
         * */
        filters: {},
        /**
         * 控制table刷新，要让table刷新，只要给这个值设置成新值即可
         * */
        tableUpDateKey: Date.now(),
        record: {},
        dataSource: []
    };

    toggleLoaded = loaded => this.setState({loaded});

    // fetchReportByVoucherNum = ({params}) => {
    //     this.toggleLoaded(false);
    //     request.get('/other/tax/deduction/vouchers/list/voucher', {params})
    //     .then(({data}) => {
    //         this.toggleLoaded(true);
    //         if (data.code === 200) {
    //             this.setState({
    //                 record: data.data,
    //                 dataSource: data.data.records,
    //                 tableUpDateKey: Date.now()
    //             });
    //         }
    //     })
    //     .catch(err => {
    //         this.toggleLoaded(true);
    //         message.error(err.message);
    //     });
    // };

    componentWillReceiveProps(nextProps) {
        if (!nextProps.visible) {
            this.setState({
                record: {},
                dataSource: []
            });
        }
        if (this.props.visible !== nextProps.visible && !this.props.visible) {
            /**
             * 弹出的时候如果类型不为新增，则异步请求数据
             * */
            // this.fetchReportByVoucherNum(nextProps);
        }
    }

    render() {
        const props = this.props;
        const {loaded, tableUpDateKey} = this.state;
        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={() => props.toggleViewModalVisible(false)}
                width={900}
                style={{
                    maxWidth: '90%',
                    top: '5%'
                }}
                bodyStyle={{
                    maxHeight: 480,
                    overflowY: 'auto'
                }}
                visible={props.visible}
                footer={null}
                title={props.title}>
                <Spin spinning={!loaded}>
                    <SearchTable
                        searchOption={{
                            fields:searchFields,
                        }}
                        doNotFetchDidMount={false}
                        spinning={false}
                        tableOption={{
                            key:tableUpDateKey,
                            cardProps: {
                                title: "凭证信息列表",
                            },
                            pageSize:100,
                            columns: columns,
                            url:`/other/tax/deduction/vouchers/list/voucher/${this.props.id}?${parseJsonToParams({...props.filters})}`,
                            scroll:{ x: '200%', y: 200},
                        }}
                    />
                </Spin>

            </Modal>
        );
    }
}
