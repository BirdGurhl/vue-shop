<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" @close="close">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="70px" width="500px">
      <el-form-item label="姓名" prop="username" >
        <el-input v-model="formData.username" :disabled="!addShow"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="addShow">
        <el-input v-model="formData.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { checkEmail, checkPhone, checkName, checkPassword } from '@/utils/reg'

export default {
  name: 'Dialog',
  data() {
    return {
      rules: {
        username: checkName,
        password: checkPassword,
        email: checkEmail,
        mobile: checkPhone
      }
    }
  },
  props:['title','dialogVisibleModel','formDataModel','callback'],
  computed: {
    dialogVisible:{
      get(){return this.dialogVisibleModel},
      set(val){this.$emit('update:dialogVisibleModel',val)}
    },
    formData:{
      get(){return this.formDataModel},
      set(val){this.$emit('update:formDataModel',val)}
    },
    addShow(){return this.title == '添加用户'}
  },
  components: {},
  created() {   },
  mounted() { },
  methods: {
    submit(){
      this.$refs['formData'].validate(check => {
        if (!check) return
        this.callback()
      })
    },
    close(){
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
