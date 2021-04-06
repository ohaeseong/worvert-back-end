import Joi from '@hapi/joi';

// 게시글 작성 요청 값 검사 함수
export const writePostValidate = (body: Object) => {
    const schema = Joi.object().keys({
      title: Joi.string().max(50).required(),
      contents: Joi.string().required(),
      tags: Joi.array().allow(null),
      // category: Joi.string().required(),
      // series: Joi.string().allow(null).allow(''),
      // kinds: Joi.string().required(),
      // thumbnailAddress: Joi.string().allow(null).allow(''),
    });
  
    return schema.validateAsync(body);
  };

  // 게시글 수정 요청 값 검사 함수
export const updatePostValidate = (body: Object) => {
    const schema = Joi.object().keys({
      id: Joi.string().required(),
      title: Joi.string().max(50).required(),
      contents: Joi.string().required(),
      tags: Joi.array().allow(null),
      thumbnailAddress: Joi.string().allow(null).allow(''),
    });
  
    return schema.validateAsync(body);
  };

// 게시글 댓글 작성 요청 값 검사 함수
export const createPostCommentValidate = (body: Object) => {
  const schema = Joi.object().keys({
    commentTxt: Joi.string().max(1000).required(),
    postId: Joi.string().required(),
  });

  return schema.validateAsync(body);
};

export const createPostReplyCommentValidate = (body: Object) => {
  const schema = Joi.object().keys({
    commentTxt: Joi.string().max(1000).required(),
    postId: Joi.string().required(),
    replyCommentIdx: Joi.number().integer(),
  });

  return schema.validateAsync(body);
}

// 게시글 댓글 수정 요청 값 검사 함수
export const updatePostCommentValidate = (body: Object) => {
  const schema = Joi.object().keys({
    commentIdx: Joi.number().integer().required(),
    commentTxt: Joi.string().max(1000).required(),
  });

  return schema.validateAsync(body);
};

// 게시글 출간 요청 값 검사 함수
export const publishPostValidate = (body: Object) => {
  const schema = Joi.object().keys({
    id: Joi.string().required(),
    kinds: Joi.string().required(),
    thumbnailAddress: Joi.string().allow(null).allow(''),
    publishType: Joi.number().integer().required(),
    intro: Joi.string().allow(null).allow(''),
    category: Joi.string().required(),
    slugUrl: Joi.string().required(),
  });

  return schema.validateAsync(body);
};