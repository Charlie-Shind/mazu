"use strict";
const utils_request = require("../utils/request.js");
const getCommunityTopicAPI = () => {
  return utils_request.request({
    url: "/community/getCommunityTopic",
    method: "GET"
  });
};
const getCommunityItemAPI = () => {
  return utils_request.request({
    url: "/community/getCommunityItem",
    method: "GET"
  });
};
const getCommunityItemInfoAPI = ({
  id
}) => {
  return utils_request.request({
    url: "/community/getCommunityItemInfo",
    method: "POST",
    data: {
      id
    }
  });
};
const getTopicInfoAPI = ({
  id
}) => {
  return utils_request.request({
    url: "/community/getTopicInfo",
    method: "POST",
    data: {
      id
    }
  });
};
const getCommentAPI = ({
  id
}) => {
  return utils_request.request({
    url: "/community/getComments",
    method: "POST",
    data: {
      id
    }
  });
};
const searchCommunityAPI = ({
  content
}) => {
  return utils_request.request({
    url: "/community/searchCommunity",
    method: "POST",
    data: {
      content
    }
  });
};
const uploadCommunityAPI = ({
  title,
  content,
  imageUrl,
  grid_id,
  user_id
}) => {
  return utils_request.request({
    url: "/community/uploadCommunity",
    method: "POST",
    data: {
      title,
      content,
      imageUrl,
      grid_id,
      user_id
    }
  });
};
const byIdGetCommunityAPI = (ids) => {
  return utils_request.request({
    url: "/community/byIdGetCommunity",
    method: "POST",
    data: {
      ids
    }
  });
};
const addCommentsAPI = ({
  post_id,
  user_id,
  reply_content,
  superior_id,
  comment_id,
  mainId
}) => {
  return utils_request.request({
    url: "/community/addComments",
    method: "POST",
    data: {
      post_id,
      user_id,
      reply_content,
      superior_id,
      comment_id,
      mainId
    }
  });
};
const checkMyPostCommunityAPI = ({
  user_id,
  id
}) => {
  return utils_request.request({
    url: "/community/checkMyPostCommunity",
    method: "POST",
    data: {
      user_id,
      id
    }
  });
};
const getMyPostCommunityAPI = ({
  user_id
}) => {
  return utils_request.request({
    url: "/community/getMyPostCommunity",
    method: "POST",
    data: {
      user_id
    }
  });
};
const deletePostCommunityAPI = ({
  user_id,
  id
}) => {
  return utils_request.request({
    url: "/community/deletePostCommunity",
    method: "POST",
    data: {
      user_id,
      id
    }
  });
};
exports.addCommentsAPI = addCommentsAPI;
exports.byIdGetCommunityAPI = byIdGetCommunityAPI;
exports.checkMyPostCommunityAPI = checkMyPostCommunityAPI;
exports.deletePostCommunityAPI = deletePostCommunityAPI;
exports.getCommentAPI = getCommentAPI;
exports.getCommunityItemAPI = getCommunityItemAPI;
exports.getCommunityItemInfoAPI = getCommunityItemInfoAPI;
exports.getCommunityTopicAPI = getCommunityTopicAPI;
exports.getMyPostCommunityAPI = getMyPostCommunityAPI;
exports.getTopicInfoAPI = getTopicInfoAPI;
exports.searchCommunityAPI = searchCommunityAPI;
exports.uploadCommunityAPI = uploadCommunityAPI;
//# sourceMappingURL=../../.sourcemap/mp-weixin/apis/community.js.map
