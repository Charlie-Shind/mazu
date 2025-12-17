import request from '../axios'

// 登录
export const loginAPI = ({ username, password }) => {
    return request({
        url: "/admin/adminLogin",
        method: "POST",
        data: {
            username,
            password
        }
    })
}

// 获取用户信息
export const adminGetUserInfoAPI = (id) => {
    return request({
        url: "/admin/adminGetUserInfo",
        method: "POST",
        data: {
            id
        }
    })
}

export function logout() {
    return request.post("/admin/logout")
}

export function updatepassword(data) {
    return request.post("/admin/updatepassword", data)
}