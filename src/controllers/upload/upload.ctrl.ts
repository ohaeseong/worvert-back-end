import { Service } from "typedi";
import { Response } from 'express';
import { AuthRequest } from "../../typings";
import * as colorConsole from '../../lib/console';
import config from '../../../config';

@Service()
export class UploadCtrl {
  constructor() { }

  // 이미지 업로드
  public uploadImgs = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[POST] image upload api was called');
    const { files } = req;
    const imgs = [];

    // 파일 길이가 0 이하일 경우
    if (!files) {
      res.status(400).json({
        status: 400,
        message: '이미지를 첨부해 주세요.'
      });

      return;
    }

    try {
      // 서버 ip, 주소 가져오기
      const { replace } = config;

      // 파일 값을 토대로 이미지 주소 생성
      for (const[_, file] of Object.entries(files)) {
        const fileAddress = `${replace}/static/img/${file.filename}`;

        imgs.push({ fileAddress });
      }

      res.status(200).json({
        status: 200,
        message: '이미지 저장 성공.',
        data: {
          imgs,
        },
      });
    } catch (error) {
      colorConsole.error(error);

      res.status(500).json({
        status: 500,
        message: '서버 에러.'
      });
    }
  }
}