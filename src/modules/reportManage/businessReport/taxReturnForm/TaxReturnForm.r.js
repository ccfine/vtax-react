/**
 * Created by liurunbin on 2018/1/29.
 */
import React,{Component} from 'react'
import 'react-datasheet/lib/react-datasheet.css';
import { Tabs } from 'antd';
import sheet_1 from './sheetData/sheet1'
import sheet_3 from './sheetData/sheet3'
import sheet_4 from './sheetData/sheet4'
import sheet_7 from './sheetData/sheet7'
import sheet_8 from './sheetData/sheet8'
import sheet_9 from './sheetData/sheet9'
import sheet_10 from './sheetData/sheet10'
import SheetWithSearchFields from './SheetWithSearchFields.r'
const TabPane = Tabs.TabPane;

const sheetData = [
    {
        tab:'附表一',
        grid:sheet_1,
        url:'s'
    },
    {
        tab:'增值税纳税申报表附列资料（二）',
        grid:sheet_3,
        url:'/tax/decConduct/fixedAssets/list'
    },
    {
        tab:'增值税纳税申报表附列资料（三）',
        grid:sheet_4,
        url:'/tax/decConduct/fixedAssets/list'
    },
    {
        tab:'固定资产（不含不动产）进项税额抵扣情况表',
        grid:sheet_7,
        url:'/tax/decConduct/fixedAssets/list'
    },
    {
        tab:'本期抵扣进项税额结构明细表',
        grid:sheet_8,
        url:'/tax/decConduct/fixedAssets/list'
    },
    {
        tab:'增值税减免税申报明细表',
        grid:sheet_9,
        url:'/tax/decConduct/fixedAssets/list'
    },
    {
        tab:'营改增税负分析测算明细表',
        grid:sheet_10,
        url:'s'
    }
]
class TaxReturnForm extends Component{
    state={
        activeKey:'0'
    }
    onChange = activeKey =>{
        this.setState({activeKey})
    }
    render () {
        const {activeKey} = this.state;
        return (
            <Tabs tabBarStyle={{marginBottom:0}} onChange={this.onChange} activeKey={activeKey} type="card">
                {
                    sheetData.map((item,i)=>(
                        <TabPane tab={item.tab} key={i}>
                            {
                                parseInt(activeKey,0) === i ? <SheetWithSearchFields {...item} /> : ''
                            }

                        </TabPane>
                    ))
                }
            </Tabs>
        )
    }
}

export default TaxReturnForm

