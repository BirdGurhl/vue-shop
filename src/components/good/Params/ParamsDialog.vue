<template>
    <div class='ParamsDialog'>
        <el-dialog :title="title == 'many' ? '添加动态参数' : '添加静态属性'" :visible.sync="dialogVisible" @close="close">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="80px" width="500px">
                <el-form-item :label="title == 'many' ? '参数名称' : '属性名称'" prop="attr_name">
                    <el-input v-model="formData.attr_name"></el-input>
                </el-form-item>
                <el-alert title="注意：两个属性值之间请用逗号隔开" type="warning" show-icon v-if="title == 'many'"></el-alert>
                <el-form-item label="属性值" v-if="title == 'many'">
                    <el-input type="textarea" autosize placeholder="请输入" v-model="formData.attr_vals">
                    </el-input>
                </el-form-item>
                <el-form-item label="属性值" v-if="title == 'only'">
                    <el-input v-model="formData.attr_vals"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'ParamsDialog',

    data() {
        return {
            rules: {
                attr_name: [
                    { required: true, message: '输入为空', trigger: 'blur' },
                ]
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
    },
    components: {},
    created() { },
    mounted() { },
    methods: {
        close() {
            this.dialogVisible = false
            this.$refs['formData'].resetFields()
            for (const key in this.formData) {
                if (Object.hasOwnProperty.call(this.formData, key)) {
                    this.formData[key] = ''
                }
            }
        },
        submit() {
            this.$refs['formData'].validate(check => {
                if (!check) return
                this.formData.attr_vals = this.formData.attr_vals.trim()
                // 如果以逗号结尾
                if (this.formData.attr_vals.endsWith(',') || this.formData.attr_vals.endsWith(',')) {
                    this.formData.attr_vals = this.formData.attr_vals.slice(0, -1)
                }
                this.callback()
                this.dialogVisible = false
            })
        }
    }
}
</script>
<style lang='less' scoped>
.el-alert {
    margin-bottom: 12px;
}
</style>
