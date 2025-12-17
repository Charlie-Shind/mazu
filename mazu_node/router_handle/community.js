const db = require('../db/index')
const jwt = require("jsonwebtoken")
const jwtSecretKey = `abc81030839`
const multer = require("multer")
const crypto = require("crypto")
const path = require('path')
const baseUrl = require("../baseUrl")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/community/post'); // 上传的文件存储在 /community/post 目录中
  },
  filename: function (req, file, cb) {
    const randomString = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(file.originalname);
    const uniqueFileName = `${file.fieldname}-${Date.now()}-${randomString}${extension}`;
    cb(null, uniqueFileName); // 使用随机字符串来确保文件名的唯一性
  },
});
const upload = multer({ storage: storage });

// 获取社区内容
const getCommunityItem = (req, res) => {
  const sql = `
        select p.*,u.nickname,u.avatarurl
        from community_post p join user u
        on p.user_id = u.id
    `
  db.query(sql, (err, result) => {
    if (err) {
      return res.send({
        status: 500,
        message: '数据库查询出错: ' + err
      });
    }
    res.send({
      status: 200,
      message: result
    })
  })
}

// 获取话题 帖子数量 评论数量(参与人数)
const getCommunityTopic = (req, res) => {
  const sql = `
        select
        ct.*,
        count(distinct cp.user_id) as post_users,
        count(distinct cc.user_id) as comment_users,
        count(cp.grid_id) as topic_length
        from community_topic ct
        left join community_post cp on ct.id = cp.grid_id
        left join community_comments cc on cp.id = cc.post_id
        group by ct.id
    `
  db.query(sql, (err, result) => {
    if (err) {
      return res.send({
        status: 500,
        message: '数据库查询出错: ' + err
      });
    }
    res.send({
      status: 200,
      message: result
    })
  })
}

// 获取帖子内容
const getCommunityItemInfo = (req, res) => {
  const sql = `
        select p.*,u.nickname,u.avatarurl
        from community_post p join user u
        on p.user_id = u.id
        where p.id = ?
    `
  db.query(sql, [req.body.id], (err, result) => {
    if (err) {
      return res.send({
        status: 500,
        message: '数据库查询出错: ' + err
      });
    }
    res.send({
      status: 200,
      message: result
    })
  })
}

// 获取话题页面内容
const getTopicInfo = (req, res) => {
  const sql = `
    select   
    t.*,  
    count(distinct cc.user_id) as comment_count,  
    p.id as post_id,  
    p.content,  
    p.title,  
    p.imageUrl,  
    p.time,  
    u.nickname,  
    u.avatarurl,  
    u.id as user_id
    from community_topic t  
    left join community_post p on t.id = p.grid_id  
    left join community_comments cc on p.id = cc.post_id  
    left join user u on u.id = p.user_id  
    where t.id = ? 
    group by t.id, p.id, u.id
`;
  db.query(sql, [req.body.id], (err, result) => {
    if (err) {
      return res.send({
        status: 500,
        message: '数据库查询出错: ' + err
      });
    }
    const topic = result[0];
    const postAndUser = result.map(({ comment_count, post_id, content, title, imageUrl, time, nickname, avatarurl, user_id }) => ({
      post_id, content, title, imageUrl, time, nickname, avatarurl, user_id, comment_count,
    }));

    res.send({
      status: 200,
      message: {
        topic,
        postAndUser,
      },
    });
  })
}

