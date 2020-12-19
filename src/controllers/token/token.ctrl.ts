import { Response } from 'express';
import { AuthRequest } from "../../typings";
// import { Service } from 'typedi';
import * as tokenLib from '../../lib/token.lib';
import * as colorConsole from '../../lib/console';

// @Service()
export class TokenCtrl {
    constructor(

    ) { }

    // refresh token 으로 사용자 토큰 재발급
    public createToken = async (req: AuthRequest, res: Response) => {
        colorConsole.info('[POST] token reissuance api called');
        const { body } = req;

        if (!body.refreshToken) {
            res.status(400).json({
                status: 400,
                messgae: 'please check the body form (refreshToken is not found)'
            });

            return;
        }

        try {
            const { refreshToken } = body;
            const verifyedRefreshToken: any = await tokenLib.verifyToken(refreshToken);

            if (verifyedRefreshToken.iss !== 'tech-diary.com' || verifyedRefreshToken.sub !== 'refresh') {
                res.status(401).json({
                    status: 401,
                    message: 'This refreshToken is not issued from tech-diary.com or this refreshToken type is not \'refresh\'.'
                });

                return;
            }

            const { memberId, accessLevel } = verifyedRefreshToken;

            const token = await tokenLib.createToken(memberId, accessLevel);

            res.status(200).json({
                status: 200,
                message: 'refreshToken issuance success!',
                tokenData: {
                    token,
                },
            });
        } catch (error) {
            colorConsole.error(error);
                // 에러 검색후 status, message 값 받기
            let [status, message] = tokenLib.searchTokenError(error);
            
            // status 타입 변경
            status = status as number;
            
            res.status(status).json({
                status,
                message,
            });
        } 
    }
}