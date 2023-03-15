<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" @close="close">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="80px" width="500px">
      <el-form-item label="姓名" prop="username" v-if="formData.hasOwnProperty('username')">
        <el-input v-model="formData.username" :disabled="!addShow"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="formData.hasOwnProperty('password') && addShow">
        <el-input v-model="formData.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email" v-if="formData.hasOwnProperty('email')">
        <el-input v-model="formData.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile" v-if="formData.hasOwnProperty('mobile')">
        <el-input v-model="formData.mobile"></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName" v-if="formData.hasOwnProperty('roleName')">
        <el-input v-model="formData.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc" v-if="formData.hasOwnProperty('roleDesc')">
        <el-input v-model="formData.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { checkEmail, checkPhone, checkName, checkPassword, checkroleName, checkroleDesc } from '@/utils/reg'

export default {
  name: 'Dialog',
  data() {
    return {
      rules: {
        username: checkName,
        password: checkPassword,
        email: checkEmail,
        mobile: checkPhone,
        roleName: checkroleName,
        roleDesc: checkroleDesc,
      }
    }
  },
  props: ['title', 'dialogVisibleModel', 'formDataModel', 'callback'],
  computed: {
    dialogVisible: {
      get() { return this.dialogVisibleModel },
      set(val) { this.$emit('update:dialogVisibleModel', val) }
    },
    formData: {
      get() { return this.formDataModel },
      set(val) { this.$emit('update:formDataModel', val) }
    },
    addShow() { return this.title == '添加用户' }
  },
  components: {},
  created() { },
  mounted() { },
  methods: {
    submit() {
      this.$refs['formData'].validate(check => {
        if (!check) return
        this.callback()
        this.dialogVisible = false
      })
    },
    close() {
      this.dialogVisible = false
      this.$refs['formData'].resetFields()
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(this.formData, key)) {
          this.formData[key] = ''

        }
      }
    },
  }
}
</script>
<style lang='less' scoped></style>