// todo查询评论（修复多级嵌套逻辑）
const getComments = (req, res) => {
  const { id: post_id } = req.body;

  if (!post_id) {
    return res.status(400).json({
      status: 400,
      message: '帖子ID不能为空',
      totalComments: 0,
      comments: []
    });
  }

  const sql = `  
    select  
    c.*,  
    u.avatarurl,  
    u.nickname,  
    parent_u.nickname as parent_nickname  
    from community_comments c  
    join user u on c.user_id = u.id  
    left join community_comments parent_c on c.superior_id = parent_c.id  
    left join user parent_u on parent_c.user_id = parent_u.id  
    where c.post_id = ?  
    order by c.reply_time asc  
  `;

  db.query(sql, [post_id], (err, comments) => {
    if (err) {
      console.error('查询评论失败:', err);
      return res.status(500).json({
        status: 500,
        message: '查询评论失败: ' + err.message,
        totalComments: 0,
        comments: []
      });
    }

    const commentMap = new Map();
    const rootCommentIds = new Set(); // 存储所有根评论ID（superior_id=null）
    const mainIdToRootId = new Map(); // 映射：mainId → 对应的根评论ID

    // 第一步：构建映射，记录根评论和 mainId 关联
    comments.forEach(comment => {
      if (comment.id) {
        const commentObj = { ...comment, replies: [] };
        commentMap.set(comment.id, commentObj);

        // 记录根评论
        if (comment.superior_id === null || comment.superior_id === undefined) {
          rootCommentIds.add(comment.id);
          // 根评论的 mainId 映射到自身
          if (comment.mainId) {
            mainIdToRootId.set(comment.mainId, comment.id);
          } else {
            mainIdToRootId.set(comment.id, comment.id); // 兼容 mainId 为 null 的根评论
          }
        }
      }
    });

    // 第二步：关联子评论（优化核心）
    const topLevelComments = [];
    comments.forEach(comment => {
      const currentComment = commentMap.get(comment.id);
      if (!currentComment) return;

      if (comment.superior_id === null || comment.superior_id === undefined) {
        topLevelComments.push(currentComment);
      } else {
        let parentComment = commentMap.get(comment.superior_id);

        // 优化1：父评论不存在时，尝试通过 mainId 关联到根评论
        if (!parentComment && comment.mainId) {
          const rootId = mainIdToRootId.get(comment.mainId);
          parentComment = rootId ? commentMap.get(rootId) : null;
        }

        // 优化2：仍找不到父评论，降级为根评论（但标记为“关联失效”）
        if (parentComment) {
          parentComment.replies.push(currentComment);
        } else {
          currentComment.isInvalid = true; // 标记为无效关联，前端可显示提示
          currentComment.reply_content = `[关联失效] ${currentComment.reply_content}`; // 前端提示
          topLevelComments.push(currentComment);
        }
      }
    });

    // 优化3：子评论按时间排序（最新的在最下面）
    const sortReplies = (comment) => {
      comment.replies.sort((a, b) => new Date(a.reply_time) - new Date(b.reply_time));
      comment.replies.forEach(subComment => sortReplies(subComment));
    };
    topLevelComments.forEach(rootComment => sortReplies(rootComment));

    res.json({
      status: 200,
      message: '查询成功',
      totalComments: topLevelComments.length,
      comments: topLevelComments
    });
  });
};
// 搜索帖子
const searchCommunity = (req, res) => {
  const {
    content
  } = req.body
  const sql = `
        select p.*,u.nickname,u.avatarurl
        from community_post p join user u
        on p.user_id = u.id
        where p.title like ?
    `
  db.query(sql, [`%${content}%`], (err, result) => {
    if (err) {
      return res.send({
        status: 500,
        message: '数据库查询出错: ' + err
      });
    }
    res.send({
      status: 200,
      message: result
    })
  })
}
// todo新增评论
// 新增评论（修复 superio_id 存储逻辑）
const addComments = (req, res) => {
  const {
    post_id,
    user_id,
    reply_content,
    superior_id, // 父评论ID（前端传递）
    comment_id,
    mainId
  } = req.body;

  // 校验必填参数
  if (!post_id) return res.status(400).json({ status: 400, message: '帖子ID不能为空' });
  if (!user_id) return res.status(400).json({ status: 400, message: '用户ID不能为空' });
  if (!reply_content.trim()) return res.status(400).json({ status: 400, message: '评论内容不能为空' });

  // 修复：正确判断一级/子评论（仅当 superior_id 为 null/''/undefined 时是一级评论）
  const isRootComment = !superior_id || superior_id === '' || superior_id === undefined;
  let finalMainId = mainId;

  // 子评论必须传递 mainId（顶级评论ID）
  if (!isRootComment && !finalMainId) {
    return res.status(400).json({ status: 400, message: '顶级评论ID（mainId）不能为空' });
  }

  const sql = `  
    INSERT INTO community_comments (  
      post_id, user_id, reply_content, reply_time, superior_id, comment_id, mainId  
    ) VALUES (?, ?, ?, NOW(), ?, ?, ?)  
  `;

  const values = [
    post_id,
    user_id,
    reply_content.trim(),
    isRootComment ? null : superior_id, // 子评论存储父评论ID
    isRootComment ? null : comment_id,
    isRootComment ? null : finalMainId
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('新增评论失败:', err);
      return res.status(500).json({ status: 500, message: '发布评论失败: ' + err.message });
    }

    const newCommentId = result.insertId;

    // 一级评论更新 mainId 为自身ID
    if (isRootComment) {
      const updateMainIdSql = `
        UPDATE community_comments 
        SET mainId = ? 
        WHERE id = ?
      `;
      db.query(updateMainIdSql, [newCommentId, newCommentId], (updateErr) => {
        if (updateErr) console.error('更新根评论 mainId 失败:', updateErr);
      });
    }

    // 查询新增评论并返回
    const selectSql = `  
      SELECT  
        c.*,  
        u.avatarurl,  
        u.nickname,  
        parent_u.nickname AS parent_nickname  
      FROM community_comments c  
      JOIN user u ON c.user_id = u.id  
      LEFT JOIN community_comments parent_c ON c.superior_id = parent_c.id  
      LEFT JOIN user parent_u ON parent_c.user_id = parent_u.id  
      WHERE c.id = ?  
    `;

    db.query(selectSql, [newCommentId], (err, comment) => {
      if (err) {
        console.error('查询新增评论失败:', err);
        return res.status(500).json({ status: 500, message: '获取评论信息失败: ' + err.message });
      }

      res.status(200).json({
        status: 200,
        message: '评论成功',
        data: comment[0]
      });
    });
  });
};









