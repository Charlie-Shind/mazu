import request from '~/axios'
// 新闻中心
export const getindexGridNewsAPI = () => {
    return request({
        url: "/index/getindexGridNews",
        method: "GET"
    });
};

// 福文化
export const getindexGridFuCultureAPI = () => {
    return request({
        url: "/index/getindexGridFuCulture",
        method: "GET"
    });
};

// 信俗活动
export const getindexGridFaithAPI = () => {
    return request({
        url: "/index/getindexGridFaith",
        method: "GET"
    });
};

// 妈祖文化
export const getindexGridMazuCultureAPI = () => {
    return request({
        url: "/index/getindexGridMazuCulture",
        method: "GET"
    });
};

// 天下宫庙
export const getindexGridPalaceTempleAPI = () => {
    return request({
        url: "/index/getindexGridPalaceTemple",
        method: "GET"
    });
};

// 数字出版
export const getindexGridPublicationAPI = () => {
    return request({
        url: "/index/getindexGridPublication",
        method: "GET"
    });
};

// 妈祖文创
export const getindexGridCultureCreativityAPI = () => {
    return request({
        url: "/index/getindexGridCultureCreativity",
        method: "GET"
    });
};

// 两岸旅游
export const getindexGridTourismAPI = () => {
    return request({
        url: "/index/getindexGridTourism",
        method: "GET"
    });
}

// 删除图片
export const deleteImageAPI = (imageUrl, file) => {
    return request({
        url: "/admin/deleteImage",
        method: "POST",
        data: {
            imageUrl,
            file
        }
    });
}

// 修改内容接口editIndexContent
export const editIndexContentAPI = ({
    editCode,
    title,
    content,
    time,
    grid,
    imageUrl,
    id
}) => {
    return request({
        url: "/admin/editIndexContent",
        method: "POST",
        data: {
            editCode,
            title,
            content,
            time,
            grid,
            imageUrl,
            id
        }
    });
}

// 新增接口
export const insertIndexContentAPI = ({
    editCode,
    title,
    content,
    time,
    grid,
    imageUrl,
    id
}) => {
    return request({
        url: "/admin/insertIndexContent",
        method: "POST",
        data: {
            editCode,
            title,
            content,
            time,
            grid,
            imageUrl,
            id
        }
    });
}

// 删除接口deleteIndexContent
export const deleteIndexContentAPI = ({
    editCode,
    ids
}) => {
    return request({
        url: "/admin/deleteIndexContent",
        method: "POST",
        data: {
            editCode,
            ids
        }
    });
}

// 获取今日订单总数
export const getTodayOrderCountAPI = () => {
    return request({
        url: "/admin/getTodayOrderCount",
        method: "GET",
    })
}

// 获取今日用户访问总量
export const getTodayVisitCountAPI = () => {
    return request({
        url: "/admin/getTodayVisitCount",
        method: "GET",
    })
}

// 获取今日销售总额
export const getTodaySalesAPI = () => {
    return request({
        url: "/admin/getTodaySales",
        method: "GET",
    })
}

// 获取昨日销售总额
export const getSubSalesAPI = () => {
    return request({
        url: "/admin/getSubSales",
        method: "GET",
    })
}

// 获取本周销售额
export const getThisWeekSalesAPI = () => {
    return request({
        url: "/admin/getThisWeekSales",
        method: "GET"
    })
}

// 获取上周销售额
export const getLastWeekSalesAPI = () => {
    return request({
        url: "/admin/getLastWeekSales",
        method: "GET"
    })
}

// 获取当前用户 的todo
export const getTodoAPI = () => {
    return request({
        url: "/todo",
        method: "GET"
    })
}
