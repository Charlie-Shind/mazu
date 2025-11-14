"use strict";
require("../common/vendor.js");
const utils_request = require("../utils/request.js");
const getOpenIdAPI = (code) => {
  return utils_request.request({
    url: "/user/wxGetOpenId",
    method: "POST",
    data: {
      code
    }
  });
};
const wxLoginAPI = ({
  openid,
  nickname,
  avatarurl,
  gender
}) => {
  return utils_request.request({
    url: "/user/wxLogin",
    method: "POST",
    data: {
      openid,
      nickname,
      avatarurl,
      gender
    }
  });
};
const editNicknameAPI = ({
  name,
  id
}) => {
  return utils_request.request({
    url: "/user/editNickname",
    method: "POST",
    data: {
      name,
      id
    }
  });
};
const userVisitCountAPI = (userId) => {
  return utils_request.request({
    url: "/user/userVisitCount",
    method: "POST",
    data: {
      userId
    }
  });
};
const checkBalanceZeroAPI = (openid) => {
  return utils_request.request({
    url: "/user/checkBalanceZero",
    method: "POST",
    data: {
      openid
    }
  });
};
const addBalanceAPI = (openid) => {
  return utils_request.request({
    url: "/user/addBalance",
    method: "POST",
    data: {
      openid
    }
  });
};
const signInAPI = (openid) => {
  return utils_request.request({
    url: "/user/signIn",
    method: "POST",
    data: {
      openid
    }
  });
};
const getContinuousSignInDaysAPI = (openid) => {
  return utils_request.request({
    url: "/user/getContinuousSignInDays",
    method: "POST",
    data: {
      openid
    }
  });
};
const visitCountAPI = () => {
  return utils_request.request({
    url: "/user/visitCount",
    method: "POST"
  });
};
exports.addBalanceAPI = addBalanceAPI;
exports.checkBalanceZeroAPI = checkBalanceZeroAPI;
exports.editNicknameAPI = editNicknameAPI;
exports.getContinuousSignInDaysAPI = getContinuousSignInDaysAPI;
exports.getOpenIdAPI = getOpenIdAPI;
exports.signInAPI = signInAPI;
exports.userVisitCountAPI = userVisitCountAPI;
exports.visitCountAPI = visitCountAPI;
exports.wxLoginAPI = wxLoginAPI;
//# sourceMappingURL=../../.sourcemap/mp-weixin/apis/user.js.map
