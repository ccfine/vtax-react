#Basic Usage
create file and Export data like array.
```js
//example
export default [
    [
        {value:'A1',key:'A1',readOnly:true,rowSpan:2,colSpan:2},
        {value:'A2',key:'A3',readOnly:true},
        {value:'A3',key:'A3',readOnly:true},
    ],
    [
        {value:'B1',key:'B1',readOnly:true},
    ]
]
```
> rowSpan:单元格占用的列高;
colSpan:单元格占用的行宽;
readOnly:单元格是否可编辑(目前只实现查看，全部设置为readOnly:true);
一个数组设置一行