// 上传社区图片
const uploadCommunityImage = (req, res) => {
  const {
    imageUrl
  } = req.body
  const token = req.headers.authorization?.split(' ')[1];
  let decoded;
  if (!token) {
    return res.send({
      status: 501,
      message: "暂无权限"
    })
  }
  if (jwt.verify(token, jwtSecretKey)) {
    decoded = jwt.decode(token);
  } else {
    return res.send({
      status: 501,
      message: "无效的令牌"
    })
  }
  upload.single('img')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        status: 400,
        message: '文件上传出错' + err
      });
    } else if (err) {
      return res.status(500).json({
        status: 500,
        message: '服务器错误' + err
      });
    }

    // If the upload is successful  
    if (!req.file) {
      return res.status(400).json({
        status: 400,
        message: '未上传文件'
      });
    }
    // Generate the complete image URL  
    const imageUrl = `http://${baseUrl}/community/post/${req.file.filename}`;
    return res.send({
      status: 200,
      message: "图片上传成功",
      imageUrl: imageUrl
    })
  })
}

// 上传帖子
const uploadCommunity = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  let decoded;
  if (!token) {
    return res.send({
      status: 501,
      message: "暂无权限"
    })
  }
  if (jwt.verify(token, jwtSecretKey)) {
    decoded = jwt.decode(token);
  } else {
    return res.send({
      status: 501,
      message: "无效的令牌"
    })
  }
  const {
    title,
    content,
    imageUrl,
    grid_id,
    user_id
  } = req.body
  const createTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const sql = `insert into community_post (title, content, imageUrl, grid_id, time, user_id) values(?, ?, ?, ?, ?, ?)`;
  db.query(sql, [title, content, imageUrl, grid_id, createTime, user_id], (err, result) => {
    if (err) {
      return res.send({
        status: 500,
        message: '数据库查询出错: ' + err
      });
    }
    res.send({
      status: 200,
      message: '发布成功'
    })
  })
}

