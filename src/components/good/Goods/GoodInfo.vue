<template>
    <div class='GoodInfo'>
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert :title="title" type="info" show-icon center></el-alert>
            <el-steps :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form label-position="top" :model="addForm" :rules="rules" ref="addForm">
                <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClick">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="重量（kg）" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="分类" prop="goods_cat">
                            <el-cascader v-model="addForm.goods_cat" :options="SelectCategoriesList" :props="selectProps"
                                @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item v-for="(params, index) in paramsList" :key="params.attr_id" :label="params.attr_name">
                            <el-checkbox-group v-model="manyParamsModel[index].attr_vals">
                                <el-checkbox v-for="(item, index) in params.attr_vals" :key="index" :label="item"
                                    border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item v-for="(params, index) in onlyParamsList" :key="params.attr_id"
                            :label="params.attr_name">
                            <el-input v-model="onlyParamsModel[index].attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品图片" name="3">
                        <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove"
                            :file-list="fileList" :on-success="handleSuccess" list-type="picture" :headers="headerObj">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                        </el-upload>
                    </el-tab-pane>

                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器 -->
                        <quill-editor v-model="addForm.goods_introduce">
                        </quill-editor>
                        <el-button type="primary" class="addBtn" @click="addBtn">完成</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>

            <!-- 图片预览弹窗 -->
            <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
                <img :src="priviewPath" alt="" style="width: 100%;">
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入富文本编辑器
import { quillEditor } from 'vue-quill-editor'

