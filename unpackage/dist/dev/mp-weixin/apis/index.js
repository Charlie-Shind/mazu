"use strict";
const utils_request = require("../utils/request.js");
const getCarouselAPI = () => {
  return utils_request.request({
    url: "/index/getCarousel",
    method: "GET"
  });
};
const getindexGridNewsAPI = () => {
  return utils_request.request({
    url: "/index/getindexGridNews",
    method: "GET"
  });
};
const getindexGridFuCultureAPI = () => {
  return utils_request.request({
    url: "/index/getindexGridFuCulture",
    method: "GET"
  });
};
const getindexGridFaithAPI = () => {
  return utils_request.request({
    url: "/index/getindexGridFaith",
    method: "GET"
  });
};
const getindexGridMazuCultureAPI = () => {
  return utils_request.request({
    url: "/index/getindexGridMazuCulture",
    method: "GET"
  });
};
const getindexGridPalaceTempleAPI = () => {
  return utils_request.request({
    url: "/index/getindexGridPalaceTemple",
    method: "GET"
  });
};
const getindexGridCultureCreativityAPI = () => {
  return utils_request.request({
    url: "/index/getindexGridCultureCreativity",
    method: "GET"
  });
};
const getindexGridTourismAPI = () => {
  return utils_request.request({
    url: "/index/getindexGridTourism",
    method: "GET"
  });
};
const getindexNewsItemAPI = ({
  id
}) => {
  return utils_request.request({
    url: "/index/getindexNewsItem",
    method: "POST",
    data: {
      id
    }
  });
};
const getindexFuCultureItemAPI = ({
  id
}) => {
  return utils_request.request({
    url: "/index/getindexFuCultureItem",
    method: "POST",
    data: {
      id
    }
  });
};
const getindexFaithItemAPI = ({
  id
}) => {
  return utils_request.request({
    url: "/index/getindexFaithItem",
    method: "POST",
    data: {
      id
    }
  });
};
const getindexPalaceTempleItemAPI = ({
  id
}) => {
  return utils_request.request({
    url: "/index/getindexPalaceTempleItem",
    method: "POST",
    data: {
      id
    }
  });
};
const getindexPublicationItemAPI = ({
  id
}) => {
  return utils_request.request({
    url: "/index/getindexPublicationItem",
    method: "POST",
    data: {
      id
    }
  });
};
const getindexCultureCreativityItemAPI = ({
  id
}) => {
  return utils_request.request({
    url: "/index/getindexCultureCreativityItem",
    method: "POST",
    data: {
      id
    }
  });
};
const getindexTourismItemAPI = ({
  id
}) => {
  return utils_request.request({
    url: "/index/getindexTourismItem",
    method: "POST",
    data: {
      id
    }
  });
};
exports.getCarouselAPI = getCarouselAPI;
exports.getindexCultureCreativityItemAPI = getindexCultureCreativityItemAPI;
exports.getindexFaithItemAPI = getindexFaithItemAPI;
exports.getindexFuCultureItemAPI = getindexFuCultureItemAPI;
exports.getindexGridCultureCreativityAPI = getindexGridCultureCreativityAPI;
exports.getindexGridFaithAPI = getindexGridFaithAPI;
exports.getindexGridFuCultureAPI = getindexGridFuCultureAPI;
exports.getindexGridMazuCultureAPI = getindexGridMazuCultureAPI;
exports.getindexGridNewsAPI = getindexGridNewsAPI;
exports.getindexGridPalaceTempleAPI = getindexGridPalaceTempleAPI;
exports.getindexGridTourismAPI = getindexGridTourismAPI;
exports.getindexNewsItemAPI = getindexNewsItemAPI;
exports.getindexPalaceTempleItemAPI = getindexPalaceTempleItemAPI;
exports.getindexPublicationItemAPI = getindexPublicationItemAPI;
exports.getindexTourismItemAPI = getindexTourismItemAPI;
//# sourceMappingURL=../../.sourcemap/mp-weixin/apis/index.js.map
