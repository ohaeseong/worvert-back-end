import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { BookMark } from "../database/models/BookMark";
import { Repository } from "typeorm";

// 의존성 주입 (객체를 인스턴스화 시킬 경우 Service 데코 사용)
@Service()
export class BookMarkService {
  // InjectRepository은 Repository를 생성자 주입 해주기 위해 사용한다. (의존성 주입)
  constructor(
    @InjectRepository(BookMark) private readonly bookmarkRepo: Repository<BookMark>,
  ) { }

      // memberId, pw로 회원 검색
  public async bookmarkPost(postId: string, memberId: string) {
    const bookmark = await this.bookmarkRepo.save({
            memberId,
            postId,
        });

    return bookmark;
  };

  public async findBookmarkCheck(postId: string, memberId: string) {
    const bookmark = await this.bookmarkRepo.findOne({
        memberId,
        postId,
    });

    return bookmark;
  }

  public async cancleBookmark(postId: string, memberId: string) {
    const bookmark = await this.bookmarkRepo.delete({
        memberId,
        postId,
    });

    return bookmark;
  }

  public async getBookmarkPostByMemberId(memberId: string) {
    const posts = await this.bookmarkRepo.find({
        relations:['post'],
        where: {
          memberId,
        },
      });
  
      return posts;
  }

  public async checkMemberBookmark(memberId: string, postId: string) {
    const bookmark = await this.bookmarkRepo.findOne({
        where: {
          memberId,
          postId,
        },
      });
  
      return bookmark;
  }

}