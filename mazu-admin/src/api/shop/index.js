import request from '~/axios'

// 查询订单
export const shopOrderAdminAPI = (page) => {
    return request({
        url: "/admin/shopOrderAdmin",
        method: "POST",
        data: {
            page
        }
    });
};
// 查询商品详情
export const getOrderDetailAPI = (id) => {
    return request({
        url: `/shop/orderDetail/${id}`,
        method: "GET"
    });
};

// 获取商品列表（支持分页+搜索）
export const getShopListAPI = (params) => {
    return request({
        url: "/shop",
        method: "GET",
        params // 分页(page/pageSize)、搜索(search)参数通过params传递
    });
};

// 获取商品分类
export const getShopGridAPI = () => {
    return request({
        url: "/shop/grid",
        method: "GET"
    });
};

// 多图上传
export const uploadShopImagesAPI = (formData) => {
    return request({
        url: "/shop/upload-imgs",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" }
    });
};

// 新增商品
export const addShopAPI = (data) => {
    return request({
        url: "/shop",
        method: "POST",
        data
    });
};

// 修改商品
export const updateShopAPI = (data) => {
    return request({
        url: `/shop/${data.id}`, // 路径参数携带商品ID
        method: "PUT",
        data
    });
};

// 删除商品（支持批量删除）
export const deleteShopAPI = ({ ids }) => {
    return request({
        url: `/shop/${ids}`,
        method: "DELETE",
    });
};

// 删除图片
export const deleteImageAPI = (data) => {
    return request({
        url: "/shop/delete-image",
        method: "POST",
        data
    });
};

export const getExportAPI = (data) => {
    return request({
        url: '/shop/order/export',
        method: 'GET',
        responseType: 'blob', // 必须设置，否则Excel损坏
        timeout: 60000
    });
};
