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


