import { Response } from 'express';
import { Service } from "typedi";
import { AuthRequest } from '../../typings';

@Service()
export class SocialCtrl {
    

    public isFollowMember = async (req: AuthRequest, res: Response) => {
        try {

        } catch () {
            
        }
    }
}