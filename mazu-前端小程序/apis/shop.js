import request from "../utils/request";

// 获取商城商品数据
export const getShopListAPI = () => {
	return request({
		url: "/shop/getShopList",
		method: "GET"
	})
}

// 获取商品种类数据
export const getShopGridAPI = () => {
	return request({
		url: "/shop/getShopGrid",
		method: "GET"
	})
}

// 根据分类筛选商品
export const gridSearchShopAPI = (grid) => {
	return request({
		url: "/shop/gridSearchShop",
		method: "POST",
		data: {
			grid
		}
	})
}

// 获取商品详情
export const getShopDetailAPI = (id) => {
	return request({
		url: "/shop/getShopDetail",
		method: "POST",
		data: {
			id
		}
	})
}

// 获取用户收货地址
export const getAddressAPI = (id) => {
	return request({
		url: "/shop/getAddress",
		method: "POST",
		data: {
			id
		}
	})
}

// 获取用户默认收货地址
export const getDefaultAddressAPI = (id) => {
	return request({
		url: "/shop/getDefaultAddress",
		method: "POST",
		data: {
			id
		}
	})
}

// 新增收获地址
export const addAddressAPI = ({
	user_id,
	province,
	city,
	district,
	remark,
	name,
	mobile,
	isDefault
}) => {
	return request({
		url: "/shop/addAddress",
		method: "POST",
		data: {
			user_id,
			province,
			city,
			district,
			remark,
			name,
			mobile,
			isDefault
		}
	})
}

// 修改收货地址
export const editAddressAPI = ({
	id,
	user_id,
	province,
	city,
	district,
	remark,
	name,
	mobile,
	isDefault
}) => {
	return request({
		url: "/shop/editAddress",
		method: "POST",
		data: {
			id,
			user_id,
			province,
			city,
			district,
			remark,
			name,
			mobile,
			isDefault
		}
	});
}

// 删除收货地址
export const delAddressAPI = ({
	id,
	user_id
}) => {
	return request({
		url: "/shop/delAddress",
		method: "POST",
		data: {
			id,
			user_id
		}
	})
}

// 通过地址id获取收货地址信息
export const getIdAddressAPI = (id) => {
	return request({
		url: "/shop/getIdAddress",
		method: "POST",
		data: {
			id
		}
	})
}

// 创建订单
export const createOrderAPI = ({
	user_id,
	address_id,
	payment,
	note,
	shop_id
}) => {
	return request({
		url: "/shop/createOrder",
		method: "POST",
		data: {
			user_id,
			address_id,
			payment,
			note,
			shop_id
		}
	})
}

// 商城支付
export const shopPayMoneyAPI = ({
	pay_money,
	pay_ment,
	order_id,
	user_id
}) => {
	return request({
		url: "/shop/shopPayMoney",
		method: "POST",
		data: {
			pay_money,
			pay_ment,
			order_id,
			user_id
		}
	})
}

// 查询订单
export const getShopOrderAPI = (orderType) => {
	return request({
		url: "/shop/getShopOrder",
		method: "POST",
		data: {
			orderType
		}
	})
}

// 收藏/取消收藏
export const collectGoodsAPI = ({
	user_id,
	goods_id,
	judge
}) => {
	return request({
		url: "/shop/collectGoods",
		method: "POST",
		data: {
			user_id,
			goods_id,
			judge
		}
	})
}

// 获取此商品是否收藏
export const judgeCollectAPI = ({
	user_id,
	goods_id
}) => {
	return request({
		url: "/shop/judgeCollect",
		method: "POST",
		data: {
			user_id,
			goods_id
		}
	})
}

// 删除订单
export const deleteShopOrderAPI = ({
	id,
	user_id,
	order_no,
}) => {
	return request({
		url: "/shop/deleteShopOrder",
		method: "POST",
		data: {
			id,
			user_id,
			order_no,
		}
	})
}

// 获取订单info
export const getOrderInfoAPI = (id) => {
	return request({
		url: "/shop/getOrderInfo",
		method: "POST",
		data: {
			id
		}
	})
}

// 操作订单
export const editOrderAPI = ({
	editCode,
	id,
	order_no
}) => {
	return request({
		url: "/shop/editOrder",
		method: "POST",
		data: {
			editCode,
			id,
			order_no
		}
	})
}