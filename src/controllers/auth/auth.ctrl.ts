import { Response } from 'express';
import { Service } from "typedi";
import axios from 'axios';
import dotenv from 'dotenv';

import { AuthService } from "../../services/auth.service";
import { AuthRequest } from "../../typings";
import * as Validate from '../../lib/validate/auth.validate';
import * as emailLib from '../../lib/email';
import * as tokenLib from '../../lib/token.lib';
import * as colorConsole from '../../lib/console';
import { decodeCode } from '../../lib/method.lib';

import config from '../../../config';

const { emailCodeKey } = config;

dotenv.config();

@Service()
export class AuthCtrl {
  constructor(
    private authService: AuthService,
  ) { }

  // 사용자 로그인 함수
  public login = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[POST] user login api was called');
    const { body } = req;

    // 로그인 요청 값 검사
    try {
      await Validate.loginValidate(body);
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: '요청 오류!',
      });

      return;
    }

    try {
      const { memberId, pw } = body;

      // 회원 조회
      const member = await this.authService.login(memberId, pw);

      // 회원 조회 실패
      if (!member) {
        res.status(404).json({
          status: 404,
          message: '가입 되지 않는 회원!',
        });
  
        return;
      }

      // 토큰 발급
      const token = await tokenLib.createToken(memberId, member.accessLevel, member.profileImage);
      const refreshToken = await tokenLib.createRefreshToken(memberId);

      delete member.pw;

      res.status(200).json({
        status: 200,
        message: '로그인 성공!',
        data: {
          token,
          refreshToken,
          member,
        }
      });
    } catch (error) {
      colorConsole.error(error);

      res.status(500).json({
        status: 500,
        message: '서버 에러',
      });
    }
  };

  public loginWithGithub = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[POST] github login api was called');
    const { code } = req.body;

    if (!code) {
      res.status(400).json({
        status: 400,
        message: '요청 오류!',
      });

      return;
    }

    try {
      const response = await axios.post('https://github.com/login/oauth/access_token', {
        code,
        client_id: process.env.GIT_HUB_CLIENT_ID,
        client_secret: process.env.GIT_HUB_CLIENT_SECRET,
      }, {
        headers: {
          accept: 'application/json',
        },
      });

      const githubToken = response.data.access_token;      

      const { data } = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${githubToken}`,
        },
      });

      const { id, avatar_url, login, name } = data;

      const member = await this.authService.findUserByGithubId(id);

      if (!member) {
        res.status(404).json({
          status: 404,
          message: '첫 로그인 (깃헙으로 가입)!',
          data: {
            id,
            login,
            name,
            avatarUrl: avatar_url,
          }
        });                                                                                                                                                                                                                                                                             
  
        return;
      }
      let userInfo = member;

      const token = await tokenLib.createToken(userInfo.memberId, 1, avatar_url);
      
      delete userInfo.pw;

      res.status(200).json({
        status: 200,
        message: '깃헙 로그인 성공!',
        data: {
          token,
          member: { ...userInfo },
        },
      });
        
    } catch (error) {
      colorConsole.error(error);

      res.status(500).json({
        status: 500,
        message: '서버 에러',
      });
    }
  };

  public loginWithFacebook = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[POST] facebook login api was called');
    // const { code } = req.body;

    // if (!code) {
    //   res.status(400).json({
    //     status: 400,
    //     message: '요청 오류!',
    //   });

    //   return;
    // }

    try {

      res.status(200).json({
        status: 200,
        message: '페이스북 로그인 성공!',
      });
        
    } catch (error) {
      colorConsole.error(error);

      res.status(500).json({
        status: 500,
        message: '서버 에러',
      });
    }
  };

  public signUpEmailSend = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[POST] certification mail send api called');
    const { body } = req;

    try {
      await Validate.certificationEmailValidate(body);
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: 'email validate fail!',
      });

      return;
    }


    try {
      const { email } = body;

      const member = await this.authService.findUserByEmail(email);

      if (member) {
        res.status(403).json({
          status: 403,
          message: '이미 가압된 계정입니다.',
        });

        return;
      }

      await emailLib.sendSignUpLinkEmail(email);

      res.status(200).json({
        status: 200,
        message: '이메일 발송 성공!',
      });
    } catch (error) {
      colorConsole.error(error);

      res.status(500).json({
        status: 500,
        message: '서버 에러',
      });
    }
  }

  public createUserIdAndNameForGithub = async (req: AuthRequest, res: Response) => {
    const { memberId, memberName, githubId, avatarUrl, introduce } = req.body;
    

    if (!memberId || !memberName || !githubId) {
      res.status(400).json({
        status: 400,
        message: '요청 오류!',
      });

      return;
    }

    try {
      const member = await this.authService.findUserById(memberId);

      if (member) {
        res.status(409).json({
          status: 409,
          message: '중복 아이디!',
        });
  
        return;
      }

      const memberData = {
        memberId,
        githubId,
        pw: 'no needs password',
        accessLevel: 1,
        memberName,
        introduce,
        profileImage: avatarUrl,
      };

      const memberCreateData = await this.authService.createUserWithGithub(memberData);

      let userInfo = memberCreateData;

      const token = await tokenLib.createToken(memberId, 1, avatarUrl);
      
      delete userInfo.pw;

      res.status(200).json({
        status: 200,
        message: '깃헙 로그인 성공!',
        data: {
          token,
          member: { ...userInfo },
        },
      });
    } catch (error) {
      colorConsole.error(error);

      res.status(500).json({
        status: 500,
        message: '서버 에러',
      });
    }
  };

  public loginWIthGithubForMobile = async (req: AuthRequest, res: Response) => {
    const { github_token } = req.body;

    if (!github_token) {
      res.status(400).json({
        status: 400,
        message: '요청 오류!',
      });

      return;
    }

    try {
      const { data } = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${github_token}`,
        },
      });

      const { login, id, avatar_url, name } = data;

      const member = await this.authService.findUserById(id);
      let userInfo;

      if (!member) {
        const memberData = {
          memberId: id,
          pw: 'no needs password',
          accessLevel: 1,
          memberName: name,
          profileImage: avatar_url,
        };

        userInfo = await this.authService.createUserWithGithub(memberData);
      } else {
        userInfo = member;
      }

      const token = await tokenLib.createToken(id, 1, avatar_url);
      
      delete userInfo.pw;

      res.status(200).json({
        status: 200,
        message: '깃헙 로그인 성공! (Mobile)',
        data: {
          token,
          member: { ...userInfo },
        },
      });

    } catch (error) {
      colorConsole.error(error);

      res.status(500).json({
        status: 500,
        message: '서버 에러',
      });
    }
  }

  public registerAccount = async (req: AuthRequest, res: Response) => {
    console.log('[POST] register account api called');
    
    const { body } = req;
    
    try {
      await Validate.registerUser(body);
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: '요청 오류',
      });

      return;
    }


    try {
      const { memberId } = body;

      const member = await this.authService.findUserById(memberId);

      if (member) {
        res.status(403).json({
          status: 403,
          message: '이미 존재하는 id 입니다.',
        });
  
        return;
      }

      const decodedCode = await decodeCode(body.code);

      const emailCode = decodedCode.split('/')[0];
      const email = decodedCode.split('/')[1];
      
      if (emailCode !== emailCodeKey) {
        res.status(401).json({
          status: 401,
          message: '잘못된 접근',
        });
  
        return;
      }
      

      body.email = email;
      
      const userInfo = await this.authService.createUser(body);

      const token = await tokenLib.createToken(memberId, 1, );

      delete userInfo.pw;

      res.status(200).json({
        status: 200,
        message: '사용자 정보 저장 성공',
        data: {
          token,
          member: { ...userInfo },
        },
      });
    } catch (error) {
      colorConsole.error(error);

      res.status(500).json({
        status: 500,
        message: '서버 에러',
      });
    }
  };

  public getUserInfo = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[GET] get user info by member id ');
    const memberId: string  = req.query.memberId as string;
    console.log(memberId);
    
    // if (memberId === 'favicon.ico' || memberId === 'undefined') return;

    if (!memberId) {
      res.status(400).json({
        status: 400,
        message: '요청 오류!',
      });

      return;
    }

    try {
      const member = await this.authService.findUserById(memberId);

      if (!member) {
        res.status(404).json({
          status: 404,
          message: '사용자 정보 없음',
        });
      }

      if (member) {
        delete member.pw;
        delete member.accessLevel;
      }

      
      res.status(200).json({
        status: 200,
        message: '사용자 정보 조회 성공',
        data: {
          ...member
        },
      });
    } catch (error) {
      colorConsole.error(error);

      res.status(500).json({
        status: 500,
        message: '서버 에러',
      });
    }
  };

  public modifyUserInfo = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[PUT] modify user info api called');
    const { body } = req;
    const { memberId } = req.decoded;
    
    // try {
    //   await Validate.modifyUserInfoValidate(body);
    // } catch (error) {
    //   res.status(400).json({
    //     status: 400,
    //     message: '요청 오류!',
    //   });

    //   return;
    // }

    try {

      const { profileImage, memberName, email } = body;

      if (profileImage && !memberName && !email) {
        await this.authService.updateUserProfileImage(memberId, profileImage);
      
        res.status(200).json({
          status: 200,
          message: '사용자 정보 수정 성공 (이미지)',
        });

        return;
      }

      const memberInfo = {
        ...body,
        memberId,
      };

      await this.authService.updateUserInfo(memberInfo);
      
      res.status(200).json({
        status: 200,
        message: '사용자 정보 수정 성공',
      });
    } catch (error) {
      colorConsole.error(error);

      res.status(500).json({
        status: 500,
        message: '서버 에러',
      });
    }
  };

  public modifyUserIntroduce = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[PUT] modify user intro api called');
    const { body } = req;
    const { memberId } = req.decoded;
    
    if (!body.introduce || body.introduce.length > 1000) {
      res.status(400).json({
        status: 400,
        message: '요청 오류!',
      });

      return;
    }

    try {
      await this.authService.updateUserIntroduce(body.introduce, memberId);
      
      res.status(200).json({
        status: 200,
        message: '사용자 소개글 수정 성공',
      });
    } catch (error) {
      colorConsole.error(error);

      res.status(500).json({
        status: 500,
        message: '서버 에러',
      });
    }
  };

}