// 根据id获取帖子(历史游览记录)
const byIdGetCommunity = (req, res) => {
  const { ids } = req.body; // 接收 ids 数组  
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.send({
      status: 501,
      message: "暂无权限"
    });
  }

  // 解码 token  
  const decoded = jwt.decode(token);

  // 验证 token  
  if (!jwt.verify(token, jwtSecretKey)) {
    return res.send({
      status: 501,
      message: "无效的令牌"
    });
  }

  // 构建 SQL 查询语句  
  const sql = `  
    SELECT p.*, u.nickname, u.avatarurl  
    FROM community_post p  
    JOIN user u ON p.user_id = u.id  
    WHERE p.id IN (?)  
  `;

  // 使用 mysql 库执行查询  
  db.query(sql, [ids], (err, results) => {
    if (err) {
      return res.send({
        status: 500,
        message: '数据库查询出错: ' + err
      });
    }

    res.send({
      status: 200,
      data: results
    });
  });
};

// 获取我发布的贴子
const getMyPostCommunity = (req, res) => {
  const { user_id } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.send({
      status: 501,
      message: "暂无权限"
    });
  }

  // 解码 token  
  const decoded = jwt.decode(token);

  // 验证 token  
  if (!jwt.verify(token, jwtSecretKey)) {
    return res.send({
      status: 501,
      message: "无效的令牌"
    });
  }

  // 构建 SQL 查询语句  
  const sql = `  
    SELECT p.*, u.nickname, u.avatarurl  
    FROM community_post p  
    JOIN user u ON p.user_id = u.id  
    WHERE user_id = ?
  `;

  // 使用 mysql 库执行查询  
  db.query(sql, [user_id], (err, results) => {
    if (err) {
      return res.send({
        status: 500,
        message: '数据库查询出错: ' + err
      });
    }

    res.send({
      status: 200,
      data: results
    });
  });
}

// 删除帖子
const deletePostCommunity = (req, res) => {
  const { user_id, id } = req.body; // 接收 ids 数组  
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.send({
      status: 501,
      message: "暂无权限"
    });
  }

  // 解码 token  
  const decoded = jwt.decode(token);

  // 验证 token  
  if (!jwt.verify(token, jwtSecretKey)) {
    return res.send({
      status: 501,
      message: "无效的令牌"
    });
  }

  // 构建 SQL 查询语句  
  const sql = `  
    delete FROM community_post WHERE user_id = ? and id = ?
  `;

  // 使用 mysql 库执行查询  
  db.query(sql, [user_id, id], (err, results) => {
    if (err) {
      return res.send({
        status: 500,
        message: '数据库查询出错: ' + err
      });
    }

    res.send({
      status: 200,
      data: results,
      messgae: "删除成功"
    });
  });
}

// 查询帖子是否为我发布的接口
const checkMyPostCommunity = (req, res) => {
  const { user_id, id } = req.body; // user_id为当前用户的ID，id为要检查的帖子ID
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.send({
      status: 501,
      message: "暂无权限"
    });
  }

  // 解码token
  const decoded = jwt.decode(token);

  // 验证token
  if (!jwt.verify(token, jwtSecretKey)) {
    return res.send({
      status: 501,
      message: "无效的令牌"
    });
  }

  // 构建SQL查询语句
  const sql = `
        SELECT COUNT(*) as count
        FROM community_post p
        WHERE p.user_id =? AND p.id =?
    `;

  // 使用mysql库执行查询
  db.query(sql, [user_id, id], (err, results) => {
    if (err) {
      return res.send({
        status: 500,
        message: '数据库查询出错: ' + err
      });
    }

    const count = results[0].count;
    const isMyPost = count > 0;
    res.send({
      status: 200,
      data: isMyPost
    });
  });
}

