import Joi from '@hapi/joi';

// 사용자 로그인시 요청 값 검사 함수
export const loginValidate = (body: Object) => {
    const schema = Joi.object().keys({
      memberId: Joi.string().max(50).required(),
      pw: Joi.string().max(500).required(),
    });
  
    return schema.validateAsync(body);
};

// 사용자 회원가입 api 요청 값 검사 함수
export const registerAccountValidate = (body: Object) => {
  const schema = Joi.object().keys({
    memberId: Joi.string().max(50).required(),
    pw: Joi.string().max(500).required(),
  });

  return schema.validateAsync(body);
};