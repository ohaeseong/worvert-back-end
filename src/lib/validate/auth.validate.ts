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

// 사용자 인증 메일 api 요청 값 검사 함수
export const certificationEmailValidate = (body: Object) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
  });

  return schema.validateAsync(body);
};


// 사용자 정보 수정 요청값 검사 함수
export const modifyUserInfoValidate = (body: Object) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().allow('').allow(null),
    memberName: Joi.string().max(50).allow(null),
    profileImage: Joi.string().allow(null),
  });

  return schema.validateAsync(body);
};