/**
 * author       : liuliyuan
 * createTime   : 2017/12/19 15:52
 * description  :
 */
import React, { Component } from 'react'
import {Row} from 'antd'
import {getFields} from 'utils'
import './styles.less'

class TaxIdentification extends Component {

    render() {
        const {defaultData} = this.props;
        const list= [
            {
                label:'流转税',
                fieldName: 'szjd.lzs',
                initialValue:defaultData && defaultData.lzs,
                data:[
                    {
                        label: '增值税',
                        value: 'zzs',
                    },{
                        label: '消费税',
                        value: 'xfs',
                        disabled: true,
                    }
                    ]
            },{
            label:'所得税',
            fieldName: 'szjd.sds',
            initialValue:defaultData && defaultData.sds,
            data:[
                {
                    label: '企业所得税',
                    value: 'qysds',
                },{
                    label: '个人所得税',
                    value: 'grsds',
                    disabled: true,
                },
                ]
        },{
            label:'财产税',
            fieldName: 'szjd.ccs',
            initialValue:defaultData && defaultData.ccs,
            data:[
                {
                    label: '房产税',
                    value: 'fcs',
                    disabled: true,
                },{
                    label: '车船税',
                    value: 'ccs',
                    disabled: true,
                },{
                    label: '契税',
                    value: 'qs',
                    disabled: true,
                },
                ]
        },{
            label:'行为税',
            fieldName: 'szjd.xws',
            initialValue:defaultData && defaultData.xws,
            data:[
                {
                    label: '印花税',
                    value: 'yhs',
                    disabled: true,
                },{
                    label: '车辆购置税',
                    value: 'clgzs',
                    disabled: true,
                },{
                    label: '城市维护建设税',
                    value: 'cswhjss',
                    disabled: true,
                },
                ]
        },{
            label:'资源税',
            fieldName: 'szjd.zys',
            initialValue:defaultData && defaultData.zys,
            data:[
                {
                    label: '资源税',
                    value: 'zys',
                    disabled: true,
                },{
                    label: '土地增值税',
                    value: 'tdzzs',
                    disabled: true,
                },{
                    label: '耕地占用税',
                    value: 'gdzys',
                    disabled: true,
                },{
                    label: '矿区使用税',
                    value: 'kqsys',
                    disabled: true,
                },{
                    label: '城镇土地使用税',
                    value: 'cztdsys',
                    disabled: true,
                },
                ]
        },{
            label:'其他税费',
            fieldName: 'szjd.qtsf',
            initialValue:defaultData && defaultData.qtsf,
            data:[
                {
                    label: '教育费附加',
                    value: 'jyffj',
                    disabled: true,
                },{
                    label: '地方教育费附加',
                    value: 'dfjyffj',
                    disabled: true,
                },{
                    label: '堤围防护费',
                    value: 'dwfhf',
                    disabled: true,
                },{
                    label: '水利基金',
                    value: 'sljj',
                    disabled: true,
                },{
                    label: '价格调节基金',
                    value: 'jgtjjj',
                    disabled: true,
                },{
                    label: '残疾人保障金',
                    value: 'cjrbzj',
                    disabled: true,
                }
            ]
        }
            ]

        return (
            <div className="basicInfo" style={{height:'390px',overflow:'hidden',overflowY:'scroll'}}>
                {
                    list.map((item,i)=>{
                        return (
                            <Row key={i}>
                                {
                                    getFields(this.props.form,[
                                        {
                                            label:item.label,
                                            fieldName:item.fieldName,
                                            type:'checkboxGroup',
                                            span:24,
                                            formItemStyle:{
                                                labelCol:{
                                                    span:3
                                                },
                                                wrapperCol:{
                                                    span:21
                                                },
                                                className:'vTax-CheckboxGroup',
                                            },
                                            options:item.data,
                                            componentProps:{
                                                disabled:item.disibled
                                            },
                                            fieldDecoratorOptions:{
                                                initialValue:item.initialValue,
                                            }
                                        }

                                    ])
                                }
                            </Row>
                        )
                    })
                }

            </div>
        )
    }
}
export default TaxIdentification