const fs = require('fs') // 用于文件删除
const { log } = require('console')

// 后端的社区管理
// 工具函数：从图片URL提取文件名
const getFileNameFromUrl = (imageUrl) => {
  if (!imageUrl) return '';
  return imageUrl.split('/').pop();
};
// 获取社区板块列表
const getCommunityList = (req, res) => {
  const sql = `select * from community_topic`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.send({ status: 500, message: '数据库查询出错: ' + err });
    }
    res.send({ status: 200, message: result });
  });
};
// 上传社区封面图
const uploadCommunityCover = (req, res) => {
  upload.single('cover')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.send({ status: 400, message: '文件上传出错: ' + err.message });
    } else if (err) {
      return res.send({ status: 400, message: err.message });
    }
    if (!req.file) {
      return res.send({ status: 400, message: '未上传文件' });
    }
    const imageUrl = `http://${baseUrl}/community/post/${req.file.filename}`;
    return res.send({
      status: 200,
      message: "图片上传成功",
      imageUrl: imageUrl
    });
  });
};
// 新增社区
const addCommunity = (req, res) => {
  const { name, cover, description } = req.body;
  if (!name || !cover || !description) {
    return res.send({ status: 400, message: "名称、封面图URL和描述不能为空" });
  }
  const sql = `INSERT INTO community_topic (name, cover, description) VALUES (?, ?, ?)`;
  db.query(sql, [name, cover, description], (err, result) => {
    if (err) {
      console.error('新增数据出错:', err);
      return res.send({ status: 500, message: "新增数据失败" });
    }
    return res.send({
      status: 200,
      message: "新增社区成功",
      insertId: result.insertId
    });
  });
};

// 修改社区
const updateCommunity = (req, res) => {
  const { id, name, cover, description } = req.body;
  if (!id || !name || !cover || !description) {
    return res.send({ status: 400, message: "ID、名称、封面图URL和描述不能为空" });
  }
  const getOldSql = `SELECT cover FROM community_topic WHERE id = ?`;
  db.query(getOldSql, [id], (oldErr, oldResults) => {
    if (oldErr) {
      console.error('查询旧数据出错:', oldErr);
      return res.send({ status: 500, message: "修改数据失败" });
    }
    if (oldResults.length === 0) {
      return res.send({ status: 404, message: "未找到对应要修改的社区" });
    }
    const oldCoverUrl = oldResults[0].cover;
    const newCoverUrl = cover;
    const updateSql = `UPDATE community_topic SET name = ?, cover = ?, description = ? WHERE id = ?`;
    db.query(updateSql, [name, newCoverUrl, description, id], (updateErr, results) => {
      if (updateErr) {
        console.error('修改数据出错:', updateErr);
        return res.send({ status: 500, message: "修改数据失败" });
      }
      if (results.affectedRows > 0) {
        if (newCoverUrl !== oldCoverUrl) {
          const oldFileName = getFileNameFromUrl(oldCoverUrl);
          const oldFilePath = path.join('public/community/post', oldFileName);
          if (fs.existsSync(oldFilePath)) {
            fs.unlink(oldFilePath, (unlinkErr) => {
              if (unlinkErr) console.error('删除旧封面图失败:', unlinkErr);
            });
          }
        }
        return res.send({ status: 200, message: "修改社区成功" });
      } else {
        return res.send({ status: 404, message: "未找到对应要修改的社区" });
      }
    });
  });
};


