import request from '../utils/request'
import config from '../config'

// 登录接口
export function login(data) {
  return request.post('/admin/login', data)
}

// 用户信息接口
export function getAdmin() {
  return request.get('/admin/admin')
}

// 修改密码接口
export function changeAdminPassword(data) {
  return request.post('/admin/admin/changePassword', data)
}

// 修改头像接口
export function changeAdminAvatar(data) {
  return request.post('/admin/admin/changeAvatar', data)
}

// 更新图片地址
export function uploadPictureURL() {
  return config.baseURL + '/admin/upload/picture'
}

//订单首页列表
export function getOrdersList(params) {
  return request.get('/admin/orders/page', { params })
}
//订单编辑框
export function getOrders(params) {
  return request.get('/admin/orders/list', { params })
}
//订单添加
export function addOrder(data) {
  return request.post('/admin/orders/add',data)
}
//订单修改
export function editOrder(data) {
  return request.post('/admin/orders/edit',data)
}


export function delOrder(data) {
  return request.post('/admin/orders/del',data)
}




// 新增分类接口
export function addCategory(data) {
  return request.post('/admin/category/add', data)
}

// 修改分类接口
export function editCategory(data) {
  return request.post('/admin/category/save', data)
}

// 删除分类接口
export function delCategory(data) {
  return request.post('/admin/category/del', data)
}





// 航班首页列表接口
export function getGoodsList(params) {
  return request.get('/admin/index/list', { params })
}
// 航班编辑框列表接口
export function getFlightsList(params) {
  return request.get('/admin/flights/list', { params })
}


// 查询单个航班接口
export function getGoods(params) {
  return request.get('/admin/flight', { params })
}

// 新增航班接口
export function addGoods(data) {
  return request.post('/admin/flight/add', data)
}

// 修改航班接口
export function editGoods(data) {
  return request.post('/admin/flight/save', data)
}

// 删除航班接口
export function delGoods(data) {
  return request.post('/admin/flight/del', data)
}
