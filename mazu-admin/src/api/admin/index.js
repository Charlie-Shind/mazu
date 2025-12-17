import request from '~/axios'

// 查询所有管理员
export const getAdminListAPI = () => {
    return request({
        url: "/admin/list",
        method: "get"
    });
};

// 根据ID查询单个管理员
export const getAdminByIdAPI = (id) => {
    return request({
        url: `/admin/${id}`,
        method: "get"
    });
};

// 新增管理员
export const addAdminAPI = (data) => {
    return request({
        url: "/admin",
        method: "post",
        data
    });
};

// 修改管理员
export const updateAdminAPI = (id, data) => {
    return request({
        url: `/admin/${id}`,
        method: "put",
        data
    });
};

// 删除管理员
export const deleteAdminAPI = (id) => {
    return request({
        url: `/admin/${id}`,
        method: "delete"
    });
};

// 提交用户头像
export const uploadAdminAvatarAPI = (formData) => {
    return request({
        url: `/admin/uploadAvatar`,
        method: "post",
        data: formData,

    });
};

// 添加待办事项
export const addTodoAPI = (data) => {
    return request({
        url: '/todo',
        method: 'post',
        data
    });
};