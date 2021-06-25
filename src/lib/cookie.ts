import { Response } from 'express';

export function setTokensCookie(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
    memberId: string,
  ) {
    
    // set cookie
    // res.cookie('access_token', tokens.accessToken, {
    //   httpOnly: true,
    //   maxAge: 1000 * 60 * 60,
    //   domain: '.work-it.co.kr'
    // });
  
    // res.cookie('refresh_token', tokens.refreshToken, {
    //   httpOnly: true,
    //   maxAge: 1000 * 60 * 60 * 24 * 30,
    //   domain: '.work-it.co.kr'
    // });

    // res.cookie('user_id', memberId, {
    //   httpOnly: true,
    //   maxAge: 1000 * 60 * 60,
    //   domain: '.work-it.co.kr'
    // });

    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60
    });
  
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30
    });

    res.cookie('user_id', memberId, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30
    });

  }

  export function removeUserCookie(
    res: Response,
  ) {
    // set cookie
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.clearCookie('user_info');
  }