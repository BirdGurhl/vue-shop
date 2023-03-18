const checkEmailReg = (rule, value, callback) => {
    const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    if (reg.test(value)) {
        return callback()
    }
    callback(new Error('邮箱不合法'));
}
const checkPhoneReg = (rule, value, callback) => {
    const re = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/
    if (re.test(value)) {
        return callback()
    }
    callback(new Error('手机号码不合法'));
}

export const checkName = [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
]

export const checkPassword = [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
]
export const checkPhone = [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { validator: checkPhoneReg, trigger: 'blur' }
]
export const checkEmail = [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validator: checkEmailReg, trigger: 'blur' }
]
export const checkroleName = [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
]
export const checkroleDesc = [
    { required: true, message: '请输入角色描述', trigger: 'blur' },

]
export const checkcat_name = [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
]

