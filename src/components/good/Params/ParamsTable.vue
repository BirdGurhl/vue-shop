<template>
    <div class='ParamsTable'>
        <!-- 添加按钮 -->
        <div class="addBtn">
            <el-button type="primary" size="small" :disabled="!addBtnAble" @click="addBtn()">{{ title == 'many' ? '添加分类' :
                '添加属性'
            }}</el-button>
        </div>

        <!-- 编辑参数弹出框 -->
        <params-dialog :title="title" :dialogVisibleModel.sync="addDialogVisible" :formDataModel.sync="formData"
            :callback="addParams">
        </params-dialog>
        <!-- 编辑参数弹出框 -->
        <params-dialog :title="title" :dialogVisibleModel.sync="dialogVisible" :formDataModel.sync="formData"
            :callback="editCategories">
        </params-dialog>
        <!-- 表格数据 -->
        <el-table :data="selectCatAttributes" style="width: 100%" border stripe row-key="attr_id">

            <el-table-column type="expand">
                <template v-slot="scope">
                    <el-tag v-if="title === 'only' && scope.row.attr_vals">
                        {{ scope.row.attr_vals }}
                    </el-tag>
                    <el-tag v-if="title === 'many' && tag" :key="tag" v-for="tag in scope.row.attr_vals" closable
                        :disable-transitions="false" @close="delTag(tag, scope.row)">
                        {{ tag }}
                    </el-tag>
                    <template v-if="title === 'many'">
                        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput"
                            size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)">
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                    </template>
                </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" :label="title == 'many' ? '参数名称' : '属性名称'"></el-table-column>
            <el-table-column label="操作" width="180">
                <template v-slot="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini"
                        @click="editCategoriesBtn(scope.row)">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini"
                        @click="delCategories(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { delParams, editParams, addParams } from '@/api/api'
import ParamsDialog from './ParamsDialog.vue'
export default {
    data() {
        return {
            dialogVisible: false,
            addDialogVisible: false,
            formData: {
                cat_id: '',
                attr_id: '',
                attr_name: '',
                attr_sel: '',
                attr_vals: '',
            },
            inputVisible: false,
            inputValue: ''
        }
    },
    props: ['title', 'SelectCategoriesListModel', 'getParamsList', 'addBtnAble', 'catid'],
    computed: {
        selectCatAttributes: {
            get() { return this.SelectCategoriesListModel },
            set(val) { this.$emit('update:SelectCategoriesListModel', val) }
        },
    },
    components: {
        ParamsDialog
    },
    created() {

    },
    mounted() { },
    methods: {
        handleInputConfirm(row) {

            let inputValue = this.inputValue;
            if (!inputValue) {
                this.inputVisible = false;
                this.inputValue = '';
                return
            }
            row.attr_vals.push(inputValue);
            this.inputVisible = false;
            this.inputValue = '';
            // 深拷贝
            this.formData = JSON.parse(JSON.stringify(row))
            // 转换字符串
            this.formData.attr_vals = this.formData.attr_vals.join(',')
            console.log(this.formData);
            this.editCategories()
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 点击标签的小叉叉
        delTag(tag, row) {
            // 删去叉掉的那个
            row.attr_vals.splice(row.attr_vals.indexOf(tag), 1)
            // 深拷贝
            this.formData = JSON.parse(JSON.stringify(row))
            // 截去叉掉的那个
            if (this.formData.attr_sel == 'many') {
                // 转换字符串
                this.formData.attr_vals = this.formData.attr_vals.join(',')
            }
            console.log(this.formData);
            this.editCategories()
        },
        // 添加
        async addParams() {
            console.log(this.formData);
            const res = await addParams(this.formData)
            if (res.meta.status != 201) {
                return
            }
            this.$message.success('成功')
            // 重新获取表格数据
            this.getParamsList()
        },
        addBtn() {
            this.formData.cat_id = this.catid
            this.formData.attr_sel = this.title
            console.log(this.formData);
            this.addDialogVisible = true
        },
        // 编辑
        editCategoriesBtn(params) {
            this.formData = JSON.parse(JSON.stringify(params))
            console.log(this.formData);
            if (this.formData.attr_sel == 'many') {
                this.formData.attr_vals = this.formData.attr_vals.join(',')
            }

            this.dialogVisible = true
        },
        async editCategories() {
            const res = await editParams(this.formData)
            if (res.meta.status != 200) {
                return
            }
            this.$message.success('成功')
            // 重新获取表格数据
            this.getParamsList()
        },
        // 删除分类参数
        delCategories(params) {

            this.$confirm('此操作将永久删除该项数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await delParams(params)
                if (res.meta.status != 200) {
                    return
                }
                this.$message.success('成功')
                // 重新获取表格数据
                this.getParamsList()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })

        },
    }
}
</script>
<style lang='less' scoped>
.addBtn {
    display: flex;
    justify-content: start;
    margin-bottom: 10px;
}

.el-tag {
    margin: 5px;
}
.input-new-tag{
    width: fit-content;
}
</style>
