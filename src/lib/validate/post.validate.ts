import Joi from '@hapi/joi';

// 게시글 작성 요청 값 검사 함수
export const writePostValidate = (body: Object) => {
    const schema = Joi.object().keys({
      title: Joi.string().max(50).required(),
      contents: Joi.string().required(),
      category: Joi.string().required(),
      series: Joi.string().allow(null).allow(''),
      thumbnailAddress: Joi.string().allow(null).allow(''),
    });
  
    return schema.validateAsync(body);
  };

  // 게시글 수정 요청 값 검사 함수
export const updatePostValidate = (body: Object) => {
    const schema = Joi.object().keys({
      id: Joi.string().required(),
      title: Joi.string().max(50).required(),
      contents: Joi.string().required(),
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
  
  // 게시글 댓글 수정 요청 값 검사 함수
  export const updatePostCommentValidate = (body: Object) => {
    const schema = Joi.object().keys({
      commentIdx: Joi.number().integer().required(),
      commentTxt: Joi.string().max(1000).required(),
    });
  
    return schema.validateAsync(body);
  };