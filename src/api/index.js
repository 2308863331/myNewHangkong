import request from '../utils/request'
import config from '../config'




//个人信息管理
export function userOrder(params) {
  return request.get('/admin/orders/userId',  { params })
}
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


//用户管理
//用户
export function getUsersList(params) {
  return request.get('/admin/users/page', { params })
}
//用户编辑框
export function getUsers(params) {
  return request.get('/admin/users/list', { params })
}
//用户添加
export function addUser(data) {
  return request.post('/admin/users/add',data)
}
//用户修改
export function editUser(data) {
  return request.post('/admin/users/edit',data)
}
//用户删除
export function delUser(data) {
  return request.post('/admin/users/del',data)
}



//退款管理
//退款
export function getRefundsList(params) {
  return request.get('/admin/refunds/page', { params })
}
//退款编辑框
export function getRefunds(params) {
  return request.get('/admin/refunds/list', { params })
}
//退款添加
export function addRefund(data) {
  return request.post('/admin/refunds/add',data)
}
//退款修改
export function editRefund(data) {
  return request.post('/admin/refunds/edit',data)
}
//退款删除
export function delRefund(data) {
  return request.post('/admin/refunds/del',data)
}



//评论管理
//优惠券
export function getReviewsList(params) {
  return request.get('/admin/reviews/page', { params })
}
//优惠券编辑框
export function getReviews(params) {
  return request.get('/admin/reviews/list', { params })
}
//优惠券添加
export function addReview(data) {
  return request.post('/admin/reviews/add',data)
}
//优惠券修改
export function editReview(data) {
  return request.post('/admin/reviews/edit',data)
}
//优惠券删除
export function delReview(data) {
  return request.post('/admin/reviews/del',data)
}



//优惠券管理
//优惠券
export function getCouponsList(params) {
  return request.get('/admin/coupons/page', { params })
}
//优惠券编辑框
export function getCoupons(params) {
  return request.get('/admin/coupons/list', { params })
}
//优惠券添加
export function addCoupon(data) {
  return request.post('/admin/coupons/add',data)
}
//优惠券修改
export function editCoupon(data) {
  return request.post('/admin/coupons/edit',data)
}
//优惠券删除
export function delCoupon(data) {
  return request.post('/admin/coupons/del',data)
}




//机票座位
export function getSeatsList(params) {
  return request.get('/admin/seats/page', { params })
}
//机票座位编辑框
export function getSeats(params) {
  return request.get('/admin/seats/list', { params })
}
//机票座位添加
export function addSeat(data) {
  return request.post('/admin/seats/add',data)
}
//机票座位修改
export function editSeat(data) {
  return request.post('/admin/seats/edit',data)
}
//机票座位删除
export function delSeat(data) {
  return request.post('/admin/seats/del',data)
}




//支付记录
export function getPaymentsList(params) {
  return request.get('/admin/paids/page', { params })
}
//支付记录编辑框
export function getPayments(params) {
  return request.get('/admin/paids/list', { params })
}
//支付记录添加
export function addPayment(data) {
  return request.post('/admin/paids/add',data)
}
//支付记录修改
export function editPayment(data) {
  return request.post('/admin/paids/edit',data)
}

//支付记录删除
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
