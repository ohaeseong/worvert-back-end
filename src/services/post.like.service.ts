import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Like } from '../database/models/Like';

// 의존성 주입 (객체를 인스턴스화 시킬 경우 Service 데코 사용)
@Service()
export class PostLikeService {

  // InjectRepository은 Repository를 생성자 주입 해주기 위해 사용한다. (의존성 주입)
  constructor(
    @InjectRepository(Like) private readonly likeRepo: Repository<Like>,
  ) { }

    // 좋아요 추가 함수
    public async addLikeByPostId(postId: string, memberId: string) {

        const likeData = await this.likeRepo.save({
            postId,
            memberId,
        });

        return likeData;
    }

    public async cancelLikeByPostId(postId: string, memberId: string) {

        const likeData = await this.likeRepo.delete({
            // postId,
            memberId,
        });

        return likeData;
    }

    public async findLikeWithPostIdAndMemberId(postId: string, memberId: string) {
        const likeData = await this.likeRepo.findOne({
                // postId,
                memberId,
            });

        return likeData;
    }
}