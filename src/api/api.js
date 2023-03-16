import service from "@/service"

// 登录
export async function login(params) {
    let { data } = await service.post('login', params)
    return data
}
// 获取菜单
export async function getMenuList() {
    let { data } = await service.get('menus')
    return data
}
// 查找/获取用户信息列表
export async function getUsersList(params) {
    let { data } = await service({
        method:'get',
        url:'users',
        params:params
    })
    return data
}
// 添加用户
export async function addUser(userInfo) {
    let { data } = await service.post('users',userInfo)
    return data
}
// 修改用户信息
export async function userInfoChange(user) {
    let { data } = await service({
        method:'put',
        url:`users/${user.id}`,
        data:{
            email:user.email,
            mobile:user.mobile
        }
    })
    return data
}
// 修改用户状态
export async function userStageChange(user) {
    let { data } = await service.put(`users/${user.id}/state/${user.mg_state}`)
    return data
}
// 删除用户
export async function delUser(user) {
    let { data } = await service.delete(`users/${user.id}`)
    return data
}

// 删除用户
export async function getUserInfo(user) {
    let { data } = await service.get(`users/${user.id}`)
    return data
}

// 获取权限列表
export async function getRightList(type) {
    let { data } = await service.get(`rights/${type}`)
    return data
}

// 获取角色列表
export async function getRoleList() {
    let { data } = await service.get(`roles`)
    return data
}

// 添加角色
export async function addRole(roleInfo) {
    let { data } = await service.post(`roles`,roleInfo)
    return data
}

// 修改角色信息
export async function roleInfoChange(roleInfo) {
    let { data } = await service({
        method:'put',
        url:`roles/${roleInfo.id}`,
        data:{
            roleName:roleInfo.roleName,
            roleDesc:roleInfo.roleDesc
        }
    })
    return data
}

// 删除角色
export async function delRole(roleInfo) {
    let { data } = await service.delete(`roles/${roleInfo.id}`)
    return data
}

// 删除角色权限
export async function delRight(roleID,rightID) {
    let { data } = await service.delete(`roles/${roleID}/rights/${rightID}`)
    return data
}
assignRight
// 角色授权
export async function assignRight(roleId,rids) {
    let { data } = await service.post(`roles/${roleId}/rights`,{rids})
    // let { data } = await service({
    //     method:'post',
    //     url:`roles/${roleId}/rights`,
    //     data:{
    //         rids
    //     }
    // })
    console.log(data);
    return data
}

// 分类用户角色
export async function assignUserRole(uid,rid) {
    let { data } = await service.put(`users/${uid}/role`,{rid})
    return data
}

// 获取商品分类数据
export async function getCategories(params) {
    let { data } = await service({
        method:'get',
        url:'categories',
        params:params
    })
    return data
}
// 添加分类
export async function addCategories(params) {
    let { data } = await service({
        method:'post',
        url:'categories',
        'data':params
    })
    return data
}
// 修改分类
export async function editCategories(cat_id,cat_name) {
    let { data } = await service.put(`categories/${cat_id}`,{cat_name})
    console.log(data);
    return data
}
// 删除分类
export async function delCategories(id) {
    let { data } = await service.delete(`categories/${id}`)
    return data
}
