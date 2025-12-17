import request from "~/axios";

// 获取社区话题列表
export const getCommunityListAPI = () => {
    return request({
        url: '/community/getList',
        method: 'get'
    });
};

// 上传社区封面图
export const uploadCommunityCoverAPI = (formData) => {
    return request({
        url: '/community/uploadCover',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// 新增社区话题
export const addCommunityAPI = (data) => {
    return request({
        url: '/community/add',
        method: 'post',
        data
    });
};

// 修改社区话题
export const updateCommunityAPI = (id, data) => {
    return request({
        url: '/community/update',
        method: 'put',
        data: { id, ...data }
    });
};

// 删除社区话题
export const deleteCommunityAPI = (id) => {
    return request({
        url: '/community/delete',
        method: 'delete',
        data: { id }
    });
};