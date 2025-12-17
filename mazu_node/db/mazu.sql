/*
 Navicat Premium Dump SQL

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80042 (8.0.42)
 Source Host           : localhost:3306
 Source Schema         : mazu

 Target Server Type    : MySQL
 Target Server Version : 80042 (8.0.42)
 File Encoding         : 65001

 Date: 18/12/2025 00:47:52
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin_user
-- ----------------------------
DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE `admin_user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `imageUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '头像',
  `roles` int NOT NULL COMMENT '权限',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin_user
-- ----------------------------
INSERT INTO `admin_user` VALUES (5, 'admin1', '123456', 'http://127.0.0.1:8889/admin/img-1762861550145-43cb12cb27b6b3e2.jpg', 1);
INSERT INTO `admin_user` VALUES (9, 'user', '123456', '', 1);

-- ----------------------------
-- Table structure for ai_image_generate
-- ----------------------------
DROP TABLE IF EXISTS `ai_image_generate`;
CREATE TABLE `ai_image_generate`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `generate_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '生成类型（如妈祖IP）',
  `style` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '风格（如卡通风格）',
  `extra_demand` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '额外需求',
  `image_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '图片URL',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'AI图片生成记录表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ai_image_generate
-- ----------------------------
INSERT INTO `ai_image_generate` VALUES (1, 1, '妈祖IP', '卡通风格', '添加千里眼顺风耳元素', 'https://javaweb-ai-ch.oss-cn-beijing.aliyuncs.com/2025/11/妈祖IP_3406783e-3556-42bb-a4a6-ac5874440eb9.png', '2025-11-27 20:45:32');
INSERT INTO `ai_image_generate` VALUES (2, 1, '妈祖IP', '卡通风格', '添加千里眼顺风耳元素', 'https://javaweb-ai-ch.oss-cn-beijing.aliyuncs.com/2025/11/妈祖IP_c3127b2e-d813-45c6-98ac-5218ddc28f3e.png', '2025-11-27 21:20:18');
INSERT INTO `ai_image_generate` VALUES (3, 1, '平安福要有平安顺利', '卡通风格', '添加千里眼顺风耳元素', 'https://javaweb-ai-ch.oss-cn-beijing.aliyuncs.com/2025/11/平安福要有平安顺利_74ef79f9-57ea-44e8-b0a1-9cf5ca97f8e3.png', '2025-11-27 21:22:01');
INSERT INTO `ai_image_generate` VALUES (4, 1, '平安福', '卡通风格', '平安福要有平安顺利', 'https://javaweb-ai-ch.oss-cn-beijing.aliyuncs.com/2025/11/平安福_8c78b5fc-c9da-4fc8-bb4c-081bfef8a930.png', '2025-11-27 21:24:21');

-- ----------------------------
-- Table structure for community_comments
-- ----------------------------
DROP TABLE IF EXISTS `community_comments`;
CREATE TABLE `community_comments`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '评论id',
  `post_id` int NOT NULL COMMENT '帖子id',
  `user_id` int NOT NULL COMMENT '用户id',
  `reply_content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '回复内容',
  `reply_time` datetime NOT NULL COMMENT '回复时间',
  `superior_id` int NULL DEFAULT NULL COMMENT '上级id',
  `comment_id` int NULL DEFAULT NULL COMMENT '上级评论id',
  `mainId` int NULL DEFAULT NULL COMMENT '最顶级评论id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 125 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of community_comments
-- ----------------------------
INSERT INTO `community_comments` VALUES (81, 51, 1, '一级根评论（清表后重新创建）', '2025-11-20 00:39:38', NULL, NULL, 81);
INSERT INTO `community_comments` VALUES (82, 51, 1, '二级评论，回复一级根评论（ID=100）', '2025-11-20 00:40:29', 81, 100, 100);
INSERT INTO `community_comments` VALUES (83, 51, 1, '三级评论，回复一级根评论（ID=100）', '2025-11-20 00:43:17', 82, 100, 100);
INSERT INTO `community_comments` VALUES (84, 51, 1, '三级评论，回复一级根评论（ID=100）', '2025-11-20 00:43:48', 83, 100, 100);
INSERT INTO `community_comments` VALUES (86, 51, 1, '测试', '2025-11-20 01:37:57', NULL, NULL, 86);
INSERT INTO `community_comments` VALUES (104, 50, 11, '123', '2025-11-20 02:07:49', NULL, NULL, 104);
INSERT INTO `community_comments` VALUES (105, 50, 11, '1236', '2025-11-20 02:07:51', NULL, NULL, 105);
INSERT INTO `community_comments` VALUES (106, 50, 11, '123', '2025-11-20 02:07:57', NULL, NULL, 106);
INSERT INTO `community_comments` VALUES (107, 50, 11, '1236', '2025-11-20 02:08:00', NULL, NULL, 107);
INSERT INTO `community_comments` VALUES (108, 50, 11, '1236', '2025-11-20 02:09:54', NULL, NULL, 108);
INSERT INTO `community_comments` VALUES (109, 50, 11, '1236', '2025-11-20 02:10:27', NULL, NULL, 109);
INSERT INTO `community_comments` VALUES (110, 51, 11, '1236', '2025-11-20 02:14:38', NULL, NULL, 110);
INSERT INTO `community_comments` VALUES (111, 50, 11, '1236', '2025-11-20 02:16:18', NULL, NULL, 111);
INSERT INTO `community_comments` VALUES (112, 51, 11, '1236', '2025-11-20 02:18:40', NULL, NULL, 112);
INSERT INTO `community_comments` VALUES (113, 51, 11, '1236', '2025-11-20 02:22:57', NULL, NULL, 113);
INSERT INTO `community_comments` VALUES (114, 50, 11, '1236', '2025-11-20 02:24:24', NULL, NULL, 114);
INSERT INTO `community_comments` VALUES (115, 50, 11, '1236', '2025-11-20 02:24:30', NULL, NULL, 115);
INSERT INTO `community_comments` VALUES (116, 50, 11, '1236', '2025-11-20 02:25:27', NULL, NULL, 116);
INSERT INTO `community_comments` VALUES (117, 50, 11, '1236', '2025-11-20 02:28:01', NULL, NULL, 117);
INSERT INTO `community_comments` VALUES (119, 51, 11, '123', '2025-11-20 02:31:49', NULL, NULL, 119);
INSERT INTO `community_comments` VALUES (120, 51, 11, '1236', '2025-11-20 02:32:50', NULL, NULL, 120);
INSERT INTO `community_comments` VALUES (121, 51, 1, '测试', '2025-11-20 02:34:34', 119, NULL, 100);
INSERT INTO `community_comments` VALUES (122, 51, 11, '1236', '2025-11-20 02:34:41', NULL, NULL, 122);
INSERT INTO `community_comments` VALUES (123, 51, 1, '测试', '2025-11-20 02:36:21', 122, NULL, 122);
INSERT INTO `community_comments` VALUES (124, 50, 11, '1236', '2025-11-20 02:38:11', NULL, NULL, 124);

-- ----------------------------
-- Table structure for community_post
-- ----------------------------
DROP TABLE IF EXISTS `community_post`;
CREATE TABLE `community_post`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '帖子id',
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL COMMENT '帖子内容',
  `imageUrl` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL COMMENT '内容图片',
  `grid_id` int NULL DEFAULT NULL COMMENT '话题分类id',
  `time` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '发布时间',
  `user_id` int NULL DEFAULT NULL COMMENT '用户id',
  `status` int NULL DEFAULT NULL COMMENT '0是违规1是正常',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 52 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of community_post
-- ----------------------------
INSERT INTO `community_post` VALUES (47, '1', '1111', '[\"http://127.0.0.1:8889/community/post/images-1763120808259-8a76af09014388e3.jpg\",\"http://127.0.0.1:8889/community/post/images-1763121367279-3f2cdcce68c2c0e8.jpg\",\"http://127.0.0.1:8889/community/post/images-1763121584714-89eefac432b71212.jpg\",\"http://127.0.0.1:8889/community/post/images-1763192029994-fa331b70c374d051.png\"]', 1, '2025-11-14 19:46:49', 2, 1);
INSERT INTO `community_post` VALUES (48, '5', '11', '[\"http://127.0.0.1:8889/community/post/images-1763186073915-33ce9b59f27b053e.png\",\"http://127.0.0.1:8889/community/post/images-1763191057646-d5bd94810ff10fb5.png\",\"http://127.0.0.1:8889/community/post/images-1763192049054-3e0d6803d36faf70.png\"]', 1, '2025-11-15 13:54:35', NULL, 1);
INSERT INTO `community_post` VALUES (49, '11', 'ww ', '[\"http://127.0.0.1:8889/community/post/images-1763192105314-87c80f7579167481.png\"]', 1, '2025-11-15 15:35:07', NULL, 1);
INSERT INTO `community_post` VALUES (50, '10', '2522', '[\"http://127.0.0.1:8889/community/post/images-1763192512321-1020e05dd2bafbe3.png\",\"http://127.0.0.1:8889/community/post/images-1763194451402-18c6c102082964bc.png\"]', 1, '2025-11-15 15:41:54', 10, 1);
INSERT INTO `community_post` VALUES (51, '你好', '<p>你好</p>', '[\"http://127.0.0.1:8889/community/post/img-1763567909690-748510a28deb4a69.png\"]', 1, '2025-11-19 15:58:37', 11, NULL);

-- ----------------------------
-- Table structure for community_topic
-- ----------------------------
DROP TABLE IF EXISTS `community_topic`;
CREATE TABLE `community_topic`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '话题名称',
  `cover` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '话题封面图',
  `description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '话题描述',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of community_topic
-- ----------------------------
INSERT INTO `community_topic` VALUES (1, '湄洲岛妈祖庙1', 'http://127.0.0.1:8889/community/post/cover-1762953499797-65e013a4debd17f1.jpg', '妈祖庙，即“湄洲妈祖祖庙”，位于福建省莆田市湄洲岛，始建于北宋雍熙四年（987年），是妈祖文化的起源地。', '2025-11-12 20:58:20');
INSERT INTO `community_topic` VALUES (2, '非遗小知识', 'http://139.159.229.212:8889/community/post/29.jpg', '作为我国传统文化的重要载体，“非遗”体现着中国智慧，承载着中国价值，凝聚着中国精神，它所蕴涵的独特民族精神和丰富的文化内涵，散发着中华民族文化的独特魅力。', '2025-11-12 20:58:20');
INSERT INTO `community_topic` VALUES (3, '妈祖文化讨论区', 'http://139.159.229.212:8889/community/post/7.jpg', '妈祖文化是劳动人民千百年来尊崇、信仰妈祖过程中遗留和传承下来的物质及精神财富的总称，是中华民族传统文化的瑰宝 。', '2025-11-12 20:58:20');
INSERT INTO `community_topic` VALUES (4, '妈祖庙宇交流区', 'http://139.159.229.212:8889/community/post/37.jpg', '洲妈祖祖庙是世界上第一座妈祖庙，现存建筑多为清代结构，妈祖庙建筑群以前殿为中轴线布局，依山势而建，形成了纵深300米、高差40余米的主庙道，从山门、仪门到正殿由323级台阶连缀两旁的各组建筑。', '2025-11-12 20:58:20');
INSERT INTO `community_topic` VALUES (6, '11', 'http://127.0.0.1:8889/community/post/cover-1763110794500-54989f9b0a7fb2e6.png', '1111111', '2025-11-14 17:00:01');

-- ----------------------------
-- Table structure for index_carousel
-- ----------------------------
DROP TABLE IF EXISTS `index_carousel`;
CREATE TABLE `index_carousel`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `imageUrl` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `text` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of index_carousel
-- ----------------------------
INSERT INTO `index_carousel` VALUES (1, 'http://139.159.229.212:8889/index/carousel/back.jpg', NULL);
INSERT INTO `index_carousel` VALUES (2, 'http://139.159.229.212:8889/index/carousel/back2.jpg', NULL);

-- ----------------------------
-- Table structure for index_creativity
-- ----------------------------
DROP TABLE IF EXISTS `index_creativity`;
CREATE TABLE `index_creativity`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `imageUrl` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `text` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `award` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `url` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of index_creativity
-- ----------------------------
INSERT INTO `index_creativity` VALUES (1, 'http://139.159.229.212:8889/index/creativity/1.jpg', '妈祖祖天后宫夜景', '第三届全球妈祖文化摄影大赛二等奖', NULL);
INSERT INTO `index_creativity` VALUES (2, 'http://139.159.229.212:8889/index/creativity/2.jpg', '霞浦县沙江镇竹江村妈祖出巡走水抢神轿', '第三届全球妈祖文化摄影大赛一等奖', NULL);

-- ----------------------------
-- Table structure for index_grid_culturecreativity
-- ----------------------------
DROP TABLE IF EXISTS `index_grid_culturecreativity`;
CREATE TABLE `index_grid_culturecreativity`  (
  `id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL COMMENT '内容',
  `time` datetime NULL DEFAULT NULL COMMENT '时间',
  `imageUrl` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '图片',
  `grid` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '分类',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of index_grid_culturecreativity
-- ----------------------------
INSERT INTO `index_grid_culturecreativity` VALUES (1, '霞浦县沙江镇竹江村妈祖出巡走水抢神轿', '<p>第三届全球妈祖文化摄影大赛一等奖：霞浦县沙江镇竹江村妈祖出巡走水抢神轿</p>', '2018-08-22 02:01:02', '[\"http://139.159.229.212:8889/index/grid/cultureCreativity/20180822100333355.jpg\"]', '摄影作品');
INSERT INTO `index_grid_culturecreativity` VALUES (2, '马祖天后宫夜景\r\n', '<p>第三届全球妈祖文化摄影大赛二等奖： 马祖天后宫夜景</p>', '2019-07-19 01:19:17', '[\"http://139.159.229.212:8889/index/grid/cultureCreativity/20190719092042591.jpg\"]', '摄影作品');
INSERT INTO `index_grid_culturecreativity` VALUES (3, '捕捉天后宫之美', '<p>第三届全球妈祖文化摄影大赛二等奖：捕捉天后宫之美</p>', '2019-07-19 01:23:13', '[\"http://139.159.229.212:8889/index/grid/cultureCreativity/20190719092433249.jpg\"]', '摄影作品');
INSERT INTO `index_grid_culturecreativity` VALUES (4, '跑銮', '<p>第三届全球妈祖文化摄影大赛二等奖：跑銮</p>', '2019-07-19 01:26:19', '[\"http://139.159.229.212:8889/index/grid/cultureCreativity/20190719092743731.jpg\"]', '摄影作品');

-- ----------------------------
-- Table structure for index_grid_faith
-- ----------------------------
DROP TABLE IF EXISTS `index_grid_faith`;
CREATE TABLE `index_grid_faith`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL COMMENT '内容',
  `time` datetime NULL DEFAULT NULL COMMENT '时间',
  `imageUrl` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '图片',
  `grid` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '分类',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of index_grid_faith
-- ----------------------------
INSERT INTO `index_grid_faith` VALUES (1, '【2021·妈祖诞】诗歌颂妈祖（第十五期）', '<p>马来西亚 &nbsp;颜见式</p><p>七言绝句 &nbsp;纪念妈祖诞辰1060周年</p><p><br></p><p>坤仪圣迹湄洲始，</p><p>忠孝芳猷启万民。</p><p>沧海明灯消苦难，</p><p>垂慈济众不辞辛。</p><p><br></p><p>辽宁 &nbsp;冯忠臣</p><p> &nbsp;妈祖</p><p><br></p><p>一</p><p>内心的灵光相互映衬、照亮</p><p>一种暖凿透时光的墙，代代传承、延续</p><p>绵绵不断的敬仰与敬畏，在心头舞蹈</p><p>情有多长，爱就有多远</p><p>未曾谋面，却又无处不在</p><p>一种护佑在血液里游荡</p><p>香火不断，思念无期</p><p>江海湖泊信息暗通</p><p>让血脉紧紧相连，不离不弃</p><p>共同的欢乐和痛苦</p><p>汩汩流淌在身体的角角落落</p><p>远古和未来一直受到某种神谕的引领</p><p>漂泊天涯和海角，灵魂会相互印证</p><p>漂浮的时光，摇曳的星斗</p><p>涉水一族骨子里隐秘深奥、大美</p><p>爱打开了心扉、洞开了心灵</p><p>如果大风骤起，巨浪滔天</p><p>也不会惊颜失色，心灵的力量怎能战胜</p><p><br></p><p>二</p><p>蓝天。大海。鸥语。白云</p><p>赶海人心里揣着至高的信仰</p><p>一种暖让他们心地洁净</p><p>沉默寡言却有蓬勃的力量</p><p>粗砺的海边人都有细腻绵长的情谊</p><p>飞翔的浪花，歌唱的潮水，舞蹈的海鸟</p><p>拥抱着安详的渔村</p><p>好一幅淡淡的水粉画，恬淡唯美</p><p>海边人独有的情愫，让多少人着迷沉醉</p><p>海天一览。谁会走进弄潮儿情感的深处旅行</p><p>静美。博大。定居心坎的神</p><p>像阳光平淡、柔美默默给予</p><p>普照。没有心的死角</p><p>哺育博爱的幼芽扎根思想的沃野</p><p>荫佑一方水土，滋养一方人文</p><p><br></p><p>三</p><p>一滴乳汁穿越千年的隧道</p><p>散发清纯的香味</p><p>文化是抹不掉的胎记</p><p>这片土地上的人们</p><p>有了精神皈依的家园</p><p>万顷碧波，荡漾着霞光金色的波纹</p><p>瑞气升腾，祥光环绕</p><p>血脉的潮汐一波一波推进、扩展</p><p>面对无际的大海，内心一位神秘的使者</p><p>生生相伴，不离不弃</p>', '2021-05-14 02:30:54', '[\"http://www.mazuworld.com/uploadfile/2021/0514/20210514091954805.png\"]', '妈祖诞辰');
INSERT INTO `index_grid_faith` VALUES (2, '【2021·妈祖诞】摄影颂妈祖（第十五期）\r\n', ' ', '2021-05-14 10:22:37', '[\"http://www.mazuworld.com/uploadfile/2021/0514/20210514102407382.jpg\"]', '妈祖诞辰');
INSERT INTO `index_grid_faith` VALUES (3, '【2021·妈祖诞】书画颂妈祖（第十五期）\r\n', ' ', '2021-05-14 10:25:35', '[\"http://www.mazuworld.com/uploadfile/2021/0514/20210514102820482.png\"]', '妈祖诞辰');
INSERT INTO `index_grid_faith` VALUES (4, '【2021·妈祖诞】摄影颂妈祖（第十四期）\r\n', ' ', '2021-05-14 09:33:56', '[\"http://www.mazuworld.com/uploadfile/2021/0514/20210514093509515.jpg\"]', '妈祖诞辰');
INSERT INTO `index_grid_faith` VALUES (5, '【2021.妈祖诞】书画颂妈祖（第十三期）\r\n', ' ', '2021-05-10 16:12:39', '[\"http://www.mazuworld.com/uploadfile/2021/0510/20210510041939278.jpg\"]', '妈祖诞辰');
INSERT INTO `index_grid_faith` VALUES (6, '【2021·妈祖诞】摄影颂妈祖（第十三期）\r\n', ' ', '2021-05-10 16:10:14', '[\"http://www.mazuworld.com/uploadfile/2021/0510/20210510041137582.png\"]', '妈祖诞辰');

-- ----------------------------
-- Table structure for index_grid_fuculture
-- ----------------------------
DROP TABLE IF EXISTS `index_grid_fuculture`;
CREATE TABLE `index_grid_fuculture`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '标题',
  `content` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '内容',
  `time` datetime NULL DEFAULT NULL COMMENT '时间',
  `imageUrl` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL COMMENT '图片',
  `grid` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '分类',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of index_grid_fuculture
-- ----------------------------
INSERT INTO `index_grid_fuculture` VALUES (1, '【祖地】一人两姓', '<p>本片以漳州官陂张廖姓氏清明祭祖盛典为脉络，讲述两岸张廖姓氏一人两姓的特殊渊源，弘扬两岸一脉相承的浓烈情缘。</p>', '2023-10-25 10:42:57', '[\"http://www.mazuworld.com/uploadfile/2023/1026/20231026113221757.jpg\",\"http://www.mazuworld.com/uploadfile/2023/1026/20231026113238129.jpg\",\"http://www.mazuworld.com/uploadfile/2023/1026/20231026113238129.jpg\",\"http://www.mazuworld.com/uploadfile/2023/1026/20231026113238129.jpg\"]', '福文化');
INSERT INTO `index_grid_fuculture` VALUES (2, '【祖地】青阳石鼓蔡\r\n', '<p> 以两岸青阳蔡氏宗亲共同守护祖地的故事为核心，借助台湾蔡氏知名人士回乡祭祖的影响力，依托晋江五店市传统街区中保留了两岸共同的曲艺形式和建筑风格等元素，展现两岸蔡氏家族共同守护精神家园的祖地情缘。</p>', '2023-07-21 02:39:00', '[\"http://www.mazuworld.com/uploadfile/2023/1026/20231026112002664.jpg\"]', '福文化');
INSERT INTO `index_grid_fuculture` VALUES (3, '【祖地】花开两岸宋江阵\r\n', '<p> 以宋江阵为代表的地方阵头文化源自福建为核心，依托海峡两岸宋江阵表演，展示宋江阵的传承发展，弘扬宋江阵传承人守护民族武艺，捍卫民族精神，为中华民族复兴殚精竭虑的气节。</p>', '2023-10-26 02:40:18', '[\"http://www.mazuworld.com/uploadfile/2023/1026/20231026113130892.jpg\"]', '福文化');
INSERT INTO `index_grid_fuculture` VALUES (4, '【祖地】海上花园\r\n', '<p> 以蟳埔老人和年轻人两代两岸婚姻故事为核心，借助代表蟳埔村特色的传统服饰、头饰,展现当地闽台对婚姻的坚贞不渝和两岸之间无法隔断的地缘、血缘情结。</p>', '2023-10-26 02:37:47', '[\"http://www.mazuworld.com/uploadfile/2023/1026/20231026113037182.jpg\"]', '福文化');
INSERT INTO `index_grid_fuculture` VALUES (5, '【祖地】爷爷泡的茶\r\n', '<p> 依托周杰伦的爷爷是永春人的事实，结合永春佛手茶、永春白鹤拳,凸显周杰伦中国风的音乐创作灵感来源永春，揭露周杰伦的身世之谜。同时叙述台湾周氏宗亲回乡认祖的故事，结合同样和台湾有着密切关系的余光中，讲述两岸周氏姓氏的源远流长，唤起台湾周姓以及周杰伦粉丝回大陆祖地祭祖寻根的情结。</p>', '2023-01-09 02:27:00', '[\"http://www.mazuworld.com/uploadfile/2023/1026/20231026104720512.jpg\"]', '福文化');
INSERT INTO `index_grid_fuculture` VALUES (6, '【祖地】一脉香承\r\n', '<p> 依托“中国香都”——永春百年来的传统手工制香技艺、千年来的香道文化，传达永春人民对香火的重视和传承，表现两岸亘古不变的香火延续，展现闽台两岸地缘近、血缘亲、文缘深、商缘广、法缘久的“五缘”情结。</p>', '2023-03-24 02:37:00', '[\"http://www.mazuworld.com/uploadfile/2023/1026/20231026111342802.jpg\"]', '福文化');

-- ----------------------------
-- Table structure for index_grid_mazuculture
-- ----------------------------
DROP TABLE IF EXISTS `index_grid_mazuculture`;
CREATE TABLE `index_grid_mazuculture`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL COMMENT '内容',
  `time` datetime NULL DEFAULT NULL COMMENT '时间',
  `imageUrl` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '图片',
  `grid` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '分类',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of index_grid_mazuculture
-- ----------------------------
INSERT INTO `index_grid_mazuculture` VALUES (1, '显神威擒获贼酋', '<p>宋孝宗淳熙十年(1183年)，温台两府苹寇猖獗，杀人放火，为患地方，官军难以抵挡。福建都巡检姜特立奉命征剿，官舟齐集，但贼兵人多势众，船多如蚁，集于水面，旌旗如云，喊声震天，官兵闻之惧悚，不敢向前。姜特立唯有向天祷告：“海各神灵，只有神女威灵显赫，乞望神女保佑。”祷告刚完，即隐隐见到妈祖立于云端，贼寇大骇；官兵军威大振，士气如虹，乘风顺流出击。贼船在右，官兵挥棹击之，擒获贼酋，并擒其党，余舟四散，官军凯旋而归!宋孝宗皇帝闻奏加封“灵惠昭应崇福善利夫人”。</p>', '2017-05-31 07:08:27', '[\"http://www.mazuworld.com/uploads/allimg/c120425/1335332305P-1T044.jpg\"]', '妈祖传说');
INSERT INTO `index_grid_mazuculture` VALUES (2, '战晏公投绳缚妖', '<p>晏公面如黑漆，浓眉横髯，被默娘收服的千里目与顺风耳就是晏公的手下。他本为水神，却纵容手下为害江湖，虽为默娘所收伏，却不改本性，浮海为怪，毁船沉舟，为害商渔，默娘自然不会放过。她驾轻舟巡游东海，找寻晏公，与之大战一场。晏公不敌败下，但仍不服，幻化神龙，兴风作浪，再来相犯。默娘投下神绳，随投随粘，牢固难解，晏公才惧而伏罪。默娘收为部下，命为总管并嘱咐他：“东海险恶，你今统领水族诸班救民危厄!”</p>', '2017-05-31 07:07:12', '[\"http://www.mazuworld.com/uploads/120524/3-12052410494V16.jpg\"]', '妈祖传说');
INSERT INTO `index_grid_mazuculture` VALUES (3, '莆仙戏', '<p>莆仙戏原名兴化戏，是福建省五大地方剧种之一，也是我国最古老的剧种之一，它流行于莆仙方言区，并流播新加坡、马来西亚等东南亚莆仙华侨聚居地。莆仙戏是从唐代的百戏演变来的，成于宋、盛于明清、光大于现代，至今仍流行于莆仙城乡。它表演古朴优雅，不少动作深受木偶戏的影响，富有独特的艺术风格。其唱腔丰富，综合了莆仙的民间歌谣俚曲、十音八乐、佛道法曲、宋元词曲和大曲歌舞的艺术特点，用莆仙方言演唱，具有浓厚地方色彩。莆仙戏现存传统剧目近5000个，舞台手抄本8000多册，已整理正式出版的有《莆仙戏传统剧目丛书》23卷。莆仙戏传统剧目、音乐曲牌、角色行当等都与南戏有着密切的关系。据统计，现有剧目中，保留宋元南戏原貌或故事情节基本类似的剧目有81个，有剧本流传的有58个，约占目前已知的宋元南戏剧目244个的近四分之一。因此，莆仙戏被誉为“宋元南戏活化石”，2006年被列入国家级《非物质文化遗产名录》。<br></p><p><br></p><p> &nbsp; &nbsp;莆仙戏的角色行当大致分为：生、旦、靓妆、末和丑。服装、化装和道具都独具特色。脸谱化妆有红、白、黑、蓝、绿、金各色，不同角色颜色不同。表演基本功集中在手、步、肩三个部分，要求头、身、腰的配合。莆仙戏的音乐内容十分丰富，素有“大题三百六，小题七百二”之说，有一千多个音乐曲牌和300多种锣鼓经，这是其他剧种所不及的。乐器保留有宋代教坊的“锣、鼓、吹”的伴奏形式。近年来，莆仙戏又吸收了民间的“十音八乐”元素，音乐更加美妙动听。</p>', '2019-01-22 01:09:17', '[\"http://www.mazuworld.com/uploadfile/2019/0114/20190114024139241.jpg\",\"http://www.mazuworld.com/uploadfile/2019/0122/20190122091701883.jpg\"]', '妈祖非遗');
INSERT INTO `index_grid_mazuculture` VALUES (4, '洞头东沙——迎火鼎', '<p>东沙村位于浙江温州洞头本岛东北部的东沙港内，距温州市区64公里。全村辖6个自然村，常住家户316户，2005前属北沙乡政府管辖，目前隶属北岙镇，距镇政府驻地2.6公里。村前即为东沙港，史上曾为浙南沿海一带岛屿商埠，是来自广东、福建、浙江、江苏等地渔船的贸易与补给点。该村坐西北朝东南，三面靠山，一面临海。每当渔船抛锚此处，渔船、岛礁、蓝天、榕树、浪花等景色构画出浓郁的海域特征。<br></p><p> &nbsp; &nbsp;渔业生产是东沙村传统产业。自古以来，村民以渔业养殖捕捞为基础，以贩鲜、鱼产品加工为辅助产业。作为渔业生产村，海上平安女神妈祖信仰自然成了该村独有的妈祖文化现象，其每年一度的“迎火鼎”活动，成了极具海岛特色的民俗现象。 <br></p><p> &nbsp; &nbsp;东沙村妈祖宫“迎火鼎”活动源自闽南，传承中融入了抗击海盗等诸多要素。据传有年除夕，停在渔港内的100多艘渔船都点亮桅灯，不料在燃放鞭炮时，火花落在港口的龟屿头与蛇鼻尾的两个山头上，燃起熊熊大火。这时，有两艘准备偷袭的海盗船，见到两边山上的熊熊野火和港内的一片灯光，以为有了戒备，乘势慌忙溜走。后来村民得知此事，都认为是妈祖神显灵，使村民免遭一劫。为了对妈祖神的感恩，预祝在新的一年里平安消灾，便创意衍生了“迎火鼎”活动。“迎”字在闽南语中有两个含义：一是“高高举起”之意，二是“迎接”之意。“火”有“红红火火、岁岁兴旺”之意，“鼎”有“鼎盛康乐”之意。“迎火鼎”突出在火与锅的表现仪式和丰富的内涵意义上，整个活动以妈祖神为主体，以火锅为中心。这种创意性的民俗活动，自东沙村妈祖宫发端至今，已流传了两百多年。<br></p><p> &nbsp; &nbsp;“迎火鼎”仪式安排：<br></p><p>　　1.卜卦择日 <br></p><p>　　正月开正后，先卜卦求得妈祖的同意，再根据择定的日子确定“迎火鼎”的具体日子，通常三至五天，出迎时间为下午五六点至晚上10点左右。出迎路线：为洞头本岛东屏、北岙两镇所辖东沙、柴岙、大龙岭、中仑、东岙、洞头、小区、北岙、九厅等村落。 <br></p><p>　　2.出“迎”队伍方阵 <br></p><p>　　(1)大锣与令旗：前头是八门大锣、一面大龙旗和五面五彩旗，旗上各挂一盏红灯笼；由大锣鸣锣开道，旗子引路。 <br></p><p>　　(2)火鼎与柴担：由两个男子抬着一个燃火的大铁锅，后边除跟有柴担挑夫外，两旁紧跟着一对男女装扮的“火锅公和火锅婆”，随队伍巡游；其作用除增添喜庆气氛之外，还给求子之家添“钳柴枯(火炭)”。闽南语“钳柴枯，生大哺”，意即谁家钳入柴枯(火炭)，谁家即能得子之意。 <br></p><p>　　(3)凤辇、娘伞、妈祖轿、大鼓：凤辇内放置香炉，由沿途信众将家中三支燃香插入凤辇内的香炉并从香炉中取回另外三支燃香，以示得到妈祖的佑护；画有吉祥龙的图案的五彩娘伞上，写有“风调雨顺”字样，由专人举擎，或将娘伞柄绑在凤辇后边，由人抬着；妈祖轿内坐有妈祖神像，有灯光照明，其后还有一对由男女青年装扮的古典戏剧人物，称为善才圣女，代表吉祥如意。轿门前有女司仪，由当地佛界有名望女子担任，沿途负责协助信众工作；大鼓，主要为敲打之用，增添热闹威严气氛。 <br></p><p>　　(4)秧歌队：主要由东沙村、大王殿村、柴岙村等三个自然村秧歌队组成，服装等各村有所差异，现代气息浓烈。 <br></p><p>　　(5)杂耍队：最能够表现渔民生活愿望的一组方阵，人员着各种戏文人物服饰，主要为关帝爷、招财爷、“桃园三结义”的刘关张、许仙和白娘子、唐三藏师徒四人、“八仙过海”人物、闹海哪吒、关云长、萧何与韩信、活佛济公、凤还巢(李太后回宫)、王昭君、包拯、梁山伯与祝英台等人物服饰。1949年以前，队伍中还有乞丐等残疾人员，而且关公压尾阵排在最后边。行进中，这支方阵尽情进行各式表演，例如“舞火球”，即用铁丝编成网囊，夹入火炭，系上一定长度的绳子，用手抓着绳子的一端，左右、前后挥舞；还有的用油菜或芥菜的杆连头，在菜头上挖一个凹洞，用棉花或废布料拈油塞入凹洞内点燃起来，相互甩耍逗乐，谓之“火斗”。 <br></p><p>　　(6)铜鼓队：就是敲打铜鼓的方阵，主要根据行进中的需要来敲打乐鼓内容与节奏。 <br></p><p>　　(7)红灯队：是“迎火鼎”队伍最后一个阵队，主要由三个村的信众组成，他们手拿太平灯，蕴含闹元宵之义，边走边喊“迎灯迎龙，平安太平(闽南语)”。祈愿保佑各方新一年平安吉祥。 </p>', '2019-01-14 06:40:59', '[\"http://www.mazuworld.com/uploadfile/2019/0122/20190122091612928.jpg\"]', '妈祖非遗');
INSERT INTO `index_grid_mazuculture` VALUES (5, '救父兄大海驰神\r\n', '<p> 一日，默娘父亲和兄长驾舟出海，她与母亲在家中织布，忽然伏于机上，一手紧持织梭，一手牢握机纾，神情惊异，大汗淋漓，似有所持而恐有所失之状。其母见状，觉得惊异，将其推醒，默娘忽从梦中惊醒，织梭坠地，哭泣哀恸，悲痛不已。母问原因，默娘说：“父兄出海，遭遇台风，破船沉舟，父得保全，兄已殁了!”不久，其父归来述说，当时大风骤至，惊涛如山，即将倾覆之际，似有人紧把舵向，欲使其脱险。原来是默娘驰神海上，一手把住父舟之舵，另一手把住兄舟之舵，助其脱险，可惜母亲不知原故，将其推醒，使织梭脱手，以致兄长所驾之船为浪所噬。 </p>', '2017-05-31 07:09:12', '[\"http://www.mazuworld.com/uploads/allimg/c120425/133533145T60-1K45.jpg\"]', '妈祖传说');
INSERT INTO `index_grid_mazuculture` VALUES (6, '破两嘉四境平安\r\n', '<p> &nbsp;宋代，在门峡(今文甲村)之东海中有个小岛屿，当时岛上有两魔，一叫嘉应，一叫嘉佑，或出没于荒丘之间，摄魂迷魄，坑害百姓，或出没于巨浪之中，沉舟破艇，为害渔民；或出没于客舟之旁，兴风作浪，祸及商旅。默娘用一只绣花鞋化出一宝舟顺流而游，而自己立于船头。嘉佑舍客船而追逐其舟，企图冒犯，默娘以咒压之，嘉估因而惧惊拜服。她忽而又从山路独行，嘉应不知，以为民间美妹，将欲犯之。她拂尘一挥，嘉应无法逾越，深知默娘之法力，遂退避潜伏。两魔岁余不敢作祟! </p>', '2017-05-31 07:03:01', '[\"http://www.mazuworld.com/uploads/allimg/c120425/1335332302U0-134091.jpg\"]', '妈祖传说');
INSERT INTO `index_grid_mazuculture` VALUES (7, '演法力铁马骋海\r\n', '<p> &nbsp;有一天，默娘因事从湄洲岛到贤良港，来到码头，久待不见摆渡。因有急事要赶时间，默娘十分焦急，看见码头有一大屋，屋檐下有一铁马，遂骑上檐下铁马，策动而起，飞驰于水面之上，如履平地。岸上的人无不惊骇，以为骑的是青聪马飞于水上。天马行于空中，但却听不到马的嘶叫和鞍镫之声。真马骑于水上，已不可能，策动铁马飞于水面，若非神仙，谁可为之?</p>', '2008-08-26 16:00:00', '[\"http://www.mazuworld.com/uploads/allimg/c120425/1335332304G0-162R1.jpg\"]', '妈祖传说');
INSERT INTO `index_grid_mazuculture` VALUES (8, '踏祥云升天成仙\r\n', '<p> 默娘二十八岁时，时值宋太宗雍熙四年(987年)农历九月初八。她收拾家中财物，向家人一一交待之后，对家人说：“明日重阳，我欲登高，暂离喧扰尘世，特先告别。”翌日，她打扮得漂漂亮亮，盛妆与家人及村中姐妹道别。众人依依不舍，意欲前往送行，被她婉拒。她说：“此次登高，云程万里，诸位姐妹请勿同行。”然后依依离别，登上湄峰。众姐妹遥遥相送，忽闻空中丝竹管乐，八音齐奏，仰见銮舆翠盖，仪仗幢幡，纷踏而至。五彩祥云降于湄峰，默娘登云而上，冉冉上升，众人无不唏嘘惊异。她升入天际，不久彩云布合，不复见矣!</p>', '2008-08-26 16:00:00', '[\"http://www.mazuworld.com/uploads/allimg/c120425/13353322aQ0-45542.jpg\"]', '妈祖传说');
INSERT INTO `index_grid_mazuculture` VALUES (9, '霞浦沙江竹江岛——“阿婆走水”\r\n', '<p> 竹江，曾因岛上盛产竹子，取名竹屿，后定名为竹江。竹江村地处沙江镇东吾洋西北部，四面环海，是个传统的渔耕岛屿村落。全村分前澳、后湾二境，共有村民住家1020户，3996人；陆地面积0.2平方公里，海域面积24500多亩。村民收入主要依靠海蛎、海带养殖，紫菜、乌鲶、小型网捕等渔业生产。竹江村的“妈祖三”神节活动，自农历三月廿一日起，前澳、后湾两境的群众，各邀上乘剧团，“歌与神听”。两座天后宫内，日夜鼓乐喧天，社戏连台，直至三月廿六日止。神节期间，外地游客、邻村亲友络绎不绝，热闹非凡。“一年繁华景，尽在三月天。”（清·乡人·训导赠奉政大夫张先孝诗句）。为求海产丰盈，人畜平安，每年农历三月廿五、廿六日，竹江村前澳、后湾两境的村民就分别举办“阿婆走水”活动。</p>', '2019-01-09 08:13:55', '[\"http://www.mazuworld.com/uploadfile/2019/0109/20190109041830900.jpg\"]', '妈祖非遗');
INSERT INTO `index_grid_mazuculture` VALUES (10, '天津市津南区葛沽宝辇会\r\n', '<p> 竹江，曾因岛上盛产竹子，取名竹屿，后定名为竹江。竹江村地处沙江镇东吾洋西北部，葛沽宝辇是北方大型的妈祖祭祀活动，也是天津葛沽镇特有的文化遗存表现形式，被誉为妈祖文化的活载体、活化石，现已列入全国第四批非物质文化遗产名录。葛沽宝辇会兴建于明朝永乐年间，代代传承，是葛沽人民在长期渔、盐劳作和漕运影响下形成的以娱神、娱人为内容，以民间花会为载体，含有历史、民俗、艺术、信仰、商贸等诸多文化内容的传统民俗活动。葛沽宝辇会之所以能够传承下来，与人们对妈祖文化的信仰密不可分。几百年来，葛沽地区形成了八架宝辇、二架灯亭的格局。宝辇花会表演分为小步稳行、小步颤行、大步快行、跑“8”字、龙摆尾等形式。每逢农历正月是葛沽民间花会活动的高潮，多姿多彩的宝辇及各类花会队伍鼓乐齐鸣，轮番表演，成为人们庆贺太平、祈福新春的一项重大群文活动。</p>', '2019-01-09 08:13:55', '[\"http://www.mazuworld.com/uploadfile/2018/1206/20181206100650354.jpg\"]', '妈祖非遗');
INSERT INTO `index_grid_mazuculture` VALUES (11, '传承妈祖非遗文化 服务一带一路建设\r\n', '<p> 为了服务一带一路沿线国家传承妈祖文化的需要，湄洲湾职业技术学院成立了以党委书记林建华同志为组长的“妈祖文化传承与传播”科研课题项目组，探索“一带一路”框架下妈祖祭典文化传承和传播工作，增进与一带一路沿线国家的文化交流，进一步传承与弘扬妈祖文化。5月7-8日，学院“妈祖文化传承与传播”科研课题项目组一行11人前往湄洲岛开展妈祖诞辰1058年祭典活动考察研究工作。此次考察，项目组先后观摩学习了三月廿三妈祖春季祭典仪式，收集了妈祖祭典的相关资料，参观了妈祖源流博物馆，欣赏了具有浓郁地方传统文化特色的乐舞艺术表演《祥瑞湄洲》。对妈祖文化的形成历程、妈祖日常祭拜及春秋祭典仪式、乐舞表演进行了深入的考察学习。“天下妈祖，祖在湄洲”，妈祖信俗被列入世界非物质文化遗产名录，妈祖祭典活动气势恢宏，震撼人心，来自东南亚、台湾等地妈祖宫庙的代表来此共襄盛事，台湾更是组织了台湾民意机构近10人及各界人士、宫庙代表共近六千人来参加妈祖祭典活动。做好妈祖信俗文化研究工作，以妈祖文化为纽带，增进与一带一路国家妈祖信众的心灵契合，增进两岸之间的文化认同，具有重要现实意义。项目组成员纷纷表示，本次学习考察活动意义非凡，受益匪浅，一定要努力做好妈祖文化传承与传播研究与实践工作，为服务一带一路建设贡献绵薄之力。</p>', '2018-09-01 05:55:12', '[\"http://www.mazuworld.com/uploadfile/2018/1029/20181029095513291.jpg\"]', '妈祖非遗');
INSERT INTO `index_grid_mazuculture` VALUES (12, '妈祖祭典天津皇会被列入国家级非遗名录\r\n', '<p> &nbsp;5月8日上午，天后诞辰1058周年祭拜活动暨天后散福皇会踩街展演活动拉开帷幕，吸引了许多市民及各地游客前来感受天津卫独特的民俗传统文化。据了解，妈祖祭典天津皇会被列入国家级非物质文化遗产名录。</p>', '2018-09-01 05:44:56', '[\"http://www.mazuworld.com/uploadfile/2018/0901/20180901014604620.jpg\"]', '妈祖非遗');

-- ----------------------------
-- Table structure for index_grid_news
-- ----------------------------
DROP TABLE IF EXISTS `index_grid_news`;
CREATE TABLE `index_grid_news`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL COMMENT '内容',
  `time` datetime NULL DEFAULT NULL COMMENT '时间',
  `imageUrl` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL COMMENT '图片',
  `grid` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '分类',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of index_grid_news
-- ----------------------------
INSERT INTO `index_grid_news` VALUES (1, '隆重预告！2023“妈祖福·六贺新春”文化系列活动即将启动', '<p> 2024年春节至元宵期间，中华妈祖文化交流协会在线上隆重推出“妈祖福·六贺新春”文化系列活动。旨在营造春节期间文明、祥和、热烈的文化氛围，营造妈祖敬仰者欢乐喜庆过春节的“年味儿”。同时，进一步挖掘妈祖文化内涵，讲好妈祖故事，推动妈祖文化进生活，让妈祖敬仰者们在日常生活中潜移默化地感受妈祖文化、学习“榜样力量”，从而更好地传承妈祖文化、弘扬妈祖精神。</p>', '2023-01-11 18:19:00', '[\"http://www.mazuworld.com/uploadfile/2024/0724/20240724102107949.png\",\"http://www.mazuworld.com/uploadfile/2024/0618/20240618035619998.jpg\"]', '妈祖新闻');
INSERT INTO `index_grid_news` VALUES (2, '“我爱妈祖”全球儿童画大赛获奖作品巡回展在洞头举行\r\n', '<p> 2024年6月12日，“童心绘妈祖——‘我爱妈祖’全球儿童画大赛获奖作品巡回展”在洞头区市民活动中心隆重举行，展览汇聚了来自全球各地的“我爱妈祖”儿童画大赛获奖作品共计34幅。展览由中华妈祖文化交流协会、温州市洞头区文化和广电旅游体育局、福建电子音像出版社主办，天下妈祖网协办，温州市洞头区妈祖文化交流协会承办，为2024年洞头区非物质文化遗产日系列活动一项重要内容。</p>', '2024-06-18 15:50:16', '[\"http://www.mazuworld.com/uploadfile/2024/0429/20240429022239739.png\"]', '妈祖新闻');
INSERT INTO `index_grid_news` VALUES (3, '2024“妈祖诞”文化系列活动开幕式暨“春祭妈祖”大典举行\r\n', '<p> 4月23日，中华妈祖文化交流协会2024“妈祖诞”文化系列活动开幕式暨“春祭妈祖”大典在莆田市区懿明楼广场举行。福建省第十一届人大常委会副主任、中华妈祖文化交流协会名誉会长袁锦贵宣布开幕，莆田市人大常委会主任苏永革致辞，莆田市政协主席沈萌芽主持，阮军、何金清、林韶雯、黄华等领导，中华妈祖文化交流协会常务副会长俞建忠，以及海内外妈祖敬仰者1000多人出席。</p>', '2024-04-28 22:19:39', '[\"http://www.mazuworld.com/uploadfile/2024/0429/20240429022239739.png\"]', '妈祖新闻');
INSERT INTO `index_grid_news` VALUES (4, '妈祖世界瓷行天下：捷克驻华大使馆代办马金•霍谢克先生\r\n', '<p> 日前，应捷克共和国驻华大使馆代办马金•霍谢克先生邀请，中华妈祖文化交流协会常务理事、德化恒丰佳创有限公司董事长李国营代表中华妈祖文化交流协会，前往北京捷克驻华大使官邸拜会。双方就近期开展的妈祖文化交流活动具体情况进行了深入交流。马金•霍谢克代办对妈祖文化“立德行善大爱”核心精神十分推崇，对人类非物质文化遗产“妈祖信俗”的传承保护工作很感兴趣，尤其对正在持续开展的“妈祖世界瓷行天下”活动十分认可。他表示，以后要专程到福建参观妈祖信俗文化活动场所，学习妈祖信俗活动内容，亲身体验妈祖陶瓷文化，深入了解“妈祖”和“陶瓷”这两种中国奉献给世界的宝贵文化遗产。</p>', '2023-11-14 06:28:03', '[\"http://www.mazuworld.com/uploadfile/2023/1114/20231114023530326.png\"]', '妈祖新闻');
INSERT INTO `index_grid_news` VALUES (5, '吴文忠向苍南妈祖文化交流协会捐赠《妈祖赐福图》\r\n', '<p> 著名的《妈祖六和图》原创画家吴文忠向苍南妈祖文化交流协会捐赠《妈祖赐福图》，由苍南妈祖文化交流协会会长林维斌在研讨会现场揭幕。妈祖文化历史悠久，是中华优秀传统文化的重要组成部分，亦是中华民族文化史上的一朵奇葩。妈祖文化的社会意义影响深远，弘扬好妈祖“六和”文化，对推动社会经济的发展，维护国家的安全稳定可发挥积极的作用。打造妈祖“六和”文化品牌是近年来中华妈祖文化交流协会常务副会长俞建忠提出的工作总体思路，得到社会各界的积极反响。为传播弘扬妈祖“六和”文化，莆田知名妈祖画家吴文忠以妈祖“六和”文化的精髓，创作了《妈祖六和图》（系列组图），分别为《中华妈祖世界和平图》《中华妈祖祖国和昌图》《中华妈祖社会和谐图》《中华妈祖民族和睦图》《中华妈祖两岸和合图》《中华妈祖家庭和美图》。</p>', '2023-12-05 00:59:13', '[\"http://www.mazuworld.com/uploadfile/2023/1205/20231205091204234.png\"]', '妈祖新闻');
INSERT INTO `index_grid_news` VALUES (6, '祝贺，两岸妈祖义工\r\n', '<p> 湄洲岛“两岸一家亲”妈祖义工志愿服务项目开展于2014年11月，参与项目的注册志愿者近500人。目前建有2个“两岸一家亲”志愿服务站、1个党员义工志愿服务站，全年为岛民和游客提供志愿服务。据不完全统计，近年来共接受旅游咨询5万多人次，处理上报应急突发事件10多件。据介绍，每年来湄洲岛谒祖进香的台胞超过30万人次。因敬仰妈祖，不少台湾同胞也来岛参加志愿服务活动，目前有27名台湾义工参加湄洲岛“两岸一家亲”妈祖义工志愿服务项目，涌现出共植同愿林为圣地添绿、暑期送清凉共献妈祖爱、跨越海峡来妈祖故乡义诊等感人事。值得一提的是，2019年以来，先后有50多个台湾妈祖宫庙代表、300多位台湾义工成员前来妈祖文化发祥地，与湄洲岛“两岸一家亲”妈祖义工志愿服务队共植“两岸同愿林”，携手建设两岸同胞心灵契合、共创共享的幸福家园。</p>', '2021-04-25 06:15:50', '[\"http://www.mazuworld.com/uploadfile/2021/0425/20210425021857616.jpg\"]', '两岸交流');
INSERT INTO `index_grid_news` VALUES (7, '福州三坊七巷天后宫妈祖神像出巡台湾\r\n', '<p> &nbsp;飞鱼服、大帽、明圆领、水田衣、明制云锦麒麟袍，身着中华正统明制祀典衣冠的仪仗队，簇拥着身穿明代命妇品服麒麟袍的福州三坊七巷天后宫软身妈祖神像，沿着街道向台中大甲镇澜宫行进，巡游沿途受到许多台湾民众的热情关注。据悉，这是福州老城区天后宫妈祖神像首次出巡台湾。福州三坊七巷天后宫是福州老城区内唯一尚存的天后宫，孕育了发端于茶叶贸易的茶帮妈祖文化，传承着闽商的开拓进取精神。此次参访，福州三坊七巷天后宫向台中大甲镇澜宫展示了悠久的闽商妈祖文化，并将明代风格的妈祖画像赠予大甲镇澜宫收藏。这幅妈祖画像是由福州三坊七巷天后宫与上海神仙画非物质文化遗产传承人王琛，耗时近一年复原完成。该画像采用工笔重彩技法，并复原了明代仕女图中富有特色的“三白妆”，古朴而华美，受到郑铭坤等人的高度赞扬。</p>', '2019-08-06 09:37:07', '[\"http://www.mazuworld.com/uploadfile/2019/0806/20190806063145695.png\"]', '两岸交流');
INSERT INTO `index_grid_news` VALUES (8, '第三届海峡两岸青年阅读季启动\r\n', '<p> 22日，第三届海峡两岸青年阅读季启动仪式暨中华经典诵读展演活动在福州大梦书屋举办，来自两岸的100名青年带来了《缘牵两岸》《与妻书》《八闽芳华》等精彩的古诗词和现代诗诵读节目，齐诵、轮诵、独诵等吟诵方式轮番登场，将古风服装、民族音乐、舞蹈表现形式相结合。现场声情并茂的表演，赢得了观众的阵阵掌声。在为期7天的活动中，将举办两岸青少年经典诵读展演、青年阅读沙龙、文学创作采风、青年读书会、名家讲座等活动。两岸学子还将结对子，参访福州三坊七巷、漳州土楼、厦门鼓浪屿等景点。</p>', '2019-07-23 01:22:43', '[\"http://www.mazuworld.com/uploadfile/2019/0723/20190723092328924.jpg\"]', '两岸交流');
INSERT INTO `index_grid_news` VALUES (9, '“福建文化宝岛行”活动在台举办\r\n', '<p> 近日，“2019福建文化宝岛行——南音专场”活动先后在台北、南投、苗栗等地举行，为台湾民众带去了脍炙人口的福建特色文化。活动期间，巡演团第一站亮相“2019海峡两岸台北夏季旅展”开幕仪式（如图），以非遗展演的形式，协助提高“全福游、有全福”和“清新福建”旅游品牌在台湾的影响力和知名度。当天，来自福建省南音团体的演员们精心编排节目，用歌唱、弹奏等形式展现了福建南音的独特风采和魅力，给台湾民众带去了高水准的视听盛宴。21日至22日，巡演团先后走进苗栗县象山书院、南投县水里乡等地展开戏曲巡回演出。演出场场火爆，台下座无虚席，台湾民众充分感受到福建传统文化的魅力。</p>', '2019-07-23 01:18:29', '[\"http://www.mazuworld.com/uploadfile/2019/0723/20190723091948726.jpg\"]', '两岸交流');
INSERT INTO `index_grid_news` VALUES (10, '两岸妈祖宫庙缔结姐妹宫\r\n', '<p> 从贤良港天后祖祠董事会获悉，日前台湾台中市副市长杨琼璎率领台中大雅永兴宫、大雅宝兴宫、乌日圣母宫、大树慈后宫以及台湾贤良港妈祖分灵会一行百人，赴莆田贤良港天后祖祠举行结盟典礼。当日下午4时吉辰，贤良港天后祖祠内，钟鼓和鸣，祥音缭绕。台湾台中市副市长杨琼璎、台中大雅永兴宫主委朱宗敏、大雅宝兴宫主委蓝永金、乌日圣母宫主持郑国南、大树慈后宫主委林清田、台湾贤良港妈祖分灵会理事长林金德等一行百人，在天后祖祠向妈祖行三献礼，祝愿两岸和平永驻，国泰民安。</p>', '2019-07-16 01:54:25', '[\"http://www.mazuworld.com/uploadfile/2019/0716/20190716095523124.jpg\"]', '两岸交流');
INSERT INTO `index_grid_news` VALUES (11, '青岛妈祖文化参访团莅临协会\r\n', '<p> 青岛妈祖文化参访团在懿明楼向妈祖“三献礼”，并参观了妈祖文化图片展。之后，双方进行了座谈交流。在座谈会上，董天成副会长汇报了青岛地区的妈祖文化建设情况，青岛妈祖文化联谊会正在快速、规范化发展，感谢中华妈祖文化交流协会的鼎力支持。俞建忠表示，青岛妈祖文化联谊会是其他妈祖机构学习的榜样，希望青岛妈祖文化联谊会紧跟时代步伐，依照国家政策做实事、做好事，弘扬妈祖“立德、行善、大爱”的精神，将妈祖文化传播到更广泛的地区。俞建忠最后强调，促进闽鲁妈祖文化交流，共同推动妈祖文化的弘扬和践行是集体性的、群众性的大事，离不开闽鲁地区各个妈祖文化机构的积极参与，希望青岛妈祖文化联谊会在这方面走在前头，大家一起努力、一起推进，把这项工作推上一个新台阶。</p>', '2019-05-07 01:24:16', '[\"http://www.mazuworld.com/uploadfile/2019/0507/20190507085504575.jpg\"]', '中华妈祖文化交流协会');
INSERT INTO `index_grid_news` VALUES (12, '中华妈祖礼仪队的风采\r\n', '<p> 4月28日，在中华妈祖文化交流协会举办的“第二届妈祖平安成人礼”上，中华妈祖礼仪队成为吸引众人眼球的风景线。在迎接的队伍当中，穿着整齐服装的礼仪队队员面对面列队成两排，迎接过往的嘉宾、学生、家长、老师。礼仪队的站姿，面带笑容服务的现场，待人接物的仪态，都得到了大家的赞许。</p>', '2019-04-29 02:34:35', '[\"http://www.mazuworld.com/uploadfile/2019/0429/20190429030343982.jpg\"]', '中华妈祖文化交流协会');
INSERT INTO `index_grid_news` VALUES (13, '协会启动“妈祖书法进宫庙”活动\r\n', '<p> 4月23日，中华妈祖书画院送书法进宫庙启动仪式在莆田市群艺馆展览厅门口隆重举行。莆田市原市长、中华妈祖书画院名誉院长姚振泉、中华妈祖文化交流协会常务副会长俞建忠、中华妈祖书画院院长翁爱珊、中华妈祖书画院副院长俞宗建、中建华鸿建设发展有限公司董事长林永磊、中华妈祖书画院书画家、莆田国保、省保妈祖宫庙负责人以及协会驻会全体人员出席，启动仪式由俞宗建主持。仪式上，翁爱珊表示，启动“妈祖缘，翰墨情”向妈祖宫庙捐赠楹联书法的系列公益活动，是以传承优秀传统文化的实际活动，奉献给党百岁生日的吉祥礼物。林永磊说，妈祖丹青翰墨情，善行天下普天喜。这次参加“中国书法进妈祖庙”活动，只是一个开始。俞会长提出妈祖人“心存善念、行践大爱”，概括的妈祖文化助力“家庭和美、民族和睦、社会和谐、两岸和合、祖国和昌、世界和平”的“六和”理念，受到了海内外的广泛赞誉。</p>', '2021-04-26 06:54:15', '[\"http://www.mazuworld.com/uploadfile/2021/0425/20210425022502367.png\"]', '中华妈祖文化交流协会');
INSERT INTO `index_grid_news` VALUES (14, '第十一届海峡论坛·妈祖文化活动周（莆田站）筹备会召开\r\n', '<p> 6月3日，第十一届海峡论坛·妈祖文化活动周（莆田站）筹备会在懿贤楼三楼会议室召开，中华妈祖文化交流协会常务副会长俞建忠携全体工作人员参加会议。出席本次会议的还有中华妈祖各文化艺术团队、湄洲妈祖祖庙董事会、贤良港天后祖祠董事会、涵江区妈祖文化交流协会、莆田市妈祖文化交流促进会等。会议由协会办公室分管领导林惠玉主持。中华妈祖文化交流协会的妈祖文化活动周的时间定于5月至 6月，此次活动的开展是为了充分发挥妈祖文化在两岸交流中的积极作用，增强两岸同胞情谊，促进两岸协作、合作，深化民间文化交流，着眼两岸青少年结亲联谊。</p>', '2021-06-11 01:14:45', '[\"http://www.mazuworld.com/uploadfile/2019/0604/20190604090321894.jpg\"]', '中华妈祖文化交流协会');
INSERT INTO `index_grid_news` VALUES (15, '“歌唱祖国·敬颂妈祖·感恩母亲”圆满落幕\r\n', '<p> 5月12日，中华妈祖文化交流协会携手莆田市老年大学艺术团、莆田市博物馆等有关单位，在莆田市博物馆广场，联合举办以“歌唱祖国·敬颂妈祖·感恩母亲”为主题的庆祝母亲节文化系列活动，并取得了圆满成功。在活动上，中华妈祖文化交流协会新组建的中华妈祖艺术团、中华妈祖礼仪队、中华妈祖莆仙十音八乐团、中华妈祖书画院、中华妈祖义诊队等队伍纷纷亮相。中华妈祖书画院书法家现场书写书签，中华妈祖义诊队现场义诊，中华妈祖艺术团献演，中华妈祖莆仙十音八乐团现场演奏，中华妈祖礼仪队联合市老年大学艺术团、市广场舞协会献上特色节目。活动现场，可谓精彩纷呈、文化浓郁、底蕴浑厚，深情地表达了莆阳大地对伟大祖国母亲的歌颂，对妈祖文化的无比敬仰，对人间母爱的报答之心，传播“争当妈祖人，勤做公益事”的良好作风。</p>', '2019-05-13 01:11:32', '[\"http://www.mazuworld.com/uploadfile/2019/0513/20190513092152657.jpg\"]', '中华妈祖文化交流协会');

-- ----------------------------
-- Table structure for index_grid_placetemple
-- ----------------------------
DROP TABLE IF EXISTS `index_grid_placetemple`;
CREATE TABLE `index_grid_placetemple`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL COMMENT '内容',
  `time` datetime NULL DEFAULT NULL COMMENT '时间',
  `imageUrl` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '图片',
  `grid` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '分类',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of index_grid_placetemple
-- ----------------------------
INSERT INTO `index_grid_placetemple` VALUES (1, '11', '<p>1111</p>', '2025-11-02 16:00:00', '[\"http://127.0.0.1:8889/index/img-1762787770649-7f47b18acdfa0282.jpg\"]', '');

-- ----------------------------
-- Table structure for index_grid_publication
-- ----------------------------
DROP TABLE IF EXISTS `index_grid_publication`;
CREATE TABLE `index_grid_publication`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL COMMENT '内容',
  `time` datetime NULL DEFAULT NULL COMMENT '时间',
  `imageUrl` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '图片',
  `grid` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '分类',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of index_grid_publication
-- ----------------------------

-- ----------------------------
-- Table structure for index_grid_tourism
-- ----------------------------
DROP TABLE IF EXISTS `index_grid_tourism`;
CREATE TABLE `index_grid_tourism`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL COMMENT '内容',
  `time` datetime NULL DEFAULT NULL COMMENT '时间',
  `imageUrl` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '图片',
  `grid` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '分类',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of index_grid_tourism
-- ----------------------------
INSERT INTO `index_grid_tourism` VALUES (1, '1', '<p>1</p>', '2025-11-09 16:00:00', '[\"http://127.0.0.1:8889/index/img-1762787787181-e6cac4895f44ac2c.png\"]', '');

-- ----------------------------
-- Table structure for index_recommend
-- ----------------------------
DROP TABLE IF EXISTS `index_recommend`;
CREATE TABLE `index_recommend`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `text` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `imageUrl` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `url` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of index_recommend
-- ----------------------------
INSERT INTO `index_recommend` VALUES (1, '留白视觉', '《妈祖信俗》信息可视化作品', 'http://139.159.229.212:8889/index/recommend/1.jpg', NULL);
INSERT INTO `index_recommend` VALUES (2, '小斯基研学', '每天一个非遗小知识2 | 你知道“妈祖“吗?', 'http://139.159.229.212:8889/index/recommend/2.jpg', NULL);
INSERT INTO `index_recommend` VALUES (3, '每天学习亿点小知识', '中国本土神话 女神', 'http://139.159.229.212:8889/index/recommend/3.jpg', NULL);
INSERT INTO `index_recommend` VALUES (4, 'Marco顾', '这篇一定要码住!!不然湄洲妈祖庙你白来了!', 'http://139.159.229.212:8889/index/recommend/4.jpg', NULL);
INSERT INTO `index_recommend` VALUES (5, '简单生活', '莆田湄洲岛/妈祖庙夜景', 'http://139.159.229.212:8889/index/recommend/5.jpg', NULL);
INSERT INTO `index_recommend` VALUES (6, 'Memory Chaser', '湄洲岛｜闽南人一年一度的妈祖庙进香', 'http://139.159.229.212:8889/index/recommend/6.jpg', NULL);

-- ----------------------------
-- Table structure for mz_prays
-- ----------------------------
DROP TABLE IF EXISTS `mz_prays`;
CREATE TABLE `mz_prays`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of mz_prays
-- ----------------------------
INSERT INTO `mz_prays` VALUES (5, '[\"http://127.0.0.1:8889/prays/img-1762857841358-14c74577e1e67d6d.jpg\"]', '<p>恭喜你</p>');

-- ----------------------------
-- Table structure for scenic_info
-- ----------------------------
DROP TABLE IF EXISTS `scenic_info`;
CREATE TABLE `scenic_info`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `address` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `opening_hours` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contact` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ticket_price` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `introduction` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `traffic_guide` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of scenic_info
-- ----------------------------
INSERT INTO `scenic_info` VALUES (1, '湄洲岛妈祖祖庙景区', '福建省莆田市秀屿区湄洲镇', '07:30-17:30', '0594-5091999', '门票：65元/人，入岛船票：30元/人', '湄洲岛妈祖祖庙是世界妈祖文化的发源地，始建于北宋雍熙四年（987年），是全球妈祖信众的朝圣中心，国家级AAAAA级旅游景区。', '莆田市区可乘坐K09路公交至文甲码头，再乘船前往湄洲岛（船程约15分钟）', '2025-11-27 17:29:28');
INSERT INTO `scenic_info` VALUES (2, '湄洲妈祖文化园', '福建省莆田市秀屿区湄洲岛', '08:00-18:00', '0594-5091888', '含湄洲岛入岛套票内', '以妈祖文化为核心的主题园区，包含妈祖石雕像（高14.35米）、妈祖碑林、妈祖故事群雕等景观，是湄洲岛核心文化地标之一。', '湄洲岛码头乘坐景区观光车（票价20元/人）直达文化园入口', '2025-11-27 22:16:50');
INSERT INTO `scenic_info` VALUES (3, '泉州天后宫', '福建省泉州市鲤城区天后路1号', '08:00-17:30', '0595-22203654', '免费开放', '始建于南宋庆元二年（1196年），是中国现存年代最早、规模最大的妈祖庙之一，为全国重点文物保护单位，融合闽南建筑特色与妈祖信仰文化。', '泉州市区乘公交3路、4路、12路至天后宫站下车即达', '2025-11-27 22:16:50');
INSERT INTO `scenic_info` VALUES (4, '贤良港天后祖祠', '福建省莆田市秀屿区山亭镇港里村', '07:30-18:00', '0594-5091666', '免费开放', '妈祖诞生地，又称“妈祖娘家”，保留有妈祖故居、祖祠正殿、妈祖井等遗迹，是妈祖文化溯源的重要场所。', '莆田市区乘201路公交至贤良港站下车，步行5分钟可达', '2025-11-27 22:16:50');
INSERT INTO `scenic_info` VALUES (5, '厦门大嶝岛妈祖庙', '福建省厦门市翔安区大嶝街道田墘社区', '08:00-17:00', '0592-7099888', '免费开放', '始建于明代，闽南海岛特色妈祖分庙，紧邻金门海域，融合了闽南渔村信仰与两岸文化交流元素。', '厦门岛内乘756路公交至大嶝岛站，换乘岛内接驳车或骑行10分钟可达', '2025-11-27 22:16:50');
INSERT INTO `scenic_info` VALUES (6, '漳州东山妈祖庙', '福建省漳州市东山县铜陵镇南门湾', '07:00-18:00', '0596-5622338', '免费开放', '东山岛历史最悠久的妈祖庙之一，与东山关帝庙并称“岛双庙”，可俯瞰南门湾海景，兼具宗教与观光价值。', '漳州市区乘至东山岛大巴至铜陵镇，步行或骑电动车5分钟可达', '2025-11-27 22:16:50');

-- ----------------------------
-- Table structure for scenic_reservation
-- ----------------------------
DROP TABLE IF EXISTS `scenic_reservation`;
CREATE TABLE `scenic_reservation`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `visitor_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `visitor_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `visitor_id_card` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `visit_time` datetime NOT NULL,
  `visitor_count` int NOT NULL,
  `scenic_spot` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `reservation_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '已预约',
  `create_time` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of scenic_reservation
-- ----------------------------
INSERT INTO `scenic_reservation` VALUES (1, '程浩', '18016007704', '411426200302168132', '2025-04-05 09:00:00', 5, '湄洲岛妈祖祖庙景区', '已预约', '2025-11-27 19:01:33');
INSERT INTO `scenic_reservation` VALUES (2, '程浩', '18016007704', '411426200302168132', '2025-04-05 09:00:00', 5, '湄洲岛妈祖祖庙景区', '已预约', '2025-11-27 19:41:48');
INSERT INTO `scenic_reservation` VALUES (3, '程浩', '13108191703', '411426200302168132', '2025-04-05 09:00:00', 5, '湄洲岛妈祖祖庙景区', '已预约', '2025-11-27 21:14:23');
INSERT INTO `scenic_reservation` VALUES (4, '程浩', '13108191703', '411426200302168132', '2025-04-05 09:00:00', 5, '湄洲岛妈祖祖庙景区', '已预约', '2025-11-27 21:35:39');
INSERT INTO `scenic_reservation` VALUES (5, '程浩', '13108191703', '411426200302168132', '2025-04-05 09:00:00', 5, '湄洲岛妈祖祖庙景区', '已预约', '2025-11-27 21:35:53');

-- ----------------------------
-- Table structure for shop_address
-- ----------------------------
DROP TABLE IF EXISTS `shop_address`;
CREATE TABLE `shop_address`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户id',
  `province_id` char(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '省id',
  `city_id` char(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '城市id',
  `district_id` char(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '区id',
  `name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '收货人姓名',
  `mobile` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '手机号',
  `remark` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '详细地址',
  `isDefault` int NOT NULL COMMENT '是否默认地址 1是 0否',
  `create_time` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '创建时间',
  `update_time` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of shop_address
-- ----------------------------
INSERT INTO `shop_address` VALUES (20, 10, '广东省', '汕头市', '金平区', '张', '13417130251', '报本路3号', 1, '2024-09-21T14:35:42.727Z', '2024-09-21T14:35:45.156Z');
INSERT INTO `shop_address` VALUES (22, 2, '北京市', '市辖区', '东城区', '林', '13966666666', '3', 0, '2024-12-13T15:06:32.702Z', '2024-12-13T15:06:32.702Z');
INSERT INTO `shop_address` VALUES (24, 1, '北京市', '市辖区', '东城区', '张嘉鑫', '13063158731', '湄洲湾职业技术学院', 0, '2024-12-13T15:41:34.985Z', '2024-12-13T15:41:55.380Z');
INSERT INTO `shop_address` VALUES (25, 1, '北京市', '市辖区', '东城区', '张嘉鑫', '13063158731', '1', 1, '2024-12-13T15:41:48.392Z', '2024-12-13T15:41:55.393Z');

-- ----------------------------
-- Table structure for shop_collect
-- ----------------------------
DROP TABLE IF EXISTS `shop_collect`;
CREATE TABLE `shop_collect`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NULL DEFAULT NULL,
  `goods_id` int NULL DEFAULT NULL,
  `collect_time` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '收藏时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of shop_collect
-- ----------------------------
INSERT INTO `shop_collect` VALUES (13, 2, 19, '2024-09-26 17:40:22');

-- ----------------------------
-- Table structure for shop_goods
-- ----------------------------
DROP TABLE IF EXISTS `shop_goods`;
CREATE TABLE `shop_goods`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` int NULL DEFAULT NULL COMMENT '状态0是下架 1是上架',
  `shopname` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `price` decimal(10, 2) NULL DEFAULT NULL,
  `type` int NULL DEFAULT NULL COMMENT '商品的排列顺序',
  `grid` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `imageUrl` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `shopInfo` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '商品介绍',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of shop_goods
-- ----------------------------
INSERT INTO `shop_goods` VALUES (27, 1, '11', 11.00, 1, '摆件', '[\"http://127.0.0.1:8889/shop/shop-img-1763125859744-c12ac3316b570bcf.jpg\"]', '齐全');
INSERT INTO `shop_goods` VALUES (28, 1, '测试', 12.00, 10, '摆件', '[\"http://127.0.0.1:8889/shop/shop-img-1763183397110-e7ae9815425e7433.png\",\"http://127.0.0.1:8889/shop/shop-img-1763191090020-4de803913ff5b79f.png\"]', '123');
INSERT INTO `shop_goods` VALUES (29, 1, '测试', 12.00, 10, '摆件', '[\"http://127.0.0.1:8889/shop/shop-img-1763193420049-1bbc9a654344b1c7.jpg\"]', '测试');

-- ----------------------------
-- Table structure for shop_order
-- ----------------------------
DROP TABLE IF EXISTS `shop_order`;
CREATE TABLE `shop_order`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NULL DEFAULT NULL COMMENT '用户id',
  `address_id` int NULL DEFAULT NULL COMMENT '收货地址id',
  `order_id` varchar(22) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '订单id',
  `shop_id` int NOT NULL COMMENT '商品id',
  `payment` float NULL DEFAULT NULL COMMENT '付款金额',
  `payment_type` int NULL DEFAULT NULL COMMENT '付款类型/1余额支付 2微信支付',
  `create_time` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '创建时间',
  `pay_time` datetime NULL DEFAULT NULL COMMENT '支付时间',
  `order_status` int NULL DEFAULT NULL COMMENT '订单状态/0-已取消 10-未付款 20-已付款 30-已发货 40-交易成功',
  `note` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 50 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of shop_order
-- ----------------------------
INSERT INTO `shop_order` VALUES (37, 10, 20, 'FZHY275969293732323422', 19, 15, 1, '2024-09-21T14:36:13.232Z', '2024-09-21 22:36:17', 40, '');
INSERT INTO `shop_order` VALUES (39, 1, 19, 'FZHY249869331249712954', 18, 168, NULL, '2024-09-21T15:38:44.971Z', NULL, 0, '');
INSERT INTO `shop_order` VALUES (40, 1, 19, 'FZHY462669801022537962', 11, 298, NULL, '2024-09-22T04:41:42.252Z', NULL, 0, '');
INSERT INTO `shop_order` VALUES (41, 1, 19, 'FZHY288270628382803769', 15, 15, NULL, '2024-09-23T03:40:38.280Z', NULL, 0, '');
INSERT INTO `shop_order` VALUES (42, 1, 19, 'FZHY973970634528343347', 11, 298, NULL, '2024-09-23T03:50:52.833Z', NULL, 0, '');
INSERT INTO `shop_order` VALUES (43, 1, 19, 'FZHY849771651161616992', 1, 49, 1, '2024-09-24T08:05:16.161Z', '2024-09-24 16:05:26', 40, '');
INSERT INTO `shop_order` VALUES (44, 1, 19, 'FZHY463181127871973937', 11, 298, 1, '2024-10-05T07:19:47.197Z', '2024-10-05 15:19:55', 20, '');
INSERT INTO `shop_order` VALUES (46, 1, 19, 'FZHY178839729312913634', 12, 25, 1, '2024-12-12T03:08:51.290Z', '2024-12-12 11:08:59', 40, '');
INSERT INTO `shop_order` VALUES (47, 1, 19, 'FZHY431540929100726313', 2, 49, 1, '2024-12-13T12:28:30.072Z', '2024-12-13 20:28:36', 40, '');
INSERT INTO `shop_order` VALUES (48, 2, 22, 'FZHY716041024138364492', 11, 298, NULL, '2024-12-13T15:06:53.836Z', NULL, 0, '');

-- ----------------------------
-- Table structure for signin
-- ----------------------------
DROP TABLE IF EXISTS `signin`;
CREATE TABLE `signin`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '关联用户表',
  `is_continuous` int NOT NULL COMMENT '判断是否连续签到',
  `sign_in_date` date NOT NULL COMMENT '最后一次签到时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of signin
-- ----------------------------
INSERT INTO `signin` VALUES (11, 2, 1, '2024-12-13');
INSERT INTO `signin` VALUES (16, 1, 1, '2024-12-13');
INSERT INTO `signin` VALUES (17, 11, 1, '2025-11-10');

-- ----------------------------
-- Table structure for todo_list
-- ----------------------------
DROP TABLE IF EXISTS `todo_list`;
CREATE TABLE `todo_list`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '待办ID（主键）',
  `user_id` bigint NOT NULL COMMENT '关联用户ID',
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '待办内容',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态：0-未完成，1-已完成',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间（默认当前时间）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '待办事项表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of todo_list
-- ----------------------------
INSERT INTO `todo_list` VALUES (1, 5, '准备妈祖文化节促销活动物料', 1, '2025-11-13 10:00:00');
INSERT INTO `todo_list` VALUES (2, 5, '准备妈祖文化节促销活动物料', 1, '2025-11-11 19:41:21');
INSERT INTO `todo_list` VALUES (6, 5, '今天完成统计人数？？', 1, '2025-11-12 21:25:14');
INSERT INTO `todo_list` VALUES (7, 5, '今天没有完成不能附近', 0, '2025-11-12 21:30:32');
INSERT INTO `todo_list` VALUES (8, 5, '今天没有完成不能附近', 0, '2025-11-12 21:30:44');
INSERT INTO `todo_list` VALUES (9, 5, '今天没有完成不能附近', 0, '2025-11-12 21:31:15');
INSERT INTO `todo_list` VALUES (10, 5, '今天完成报表', 0, '2025-11-12 21:31:39');
INSERT INTO `todo_list` VALUES (11, 5, '今天完成报表', 0, '2025-11-12 21:31:52');
INSERT INTO `todo_list` VALUES (12, 5, '今天完成所有任务', 1, '2025-11-12 21:32:22');
INSERT INTO `todo_list` VALUES (13, 5, '222', 1, '2025-11-12 21:34:35');
INSERT INTO `todo_list` VALUES (14, 9, '1223', 0, '2025-11-12 21:38:44');

-- ----------------------------
-- Table structure for todo_list_copy1
-- ----------------------------
DROP TABLE IF EXISTS `todo_list_copy1`;
CREATE TABLE `todo_list_copy1`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '待办ID（主键）',
  `user_id` bigint NOT NULL COMMENT '关联用户ID',
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '待办内容',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态：0-未完成，1-已完成',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间（默认当前时间）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '待办事项表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of todo_list_copy1
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `openid` char(28) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'openid',
  `nickname` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '用户昵称',
  `avatarurl` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '用户头像',
  `gender` int NOT NULL COMMENT '性别',
  `create_time` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '创建时间',
  `balance` float NULL DEFAULT NULL COMMENT '余额',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'ofBzB628JhVYsPJRSHHPq7NYYsZA', 'zjx', 'http://127.0.0.1:8889/user/avatar-1762786249959-1036ce8b34b00eec.jpg', 2, '2024-09-05T11:54:43.605Z', 0);
INSERT INTO `user` VALUES (3, 'ofBzB65GDaMsiZpqj5piN5kHizJg', '微信用户', 'https://tupian.qqw21.com/article/UploadPic/2020-10/2020101722211881489.jpg', 0, '2024-09-05T12:59:43.041Z', 0);
INSERT INTO `user` VALUES (4, 'ofBzB62L6tmxE6LyoUMQD5x0EdsY', '微信用户', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132', 0, '2024-09-06T02:46:09.651Z', 0);
INSERT INTO `user` VALUES (5, 'ofBzB6x51WqqYn7nCRSirCyhUNok', '微信用户', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132', 0, '2024-09-06T02:55:53.853Z', 0);
INSERT INTO `user` VALUES (6, 'ofBzB6wvoTIsfBQtnDUaqvFqQtS8', '微信用户', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132', 0, '2024-09-06T03:06:28.006Z', 0);
INSERT INTO `user` VALUES (7, 'ofBzB66c4AJMwymbI3d48qMQNNm0', '微信用户', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132', 0, '2024-09-06T03:12:47.700Z', 0);
INSERT INTO `user` VALUES (8, 'ofBzB67vrzwGUEECQbVY3b6Ni5AY', '微信用户', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132', 0, '2024-09-06T03:16:34.619Z', 0);
INSERT INTO `user` VALUES (9, 'ofBzB69MhaMsTC22dPZYkCN1q0hs', '微信用户', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132', 0, '2024-09-12T12:31:08.771Z', 0);
INSERT INTO `user` VALUES (10, 'ofBzB68GR-jzGyBDaiUI134qOdEw', '奕娜大美女', 'http://139.159.229.212:8889/user/img-1726929425665-a88668fa277d9b29.jpg', 0, '2024-09-21T14:27:06.417Z', 9936);
INSERT INTO `user` VALUES (11, 'oTEUB7v3-pYJQhJDF8JXE5DtEtRs', '测试用户1', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132', 0, '2025-11-10T01:13:50.444Z', 10000);

-- ----------------------------
-- Table structure for user_visit_count
-- ----------------------------
DROP TABLE IF EXISTS `user_visit_count`;
CREATE TABLE `user_visit_count`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户id',
  `visit_date` date NOT NULL COMMENT '日期',
  `visit_count` int NOT NULL COMMENT '当天的次数',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_visit_count
-- ----------------------------
INSERT INTO `user_visit_count` VALUES (1, 1, '2024-10-01', 6);
INSERT INTO `user_visit_count` VALUES (2, 1, '2024-10-02', 17);
INSERT INTO `user_visit_count` VALUES (3, 10, '2024-10-02', 3);
INSERT INTO `user_visit_count` VALUES (4, 1, '2024-10-11', 2);
INSERT INTO `user_visit_count` VALUES (5, 1, '2024-12-05', 25);
INSERT INTO `user_visit_count` VALUES (6, 1, '2024-12-06', 4);
INSERT INTO `user_visit_count` VALUES (7, 1, '2024-12-08', 1);
INSERT INTO `user_visit_count` VALUES (8, 1, '2024-12-09', 4);
INSERT INTO `user_visit_count` VALUES (9, 1, '2024-12-11', 2);
INSERT INTO `user_visit_count` VALUES (10, 1, '2024-12-12', 3);
INSERT INTO `user_visit_count` VALUES (11, 1, '2024-12-13', 145);
INSERT INTO `user_visit_count` VALUES (12, 2, '2024-12-13', 4);
INSERT INTO `user_visit_count` VALUES (13, 1, '2024-12-14', 1);
INSERT INTO `user_visit_count` VALUES (14, 1, '2024-12-15', 1);
INSERT INTO `user_visit_count` VALUES (15, 11, '2025-11-10', 2);
INSERT INTO `user_visit_count` VALUES (16, 11, '2025-11-19', 36);

-- ----------------------------
-- Table structure for visit_count
-- ----------------------------
DROP TABLE IF EXISTS `visit_count`;
CREATE TABLE `visit_count`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `visit_date` date NOT NULL COMMENT '日期',
  `visit_count` int NOT NULL COMMENT '当天次数',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of visit_count
-- ----------------------------
INSERT INTO `visit_count` VALUES (1, '2024-10-02', 19);
INSERT INTO `visit_count` VALUES (2, '2024-10-03', 1);
INSERT INTO `visit_count` VALUES (3, '2024-10-06', 1);
INSERT INTO `visit_count` VALUES (4, '2024-10-08', 1);
INSERT INTO `visit_count` VALUES (5, '2024-10-11', 1);
INSERT INTO `visit_count` VALUES (6, '2024-10-14', 1);
INSERT INTO `visit_count` VALUES (7, '2024-10-19', 1);
INSERT INTO `visit_count` VALUES (8, '2024-12-05', 35);
INSERT INTO `visit_count` VALUES (9, '2024-12-06', 3);
INSERT INTO `visit_count` VALUES (10, '2024-12-08', 2);
INSERT INTO `visit_count` VALUES (11, '2024-12-09', 3);
INSERT INTO `visit_count` VALUES (12, '2024-12-11', 2);
INSERT INTO `visit_count` VALUES (13, '2024-12-12', 5);
INSERT INTO `visit_count` VALUES (14, '2024-12-13', 130);
INSERT INTO `visit_count` VALUES (15, '2024-12-14', 1);
INSERT INTO `visit_count` VALUES (16, '2024-12-15', 3);
INSERT INTO `visit_count` VALUES (17, '2025-11-10', 9);
INSERT INTO `visit_count` VALUES (18, '2025-11-19', 4);

SET FOREIGN_KEY_CHECKS = 1;
