import request from '~/axios';


export const getPostListAPI = (params) => {
    return request({
        url: '/community/list',
        method: 'GET',
        params
    });
};


export const searchPostAPI = (data) => {
    return request({
        url: '/community/searchCommunity',
        method: 'POST',
        data
    });
};


export const addPostAPI = (data) => {
    return request({
        url: '/community/addPost',
        method: 'POST',
        data
    });
};


export const updatePostAPI = (data) => {
    return request({
        url: '/community/updatePost',
        method: 'POST',
        data
    });
};


export const deletePostAPI = (data) => {
    return request({
        url: '/community/deletePost',
        method: 'POST',
        data
    });
};

export const getPostDetailAPI = (data) => {
    return request({
        url: '/community/detail',
        method: 'POST',
        data
    });
};
// 帖子上传



export const uploadPostImagesAPI = (data) => {
    return request({
        url: '/community/uploadImages',
        method: 'POST',
        data,
        headers: {
            'Content-Type': 'multipart/form-data' // 表单数据类型
        }
    });
};