// 删除社区
const deleteCommunity = (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.send({ status: 400, message: "ID不能为空" });
  }
  const getCoverSql = `SELECT cover FROM community_topic WHERE id = ?`;
  db.query(getCoverSql, [id], (imgErr, imgResults) => {
    if (imgErr) {
      console.error('查询封面图出错:', imgErr);
      return res.send({ status: 500, message: "删除社区失败" });
    }
    const deleteSql = `DELETE FROM community_topic WHERE id = ?`;
    db.query(deleteSql, [id], (delErr, results) => {
      if (delErr) {
        console.error('删除社区出错:', delErr);
        return res.send({ status: 500, message: "删除社区失败" });
      }
      if (results.affectedRows > 0) {
        const fileName = getFileNameFromUrl(imgResults[0].cover);
        const filePath = path.join('public/community/post', fileName);
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error('删除封面图失败:', unlinkErr);
          });
        }
        return res.send({ status: 200, message: "删除社区成功" });
      } else {
        return res.send({ status: 404, message: "未找到对应要删除的社区" });
      }
    });
  });
};


// 帖子管理
// 图片过滤（支持多图）
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('仅支持 JPG、PNG、GIF、WebP 格式图片'), false);
  }
};
// 单图上传中间件
const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 单图5MB限制
}).single('img');
// 多图上传中间件
const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 单图5MB
    files: 9, // 最多上传9张图
  },
}).array('images', 9);
//封装上传逻辑（单图）
const handleSingleUpload = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.send({ status: 400, message: '文件上传出错：' + err.message });
    } else if (err) {
      return res.send({ status: 400, message: err.message });
    }
    next();
  });
}
// 封装上传逻辑（多图）
const handleMultipleUpload = (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.send({ status: 400, message: '文件上传出错：' + err.message });
    } else if (err) {
      return res.send({ status: 400, message: err.message });
    }
    next();
  });
};

// 工具函数：删除单个文件
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// 工具函数：批量删除文件
const deleteFiles = (filePaths) => {
  filePaths.forEach((path) => {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  });
};

// 获取所有帖子（支持分页）
const getCommunityPostList = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;
  const sql = `
  SELECT
    p.*,
    u.nickname,
    u.avatarurl,
    t.name AS topic_name
FROM community_post p
LEFT JOIN user u ON p.user_id = u.id
LEFT JOIN community_topic t ON p.grid_id = t.id;
  `;
  const countSql = `SELECT COUNT(*) as total FROM community_post`;
  db.query(sql, [offset, pageSize], (err, listResult) => {
    if (err) {
      return res.send({ status: 500, message: '查询列表失败: ' + err });
    }
    db.query(countSql, (countErr, countResult) => {
      if (countErr) {
        return res.send({ status: 500, message: '查询总数失败: ' + countErr });
      }
      res.send({
        status: 200,
        message: listResult,
        total: countResult[0].total,
        page,
        pageSize,
      });
    });
  });
};


// 获取单个帖子详情
const getCommunityPostDetail = (req, res) => {
  const { id } = req.body;
  const sql = `
    SELECT p.*, u.nickname, u.avatarurl, t.name as topic_name
    FROM community_post p
    JOIN user u ON p.user_id = u.id
    JOIN community_topic t ON p.grid_id = t.id
    WHERE p.id = ?
  `;
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.send({ status: 500, message: '查询详情失败: ' + err });
    }
    res.send({ status: 200, message: result[0] || {} });
  });
};
// 上传帖子图片（多图）
const uploadPostImages = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.send({ status: 400, message: '未上传图片' });
  }
  const imageUrls = req.files.map((file) => `http://${baseUrl}/community/post/${file.filename}`);
  res.send({
    status: 200,
    message: '图片上传成功',
    imageUrls,
  });
};

//todo  新增帖子（需要加用户id 不是adm的id）
const addCommunityPost = (req, res) => {
  const { title, content, imageUrl, grid_id, user_id } = req.body;
  if (!title || !content || !grid_id, !user_id) {
    return res.send({ status: 400, message: '标题、内容、板块ID和用户ID不能为空' });
  }
  console.log(user_id);

  const sql = `
    INSERT INTO community_post (title, content, imageUrl, grid_id, time, user_id, status)
    VALUES (?, ?, ?, ?, NOW(), ?, 1)
  `;
  db.query(sql, [title, content, imageUrl, grid_id, user_id], (err, result) => {
    if (err) {
      return res.send({ status: 500, message: '新增失败: ' + err });
    }
    res.send({ status: 200, message: '发布帖子成功', insertId: result.insertId });
  });
};

