"use strict";
const utils_request = require("../utils/request.js");
const getShopListAPI = () => {
  return utils_request.request({
    url: "/shop/getShopList",
    method: "GET"
  });
};
const getShopGridAPI = () => {
  return utils_request.request({
    url: "/shop/getShopGrid",
    method: "GET"
  });
};
const gridSearchShopAPI = (grid) => {
  return utils_request.request({
    url: "/shop/gridSearchShop",
    method: "POST",
    data: {
      grid
    }
  });
};
const getShopDetailAPI = (id) => {
  return utils_request.request({
    url: "/shop/getShopDetail",
    method: "POST",
    data: {
      id
    }
  });
};
const getAddressAPI = (id) => {
  return utils_request.request({
    url: "/shop/getAddress",
    method: "POST",
    data: {
      id
    }
  });
};
const getDefaultAddressAPI = (id) => {
  return utils_request.request({
    url: "/shop/getDefaultAddress",
    method: "POST",
    data: {
      id
    }
  });
};
const addAddressAPI = ({
  user_id,
  province,
  city,
  district,
  remark,
  name,
  mobile,
  isDefault
}) => {
  return utils_request.request({
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
  });
};
const editAddressAPI = ({
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
  return utils_request.request({
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
};
const delAddressAPI = ({
  id,
  user_id
}) => {
  return utils_request.request({
    url: "/shop/delAddress",
    method: "POST",
    data: {
      id,
      user_id
    }
  });
};
const getIdAddressAPI = (id) => {
  return utils_request.request({
    url: "/shop/getIdAddress",
    method: "POST",
    data: {
      id
    }
  });
};
const createOrderAPI = ({
  user_id,
  address_id,
  payment,
  note,
  shop_id
}) => {
  return utils_request.request({
    url: "/shop/createOrder",
    method: "POST",
    data: {
      user_id,
      address_id,
      payment,
      note,
      shop_id
    }
  });
};
const shopPayMoneyAPI = ({
  pay_money,
  pay_ment,
  order_id,
  user_id
}) => {
  return utils_request.request({
    url: "/shop/shopPayMoney",
    method: "POST",
    data: {
      pay_money,
      pay_ment,
      order_id,
      user_id
    }
  });
};
const getShopOrderAPI = (orderType) => {
  return utils_request.request({
    url: "/shop/getShopOrder",
    method: "POST",
    data: {
      orderType
    }
  });
};
const collectGoodsAPI = ({
  user_id,
  goods_id,
  judge
}) => {
  return utils_request.request({
    url: "/shop/collectGoods",
    method: "POST",
    data: {
      user_id,
      goods_id,
      judge
    }
  });
};
const judgeCollectAPI = ({
  user_id,
  goods_id
}) => {
  return utils_request.request({
    url: "/shop/judgeCollect",
    method: "POST",
    data: {
      user_id,
      goods_id
    }
  });
};
const deleteShopOrderAPI = ({
  id,
  user_id,
  order_no
}) => {
  return utils_request.request({
    url: "/shop/deleteShopOrder",
    method: "POST",
    data: {
      id,
      user_id,
      order_no
    }
  });
};
const getOrderInfoAPI = (id) => {
  return utils_request.request({
    url: "/shop/getOrderInfo",
    method: "POST",
    data: {
      id
    }
  });
};
const editOrderAPI = ({
  editCode,
  id,
  order_no
}) => {
  return utils_request.request({
    url: "/shop/editOrder",
    method: "POST",
    data: {
      editCode,
      id,
      order_no
    }
  });
};
exports.addAddressAPI = addAddressAPI;
exports.collectGoodsAPI = collectGoodsAPI;
exports.createOrderAPI = createOrderAPI;
exports.delAddressAPI = delAddressAPI;
exports.deleteShopOrderAPI = deleteShopOrderAPI;
exports.editAddressAPI = editAddressAPI;
exports.editOrderAPI = editOrderAPI;
exports.getAddressAPI = getAddressAPI;
exports.getDefaultAddressAPI = getDefaultAddressAPI;
exports.getIdAddressAPI = getIdAddressAPI;
exports.getOrderInfoAPI = getOrderInfoAPI;
exports.getShopDetailAPI = getShopDetailAPI;
exports.getShopGridAPI = getShopGridAPI;
exports.getShopListAPI = getShopListAPI;
exports.getShopOrderAPI = getShopOrderAPI;
exports.gridSearchShopAPI = gridSearchShopAPI;
exports.judgeCollectAPI = judgeCollectAPI;
exports.shopPayMoneyAPI = shopPayMoneyAPI;
//# sourceMappingURL=../../.sourcemap/mp-weixin/apis/shop.js.map
