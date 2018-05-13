/*
 * @Author: liuchunxiu 
 * @Date: 2018-05-10 18:48:38 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-11 14:10:04
 */

const one = [
    {
        title: "数据采集",
        options: [
            {
                num: "JXFPPP",
                name: "财务凭证采集",
                status: 0
            },
            {
                num: "JXFPCJ",
                name: "房间交易档案采集",
                status: 0
            },
            {
                num: "JXSEMXTZ",
                name: "发票采集",
                status: 0
            },
            {
                num: "JXSEJGTZ",
                name: "营业收入采集",
                status: 0
            }
        ]
    },
    {
        title: "数据处理",
        options: [
            {
                num: "QTYWJXSEZCTZ",
                name: "销项发票采集",
                status: 1
            }
        ]
    },
    {
        title: "生成台账",
        options: [
            {
                num: "QTYWJXSEZCTZ",
                name: "开票销售台账",
                status: 1
            },
            {
                num: "QTYWJXSEZCTZ",
                name: "未开票销售台账",
                status: 1
            },
            {
                num: "QTYWJXSEZCTZ",
                name: "其它涉税调整台账",
                status: 2
            }
        ]
    }
];

const two = [
    {
        title: "数据采集",
        options: [
            {
                num: "JXFPPP",
                name: "进项发票采集",
                status: 2
            },
            {
                num: "JXFPCJ",
                name: "财务进项税明细",
                status: 0
            }
        ]
    },
    {
        title: "生成台账",
        options: [
            {
                num: "QTYWJXSEZCTZ",
                name: "进项税额明细台账",
                status: 1
            },
            {
                num: "QTYWJXSEZCTZ",
                name: "简易计税进项税额转出台账",
                status: 0
            },
            {
                num: "QTYWJXSEZCTZ",
                name: "不动产进项税额抵扣台账",
                status: 0
            },
            {
                num: "QTYWJXSEZCTZ",
                name: "固定资产进项税台账",
                status: 0
            },
            {
                num: "QTYWJXSEZCTZ",
                name: "其他业务进项税额转出台账",
                status: 2
            }
        ]
    }
];

const three = [
    {
        title: "数据采集",
        options: [
            {
                num: "JXFPPP",
                name: "土地价款管理",
                status: 1
            }
        ]
    },
    {
        title: "生成台账",
        options: [
            {
                num: "QTYWJXSEZCTZ",
                name: "土地价款扣除明细台账",
                status: 1
            },
            {
                num: "QTYWJXSEZCTZ",
                name: "预缴税款台账",
                status: 1
            },
            {
                num: "QTYWJXSEZCTZ",
                name: "减免税明细台账",
                status: 2
            },
            {
                num: "QTYWJXSEZCTZ",
                name: "其他应税项目扣除台账",
                status: 0
            }
        ]
    }
];

const four = [
    {
        title: "生成台账",
        options: [
            {
                num: "QTYWJXSEZCTZ",
                name: "税款计算台账",
                status: 1
            }
        ]
    }
];

const five = [
    {
        title: "生成台账",
        options: [
            {
                num: "JXFPPP",
                name: "纳税申报表",
                status: 1
            }
        ]
    }
];

const data = [one, two, three, four, five];
export default data;
