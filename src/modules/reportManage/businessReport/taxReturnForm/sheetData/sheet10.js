import { generateRows } from './sheetUtils'
export default [
	[{ value: '增值税预缴税款表', readOnly: true, colSpan: 6 }],
	[
		{ value: '预征项目和栏次', readOnly: true, rowSpan: 2, colSpan: 2 },
		{ value: '销售额', readOnly: true },
		{ value: '扣除金额', readOnly: true },
		{ value: '预征率', readOnly: true },
		{ value: '预征税额', readOnly: true }
	],
	[
		{ value: '1', readOnly: true },
		{ value: '2', readOnly: true },
		{ value: '3', readOnly: true },
		{ value: '4', readOnly: true }
	],
	[
		{ value: '建筑服务', readOnly: true },
		{ value: 1, readOnly: true },
		{ key: 'A1', value: '--', readOnly: true },
		{ key: 'A2', value: '--', readOnly: true },
		{ key: 'A3', value: '--', readOnly: true ,type:'rate'},
		{ key: 'A4', value: '--', readOnly: true }
	],
	[
		{ value: '销售不动产', readOnly: true },
		{ value: 2, readOnly: true },
		{ key: 'B1', value: '--', readOnly: true },
		{ key: 'B2', value: '--', readOnly: true },
		{ key: 'B3', value: '--', readOnly: true ,type:'rate'},
		{ key: 'B4', value: '--', readOnly: true }
	],
	[
		{ value: '出租不动产', readOnly: true },
		{ value: 3, readOnly: true },
		{ key: 'C1', value: '--', readOnly: true },
		{ key: 'C2', value: '--', readOnly: true },
		{ key: 'C3', value: '--', readOnly: true ,type:'rate'},
		{ key: 'C4', value: '--', readOnly: true }
	],
	[
		{ value: '合计', readOnly: true },
		{ value: 4, readOnly: true },
		{ key: 'D1', value: '--', readOnly: true },
		{ key: 'D2', value: '--', readOnly: true },
		{ key: 'D3', value: '--', readOnly: true ,type:'rate'},
		{ key: 'D4', value: '--', readOnly: true }
	]
]

