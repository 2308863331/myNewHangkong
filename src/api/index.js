import request from '../utils/request'
import config from '../config'





//用户管理
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


//支付记录
//
export function getPaymentsList(params) {
  return request.get('/admin/paids/page', { params })
}
//订单编辑框
export function getPayments(params) {
  return request.get('/admin/paids/list', { params })
}
//订单添加
export function addPayment(data) {
  return request.post('/admin/paids/add',data)
}
//订单修改
export function editPayment(data) {
  return request.post('/admin/paids/edit',data)
}

//订单删除
export function delPayment(data) {
  return request.post('/admin/paids/del',data)
}



//TODO 好奇怪 我明明没有实现查单个
//订单管理
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

//订单删除
export function delOrder(data) {
  return request.post('/admin/orders/del',data)
}








//航班管理
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
