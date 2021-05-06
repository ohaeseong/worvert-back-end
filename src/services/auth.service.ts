import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Member } from "../database/models/Member";
import { Repository } from "typeorm";
import { MemberData, MemberUpdateInfo } from "../typings";

// 의존성 주입 (객체를 인스턴스화 시킬 경우 Service 데코 사용)
@Service()
export class AuthService {
  // InjectRepository은 Repository를 생성자 주입 해주기 위해 사용한다. (의존성 주입)
  constructor(
    @InjectRepository(Member) private readonly memberRepo: Repository<Member>,
  ) { }

  // memberId, pw로 회원 검색
  public async login(memberId: string, pw: string) {
    const member = await this.memberRepo.findOne({
      where: {
        memberId,
        pw,
      },
    });

    return member;
  };

  public async findUserById(memberId: string) {
    const member = await this.memberRepo.findOne({
      where: {
        memberId,
      },
    });

    return member;
  };

  public async findUserByEmail(email: string) {
    const member = await this.memberRepo.findOne({
      where: {
        email,
      },
    });

    return member;
  };

  public async findUserByGithubId(id: string) {
    const member = await this.memberRepo.findOne({
      where: {
        githubId: id,
      },
    });

    return member;
  };

  public async createUserWithGithub(memberData: MemberData) {
    const member = await this.memberRepo.save({
      ...memberData,
    });

    return member;
  }

  public async updateUserInfo(memberInfo: MemberUpdateInfo) {
    const member = await this.memberRepo.update({
      memberId: memberInfo.memberId
    }, {
      ...memberInfo,
    });

    return member;
  }


  public async updateUserProfileImage(memberId: string, profileImage: string) {
    const member = await this.memberRepo.update({
      memberId,
    }, {
      profileImage,
    });

    return member;
  }

  public async updateUserIntroduce(introduce: string, memberId: string) {
    const member = await this.memberRepo.update({
      memberId,
    }, {
      introduce,
    });

    return member;
  }
}