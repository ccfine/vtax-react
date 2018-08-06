import React from 'react'
export default function({ time, children }) {
	return (
		<div>
			{children}
			{time && (
				<span
					style={{ color: 'red', fontSize: '12px', marginLeft: 12 }}>
					数据获取时间：{time}
				</span>
			)}
		</div>
	)
}
