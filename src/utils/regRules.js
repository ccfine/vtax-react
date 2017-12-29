/**
 * Created by liurunbin on 2017/9/27.
 */



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
    },
    email:{
        pattern:/^([_a-z0-9]|[.]|[-])+@(([_a-z0-9]|[-])+\.)+[a-z0-9]+$/i,
        message:'非法电子邮件地址'
    },
    postcode:{
        pattern:/^(\d{6})$/,
        message:'非法邮政编码'
    },
    mobile_phone:{
        pattern:/^1[3578](\d{9})$/,
        message:'非法手机号码'
    },
    phone_with_area_code:{
        pattern:/^[0-9]{3,4}-[0-9]{3,11}(-[0-9]{0,}){0,1}$/,
        message:'号码中区号应为3位或4位数字，之后为分隔线-，电话号码为3-11位的数字，最后可跟分机号，电话号码和分机号之间也需要有-分隔，如021-50801155-1004'
    },
    phone_without_area_code:{
        pattern:/^[1-9]{1}[0-9]{2,10}$/,
        message:'电话号码应为3-11位的数字，需以非零开头'
    },
    integer:{
        pattern:/^[-]{0,1}[1-9]+[0-9]{0,}$|^[0]{1,1}$/,
        message:'必须输入整数'
    },
    positive_integer:{
        pattern:/^[1-9]+[0-9]{0,}$/,
        message:'必须输入正整数'
    },
    nonnegative_integer:{
        pattern:/^[1-9]+[0-9]{0,}$|^[0]{1,1}$/,
        message:'必须输入非负整数'
    },
    negative_integer:{
        pattern:/^-[1-9]+[0-9]{0,}$/,
        message:'必须输入负整数'
    },
    http_url:{
        pattern:/^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i,
        message:'需要以http://或https://开头'
    },
    number:{
        pattern:/^[-]{0,1}[1-9]+[0-9]{0,}$|^[-]{0,1}[1-9]+[0-9]{0,}[.][0-9]+$|^[-]{0,1}[0]{0,1}[.][0-9]+$|^[0]{1,1}$/,
        message:'必须输入数字'
    },
    nonnegative_number:{
        pattern:/^[1-9]+[0-9]{0,}$|^[1-9]+[0-9]{0,}[.][0-9]+$|^[0]{0,1}[.][0-9]+$|^[0]{1,1}$/,
        message:'必须输入非负数字'
    },
    positive_number:{
        pattern:/^[1-9]+[0-9]{0,}$|^[1-9]+[0-9]{0,}[.][0-9]+$|^[0]{0,1}[\][0-9]+$/,
        message:'必须输入正数字'
    },
    decimal:{
        pattern:/^[-]{0,1}[0]{0,1}[.][0-9]+$/,
        message:'必须输入小数'
    },
    label:{
        pattern:/^[a-z]{1}([a-z0-9]|[_])+$/i,
        message:'仅包含字母数字和下划线，需要以字母开头'
    },
    string:{
        pattern:/^([a-z0-9]|[_])+$/i,
        message:'英文字符串必须仅由字母、数字和下划线组成'
    },
    chinese_string:{
        pattern:/^([a-z0-9]|[_]|[\u4E00-\u9FA5])+$/i,
        message:'中文字符串仅包含中文，英文字母数字和下划线'
    },
    not_chinese_string:{
        pattern:/^[^\u4E00-\u9FA5]*$/i,
        message:'包含非法的中文字符串'
    },
    not_chinese:{
        pattern:/^[^\u4e00-\u9fa5]{0,}$/,
        message:'不能输入汉字'
    },
    ip_address:{
        pattern:/^([0-9]|[1-9][0-9]|[1][0-9]{2}|[2][0-4][0-9]|25[0-5])([.]([0-9]|[1-9][0-9]|[1][0-9]{2}|[2][0-4][0-9]|25[0-5])){3}$/,
        message:'非法的IP地址'
    },
    text:{
        pattern:/^([\w]|[\W])*$/i,
        message:'非法的字符串'
    },
    mac:{
        pattern:/^[0-9a-f]{2}([:][0-9a-f]{2}){5}$|^[0-9a-f]{2}([-][0-9a-f]{2}){5}$/i,
        message:'非法的MAC地址'
    },
    input_lenght:{
        max:50,
        message:'不能超过50个字符'
    },
    textarea_lenght:{
        max:2000,
        message:'不能超过2000个字符'
    },
    input_length_20:{
        max:20,
        message:'不能超过20个字符'
    },
}