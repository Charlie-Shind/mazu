import request from '~/axios'

// 分页获取数据
export const getAllPraysAPI = (params) => {
    return request({
        url: "/prays/getAllPrays",
        method: "GET",
        params
    })
}

// 新增数据
export const addPraysDataAPI = (data) => {
    return request({
        url: "/prays/addPraysData",
        method: "POST",
        data
    })
}

// 删除数据
export const deletePraysDataAPI = (data) => {
    return request({
        url: "/prays/deletePraysData",
        method: "POST",
        data
    })
}

// 修改数据
export const updatePraysDataAPI = (data) => {
    return request({
        url: "/prays/updatePraysData",
        method: "POST",
        data
    })
}
export const uploadPraysImageAPI = (data) => {
    return request({
        url: "/prays/getPraysData",
        method: "POST",
        data
    })
}