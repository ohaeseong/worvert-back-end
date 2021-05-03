import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Tag } from '../database/models/Tag';

// 의존성 주입 (객체를 인스턴스화 시킬 경우 Service 데코 사용)
@Service()
export class PostTagService {

  // InjectRepository은 Repository를 생성자 주입 해주기 위해 사용한다. (의존성 주입)
  constructor(
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
  ) { }

  public async getTags(postId: string) {
    const tags = await this.tagRepo.find({
        postId,
    });

    return tags;
  }

  public async addTag(postId: string, tagName: string) {
    const tag = await this.tagRepo.save({
        postId,
        tagName,
    });

    return tag;
  }

  public async getPostsByTag(tag: string) {

    // posts member별 조회
    const posts = await this.tagRepo.find({
      relations: ['post'],
      where: {
        tagName: tag,
      }
    });

    return posts;
  }

  public async deleteAllTags(postId: string) {
    const tags = await this.tagRepo.delete({
        postId,
    });

    return tags;
  }
}