//todo 修改帖子（刚刚修改）
const updateCommunityPost = (req, res) => {
  const { id, user_id, title, content, imageUrl, grid_id, status } = req.body;
  if (!id || !title || !content || !grid_id || !status) {
    return res.send({ status: 400, message: 'ID、标题、内容、板块ID和状态不能为空' });
  }
  // 查询旧图片
  const getOldSql = `SELECT imageUrl FROM community_post WHERE id = ?`;
  db.query(getOldSql, [id], (oldErr, oldResult) => {
    if (oldErr) {
      return res.send({ status: 500, message: '查询旧数据失败: ' + oldErr });
    }
    if (oldResult.length === 0) {
      return res.send({ status: 404, message: '未找到该帖子' });
    }
    const oldImages = oldResult[0].imageUrl.split(',').filter(Boolean); // 拆分旧图URL数组
    // 执行更新
    const updateSql = `
      UPDATE community_post 
      SET title = ?, content = ?, imageUrl = ?, grid_id = ?,status=?
      WHERE id = ?
    `;
    db.query(updateSql, [title, content, imageUrl, grid_id, status, id], (updateErr, result) => {
      if (updateErr) {
        return res.send({ status: 500, message: '修改失败: ' + updateErr });
      }
      if (result.affectedRows > 0) {
        // 删除旧图片（若新图与旧图不同）
        const newImages = imageUrl.split(',').filter(Boolean);
        const oldFilePaths = oldImages.map((url) => {
          const fileName = getFileNameFromUrl(url);
          return path.join('public/community/post', fileName);
        });
        const newFileNames = newImages.map((url) => getFileNameFromUrl(url));
        const needDelete = oldFilePaths.filter((path) => {
          const fileName = path.split('/').pop();
          return !newFileNames.includes(fileName);
        });
        deleteFiles(needDelete);
        res.send({ status: 200, message: '修改帖子成功' });
      } else {
        res.send({ status: 404, message: '未找到该帖子' });
      }
    });
  });
};
//删除帖子（含图片删除）
const deleteCommunityPost = (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.send({ status: 400, message: 'ID不能为空' });
  }
  // 查询图片
  const getImagesSql = `SELECT imageUrl FROM community_post WHERE id = ?`;
  db.query(getImagesSql, [id], (imgErr, imgResult) => {
    if (imgErr) {
      return res.send({ status: 500, message: '查询图片失败: ' + imgErr });
    }
    // 删除数据库记录
    const deleteSql = `DELETE FROM community_post WHERE id = ?`;
    db.query(deleteSql, [id], (delErr, result) => {
      if (delErr) {
        return res.send({ status: 500, message: '删除失败: ' + delErr });
      }
      if (result.affectedRows > 0) {
        // 删除图片文件
        const images = imgResult[0].imageUrl.split(',').filter(Boolean);
        const filePaths = images.map((url) => {
          const fileName = getFileNameFromUrl(url);
          return path.join('public/community/post', fileName);
        });
        deleteFiles(filePaths);
        res.send({ status: 200, message: '删除帖子成功' });
      } else {
        res.send({ status: 404, message: '未找到该帖子' });
      }
    });
  });
};

module.exports = {
  getCommunityItem,
  getCommunityTopic,
  getCommunityItemInfo,
  getTopicInfo,
  getComments,
  searchCommunity,
  uploadCommunityImage,
  uploadCommunity,
  byIdGetCommunity,
  addComments,
  getMyPostCommunity,
  deletePostCommunity,
  checkMyPostCommunity,
  getCommunityList, // 获取所有社区
  uploadCommunityCover,
  addCommunity,
  updateCommunity,
  deleteCommunity,
  getCommunityPostList,
  getCommunityPostDetail,
  uploadPostImages,
  addCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
}
