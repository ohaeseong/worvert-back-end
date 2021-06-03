import { v4 as uuid4 } from 'uuid';
import Crypto from 'crypto-js';
import config from '../../config';

const { cryptoSecret } = config;

// 파일 이름 생성 시 사용하는 uuid 생성 함수
export const generatedId = () => {
  let id: string = uuid4();
  const token = id.split('-');

  id = token[2] + token[1] + token[0] + token[3] + token[4];

  return id;
};

export const asyncForeach = async (array: any[], callback: any) => {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i]);
  }
};

export const encodingCode = (code: string) => {
  return Crypto.AES.encrypt(JSON.stringify({ code }), cryptoSecret).toString();
};

export const decodeCode = (encodingCode: string) => {
  
  encodingCode = encodingCode.replace(" ", "+");
  console.log(encodingCode);
  
  
  const bytes = Crypto.AES.decrypt(encodingCode, cryptoSecret).toString(Crypto.enc.Utf8);
  
  
  return JSON.parse(bytes).code;
}