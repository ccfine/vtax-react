export default {
    password:{
        pattern:/(?![0-9]+$)(?![a-zA-Z]+$)(?!(![0-9A-Za-z])+$)\S{6,32}/,
        message:'请输入6-32位由数字与字母组合的密码'
    },
    companyPhone:{
        pattern:/(^\d{3,4}-?\d{7,8}$)|(^1\d{10}$)/,
        message:'请输入正确的联系电话'
    },
    trim:{
        pattern:/^\S+(\s+\S+)*$/,
        message:'前后不能包含空格'
    }
}