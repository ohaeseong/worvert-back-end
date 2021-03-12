import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PostWriteForm } from '../typings';

import { Post } from '../database/models/Post';

// 의존성 주입 (객체를 인스턴스화 시킬 경우 Service 데코 사용)
@Service()
export class PostService {

  // InjectRepository은 Repository를 생성자 주입 해주기 위해 사용한다. (의존성 주입)
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
  ) { }

  // 게시글을 요청 받은 limit값과 page 별로 조회 한다.
  public async getPostsByLimit(limit: number, category: string, kinds: string) {

    // kins 종류별로 게시글 조회
    if (!kinds) { 
      const posts = await this.postRepo.find({
        relations:['member', 'comments'],
        where: {
          category,
          state: 1,
        },
        order: {
          createTime: "DESC"
        },
        skip: 0,
        take: limit,
      });

      return posts;
    }

    // kinds all 조회
    const posts = await this.postRepo.find({
      relations:['member', 'comments'],
      where: {
        category,
        kinds,
      },
      order: {
        createTime: "DESC"
      },
      skip: 0,
      take: limit,
    });

    return posts;
  }

  // 게시글 카테고리 별 전체 조회
  public async getAllPostDataByCategory(category: string, kinds: string) {

    // all 조회
    if (!kinds) {
      const result = await this.postRepo.find({
        where: {
          category,
        }
      });
  
      return result;
    }

    const result = await this.postRepo.find({
      where: {
        category,
        kinds
      }
    });

    return result;
  }

  // 게시글 id별 조회
  public async getPostById(id: string) {
    const result = await this.postRepo.findOne({
      relations:['member'],
      where: {
        id,
      }
    });

    return result;
  }

  // 게시글 작성자 식별을 위한 함수
  public async getPostForDiscrimination(id: string, memberId: string) {
    const result = await this.postRepo.findOne({
      where: {
        id,
        memberId
      }
    });

    return result;
  }

  // 게시글 작성
  public async createPost(body: PostWriteForm) {
    const post = await this.postRepo.save({
      ...body
    });

    return post;
  }

  // 게시글 수정
  public async updatePostByIdx(id: string, title: string, contents: string, thumbnailAddress?: string) {
    const result =  await this.postRepo.update({
      id,
    }, {
      title,
      contents,
      thumbnailAddress,
    });

    return result;
  }

  // 게시글 상태를 공개로 수정 => 출판 상태
  public async updatePostStatusToPublish(
      id: string, 
      kinds: string, 
      thumbnailAddress: string, 
      category: string, 
      slugUrl: string, 
      intro: string, 
      publishType: number
    ) {

    const result =  await this.postRepo.update({
      id,
    }, {
      state: publishType,
      kinds,
      thumbnailAddress,
      category,
      url: slugUrl,
      intro,
    });

    return result;
  }

  // 게시글 삭제
  public async deletePostByIdx(id: string) {
    const result = await this.postRepo.delete({
      id
    });

    return result;
  }
}