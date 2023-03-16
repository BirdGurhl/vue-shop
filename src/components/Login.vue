<template>
    <div class='login-container'>
        <div class="form-box">
            <div class="image-box">
                <img src="../assets/logo.png" alt="">
            </div>
            <el-form :model="loginForm" :rules="rules" ref="loginForm">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入账号" prefix-icon="el-icon-user-solid"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" placeholder="请输入密码" prefix-icon="el-icon-lock"
                        show-password @keyup.enter.native="login"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login">提交</el-button>
                    <el-button type="info" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { login } from '@/api/api';
export default {
    name: 'Login',
    data() {
        return {
            loginForm: {
                username: '',
                password: '',
            },
            rules: {
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 115, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {},
    components: {},
    created() { },
    mounted() { },
    methods: {
        resetForm() {
            this.$refs.loginForm.resetFields()
        },
        login() {
            this.$refs.loginForm.validate(async valid => {
                if (!valid) return

                const res = await login(this.loginForm)
                if (res.meta.status !== 200) {
                    return
                }
                this.$message.success('登录成功!')
                window.sessionStorage.setItem('token',res.data.token)
                this.$router.push('/home')
            })

        }
    }
}
</script>
<style lang='less' scoped>
.login-container {
    height: 100%;
    background-color: rgb(18, 103, 103);

    .form-box {
        background-color: white;
        width: 500px;
        height: 300px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 2px 2px 2px gray;

        .image-box {
            width: 80px;
            height: 80px;
            padding: 10px;
            box-sizing: content-box;
            border-radius: 50%;
            border: 1px solid lightgrey;
            background-color: white;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);

            img {
                width: 80px;
                background-color: lightgray;
                border-radius: 50%;
            }
        }

        .el-form {
            padding: 100px 10px 0;
        }

    }
}
</style>