import service from '@/service'
import { getCategories, getParamsList, addGoods, editGoods } from '@/api/api'
export default {
    name: 'GoodInfo',
    data() {
        return {
            activeIndex: '0',
            addForm: {
                goods_name: '',
                goods_price: 0,
                goods_number: 0,
                goods_weight: 0,
                goods_cat: [],
                pics: [],
                goods_introduce: ''
            },
            rules: {
                goods_name: { required: true, message: '请输入商品名称', trigger: 'blur' },
                goods_price: { required: true, message: '请输入商品价格', trigger: 'blur' },
                goods_number: { required: true, message: '请输入商品数量', trigger: 'blur' },
                goods_weight: { required: true, message: '请输入商品重量', trigger: 'blur' },
                goods_cat: { required: true, message: '请输入商品重量', trigger: 'blur' },
            },
            SelectCategoriesList: [],
            selectProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                expandTrigger: 'hover',
                checkStrictly: false
            },
            paramsList: [],
            paramsListFlag: false,
            manyParamsModel: [],
            onlyParamsList: [],
            onlyParamsListFlag: false,
            onlyParamsModel: [],
            // uploadURL: $http.defaults.baseURL + '/upload'
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            priviewPath: '',
            fileList: [],
            dialogVisible: false
        }
    },
    computed: {
        catid() { return this.addForm.goods_cat[this.addForm.goods_cat.length - 1] },
        uploadURL() { return service.defaults.baseURL + 'upload' },
        isAddGood() { return !Boolean(this.$route.query.goodInfo) },
        isEditGood() { return Boolean(this.$route.query.goodInfo) },
        title() { return this.isAddGood ? '添加商品信息' : '编辑商品信息' }
    },

    components: {
        quillEditor
    },
    created() {
        this.getAllCategories()
        if (this.isEditGood) {
            this.addForm = JSON.parse(this.$route.query.goodInfo)
            // 写入分类参数
            this.addForm.goods_cat = [this.addForm.cat_one_id, this.addForm.cat_two_id, this.addForm.cat_three_id]
            // 写入商品参数/属性
            this.getParamsList('many').then((result) => {
                this.getParamsList('only')
            }).then((result) => {
                this.init()
                console.log(this.addForm);
                console.log(this.fileList);
                console.log(this.manyParamsModel);
                console.log(this.onlyParamsModel);
            }).catch((err) => {
                this.$message.error(err)
                this.$router.back()
            });
        }

    },
    mounted() { },
    methods: {
        async addBtn() {
            console.log(this.addForm);
            console.log(this.paramsList);
            console.log(this.onlyParamsList);
            // 深拷贝
            const formData = JSON.parse(JSON.stringify(this.addForm))
            formData.goods_number = Number(formData.goods_number)
            formData.goods_price = Number(formData.goods_price)
            formData.goods_weight = Number(formData.goods_weight)

            // 将分类id goods_cat 转换为字符串，以逗号分隔
            formData.goods_cat = formData.goods_cat.join(',')
            // 将分类参数/属性转换为对象存放一个数组中
            // formData.attrs = [
            // {
            //     "attr_id":15,
            //     "attr_value":"ddd"
            // }
            // ]
            formData.attrs = []
            // 动态参数
            this.manyParamsModel.forEach((attr, index, arr) => {
                if (attr.attr_vals.length == 0) {
                    // console.log('false');
                    return
                }
                const arrrInfo = {
                    attr_id: attr.attr_id,
                    attr_value: attr.attr_vals.join(',').trim()
                }
                formData.attrs.push(arrrInfo)
            })
            // 静态属性
            this.onlyParamsModel.forEach((attr, index, arr) => {
                if (!attr.attr_vals) {
                    // console.log('false');
                    return
                }
                const arrrInfo = {
                    attr_id: attr.attr_id,
                    attr_value: attr.attr_vals.trim()
                }
                formData.attrs.push(arrrInfo)
            })
            console.log(formData);
            if (this.isAddGood) {
                const res = await addGoods(formData)
                if (res.meta.status != 201) {
                    return
                }
                console.log(res);
            } else if (this.isEditGood) {
                const res = await editGoods(formData)
                if (res.meta.status != 201) {
                    return
                }
                console.log(res);
            }
            this.$message.success('成功')
            this.$router.push('/goods')
        },
        // 上传图片
        handleSuccess(response) {
            this.addForm.pics.push({ pic: response.data.tmp_path })
        },
        // 上传图片移除
        handleRemove(file, fileList) {
            let path = file.response ? file.response.data.tmp_path : file.url
            this.addForm.pics.splice(this.addForm.pics.indexOf(path), 1)
        },
        // 上传图片预览
        handlePreview(file) {
            this.priviewPath = file.response ? file.response.data.url : file.url
            this.dialogVisible = true
        },
        handleChange() {

        },
        tabClick() {
            switch (this.activeIndex) {
                case '0':

                    break;
                case '1':
                    // 获取商品参数
                    if (this.paramsListFlag) break
                    this.getParamsList('many')
                    break;
                case '2':
                    if (this.onlyParamsListFlag) break
                    // 获取商品属性
                    this.getParamsList('only')
                    break;
                default:
                    break;
            }
        },
        beforeTabLeave(activeName, oldActiveName) {
            let flag = false
            if (oldActiveName == 0) {
                this.$refs['addForm'].validate(check => {
                    flag = check
                })
                if (!flag) {
                    this.$message.error('请完善表单数据！')
                    return flag
                }
            }

        },
        // 获取商品参数列表
        async getParamsList(sel) {
            // 如果还没选择分类
            if (this.addForm.goods_cat.length <= 0) return Promise.resolve()
            const res = await getParamsList(this.catid, { sel })
            if (res.meta.status != 200) {
                return Promise.reject()
            }
            // 如果时动态参数,切割分类参数
            if (sel == 'many') {
                this.paramsList = res.data.filter((item, index, arr) => {
                    // 如果为空
                    if (!item.attr_vals) return false
                    arr[index].attr_vals = item.attr_vals.trim()
                    // 如果以逗号结尾
                    if (arr[index].attr_vals.endsWith(',') || arr[index].attr_vals.endsWith(',')) {
                        arr[index].attr_vals = arr[index].attr_vals.slice(0, -1)
                    }
                    arr[index].attr_vals = item.attr_vals.split(/,|，/)
                    return true
                })
                this.paramsList.forEach((attr, index, arr) => {
                    if (attr.attr_vals.length == 0) {
                        return
                    }
                    const arrrInfo = {
                        attr_id: attr.attr_id,
                        attr_vals: this.isAddGood ? [...attr.attr_vals] : []
                    }
                    this.manyParamsModel.push(arrrInfo)
                })
                console.log(this.manyParamsModel);
                this.paramsListFlag = true
            }
            if (sel == 'only') {
                this.onlyParamsList = res.data.filter((item, index, arr) => {
                    // 如果为空
                    // if (!item.attr_vals) return false
                    return true
                })
                this.onlyParamsList.forEach((attr, index, arr) => {
                    const arrrInfo = {
                        attr_id: attr.attr_id,
                        attr_vals: this.isAddGood ? attr.attr_vals.trim() : ''
                    }
                    this.onlyParamsModel.push(arrrInfo)
                })
                console.log(this.onlyParamsModel);
                this.onlyParamsListFlag = true
            }
            return Promise.resolve()
        },
        // 获取分类列表
        async getAllCategories() {
            const res = await getCategories()
            if (res.meta.status != 200) {
                return
            }
            this.SelectCategoriesList = res.data
        },
        init() {

            console.log(JSON.parse(this.$route.query.goodInfo));
            this.addForm.attrs.forEach((item, index, arr) => {
                if (item.attr_sel == 'many') {
                    // 商品参数
                    if (!item.attr_vals) return
                    arr[index].attr_vals = item.attr_vals.trim()
                    // 如果以逗号结尾
                    if (arr[index].attr_vals.endsWith(',') || arr[index].attr_vals.endsWith(',')) {
                        arr[index].attr_vals = arr[index].attr_vals.slice(0, -1)
                    }
                    arr[index].attr_vals = item.attr_vals.split(/,|，/)

                    const arrrInfo = {
                        attr_id: item.attr_id,
                        attr_vals: [...arr[index].attr_vals]
                    }
                    let flag = this.manyParamsModel.some((element, index, arr) => {
                        if (element.attr_id == arrrInfo.attr_id) {
                            arr[index].attr_vals = arrrInfo.attr_vals
                            console.log(arr[index].attr_vals)
                            return true
                        }
                        return false
                    })
                    if (!flag) {
                        this.manyParamsModel.push(arrrInfo)
                    }
                } else if (item.attr_sel == 'only') {
                    // 商品属性
                    const arrrInfo = {
                        attr_id: item.attr_id,
                        attr_vals: item.attr_vals
                    }
                    let flag = this.onlyParamsModel.some((element, index, arr) => {
                        if (element.attr_id == arrrInfo.attr_id) {
                            arr[index].attr_vals = arrrInfo.attr_vals
                            console.log(arr[index].attr_vals)
                            return true
                        }
                        return false
                    })
                    if (!flag) {
                        this.onlyParamsModel.push(arrrInfo)
                    }
                }

            })
            // console.log(this.manyParamsModel);
            // console.log(this.onlyParamsModel);
            // 写入商品图片
            this.addForm.pics.forEach((item, index, arr) => {
                this.fileList.push({
                    name: index + '.jpg',
                    url: item.pics_big_url
                })
                arr[index] = { pic: item.pics_big_url }
            })

        }
    }
}
</script>
<style lang='less' scoped>
.el-steps {
    margin: 10px 0 20px;
}

.el-form {
    text-align: left;
}

.el-checkbox {
    margin: 0 5px !important;
}

/deep/.ql-editor {
    min-height: 300px;
}

.addBtn {
    margin: 10px 0;
}
</style>
