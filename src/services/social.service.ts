import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Social } from "../database/models/Social";
import { Repository } from "typeorm";

// 의존성 주입 (객체를 인스턴스화 시킬 경우 Service 데코 사용)
@Service()
export class SocialService {
  // InjectRepository은 Repository를 생성자 주입 해주기 위해 사용한다. (의존성 주입)
  constructor(
    @InjectRepository(Social) private readonly socialRepo: Repository<Social>,
  ) { }


  // memberId, pw로 회원 검색
  public async followMember(memberId: string, followingMember: string) {
    const member = await this.socialRepo.save({
        memberId,
        following: followingMember,
    });

    return member;
  };

//   public async unFollowMember()


}