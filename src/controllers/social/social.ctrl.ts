import { Response } from 'express';
import { Service } from "typedi";
import { AuthRequest, SocialMemberListTypes } from '../../typings';
import * as colorConsole from '../../lib/console';
import { SocialService } from '../../services/social.service';
import { AuthService } from '../../services/auth.service';
import { asyncForeach } from '../../lib/method.lib';
import { Social } from '../../database/models/Social';

@Service()
export class SocialCtrl {
    constructor(
        private socialService: SocialService,
        private authService: AuthService,
    ) { }

    public isFollowMember = async (req: AuthRequest, res: Response) => {
        colorConsole.info('[POST] member is follow');
        const { followMemberId } = req.body;
        const { memberId } = req.decoded;


        if (!followMemberId) {
            res.status(400).json({
                status: 400,
                message: 'followMemberId를 함께 요청하세요',
            });

            return;
        }

        try {
            const isFollowUser = await this.authService.findUserById(followMemberId);

            if (!isFollowUser) {
                res.status(404).json({
                    status: 404,
                    message: '사용자를 찾을 수 없습니다',
                });
    
                return;
            }


            const member = await this.socialService.findFollowMember(memberId, followMemberId);
            
            if (member) {
                await this.socialService.unFollowMember(memberId, followMemberId);
                const memberList = await this.socialService.findFollowings(memberId);

                res.status(200).json({
                    status: 200,
                    message: 'follow 취소 신청 완료',
                    followInfo: memberList,
                });

                return;
            }

            await this.socialService.followMember(memberId, followMemberId);

            res.status(200).json({
                status: 200,
                message: 'follow 신청 완료',
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
            status: 500,
            message: '서버 에러!'
            });
        }
    }

    public getFollowInfo = async (req: AuthRequest, res: Response) => {
        colorConsole.info('[GET] look up followers list');
        const memberId: string  = req.query.memberId as string;
        const type: string  = req.query.type as string;

        if (!memberId || !type) {
            res.status(400).json({
                status: 400,
                message: 'memberId 함께 요청하세요',
            });

            return;
        }

        try {
            let memberList: SocialMemberListTypes[];
            if (type === "follower") {
                memberList = await this.socialService.findFollowers(memberId);
                const followingMemberList = await this.socialService.findFollowings(memberId);

                memberList.forEach((member) => {
                    console.log(member.memberId);
                    
                    for (let i = 0; i < followingMemberList.length; i++) {
                        if (member.memberId === followingMemberList[i].following) {
                            // member = null;
                            member.isFollow = true;
                            
                        }
                        
                    }
                })
            } else if (type === "following") {
                memberList = await this.socialService.findFollowings(memberId);
                
                await asyncForeach(memberList, async (member: any) => {
                    const memberData = await this.authService.findUserById(member.following);
                    member.member = {
                        ...memberData
                    };
                });
            }
            
            memberList.forEach((member) => {
                delete member.member.pw;
                delete member.member.accessLevel;
            });

            res.status(200).json({
                status: 200,
                message: 'followers 목록 조회 성공',
                data: {
                    memberList,
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
            status: 500,
            message: '서버 에러!'
            });
        }
    }
}