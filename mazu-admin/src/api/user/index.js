// api/user/index.js
import request from "~/axios";

// 用户列表（分页）
export const getUserListAPI = (params) => {
    return request({
        url: "/user/list",
        method: "get",
        params
    });
};

// 新增用户
export const addUserAPI = (data) => {
    return request({
        url: "/user",
        method: "post",
        data
    });
};

// 编辑用户
export const updateUserAPI = (id, data) => {
    return request({
        url: `/user/${id}`,
        method: "put",
        data
    });
};

// 删除用户
export const deleteUserAPI = (id) => {
    return request({
        url: `/user/${id}`,
        method: "delete"
    });
};

// 上传用户头像
export const uploadUserAvatarAPI = (data) => {
    return request({
        url: "/user/upload-avatar",
        method: "post",
        data,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};