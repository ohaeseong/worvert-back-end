import { Service } from 'typedi';
import { Response } from 'express';
import { PostService } from '../../services/post.service';
import { AuthRequest, PostDetail } from '../../typings'; 
import * as Validate  from '../../lib/validate/post.validate';
import { generatedId } from '../../lib/method.lib';
import * as colorConsole from '../../lib/console';
import config from '../../../config';
import { PostCommentService } from '../../services/post.comment.service';

const { replace } = config;

@Service() // typedi를 이용한 의존성 주입 위한 설정
export class PostCtrl {
  constructor(
    private postService: PostService,
    private commentService: PostCommentService,
  ) { }
  
  // 게시글 리스트 조회 함수
  public getPosts = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[GET] post list lookup api was called');
    const page: string  = req.query.page as string;
    const category: string  = req.query.category as string;

    // limit, page의 요청 방식이 올바른지 확인 하는 코드입니다.
    if (!page || parseInt(page) < 0) {
          res.status(400).json({
            status: 400,
            message: '양식이 맞지 않아요!'
          });

          return
        }

    try {
      const limit = 10;

      // DB에 있는 데이터를 조회 합니다.
      const posts = await this.postService.getPostsByLimit(limit, parseInt(page, 10), category);
      const allPosts = await this.postService.getAllPostDataByCategory(category); 
      
      const totalPage = Math.ceil(allPosts.length / limit);

      res.status(200).json({
        status: 200,
        message: '게시글 조회 성공',
        data: {
          posts,
          totalPage,
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: '게시글 조회 실패!'
      });
    }
  };

  // 게시글 상세 조회 함수
  public getPostById = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[GET] post detail data lookup api was called');
    const id: string  = req.params.id as string;

    // id의 요청 방식이 올바른지 확인 하는 코드입니다.
    if (!id) {
      res.status(400).json({
        status: 400,
        message: '양식이 맞지 않아요!'
      });

      return
    }

    try {

      // DB에 있는 데이터를 조회 합니다.
      const post: PostDetail = await this.postService.getPostById(id);

      if(!post) {
        res.status(404).json({
          status: 404,
          messgae: '게시글을 찾을 수 없습니다.',
        });

        return;
      }

      const commentData = await this.commentService.getPostCommentList(5);

      post.commentList = {
        commentData,
      };

      res.status(200).json({
        status: 200,
        message: '게시글 조회 성공',
        data: {
          post,
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: '게시글 조회 실패!'
      });
    }
  };

  // 게시글 작성 함수
  public writePost = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[POST] post write api was called');
    const { body } = req;

    try {
      // validate 라이브러리를 사용해 요청 form을 검사합니다.
      await Validate.writePostValidate(body);
    } catch (error) {
      colorConsole.error(error);
      
      res.status(400).json({
        status: 400,
        message: '양식이 맞지 않아요!'
      });

      return
    }

    try {
      const { title, contents, category } = body;
      let { thumbnailAddress } = body;

      const id: string = await generatedId();

      if (!thumbnailAddress) {
        thumbnailAddress = `https://${replace}/static/img/thumbnail_default.png`;
      }
      

      // DB에 저장하는 함수를 실행합니다.
      await this.postService.createPost(id, title, contents, category, thumbnailAddress);

      res.status(200).json({
        status: 200,
        message: '게시글 작성 성공',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: '게시글 작성 실패!'
      });
    }
  };

  // 게시글 수정 함수
  public updatePost = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[PUT] post update api was called');
    const { body, decoded } = req;
    
    // validate 라이브러리를 사용해 요청 form을 검사합니다.
    try {
      await Validate.updatePostValidate(body);
    } catch (error) {
      colorConsole.error(error);
      
      res.status(400).json({
        status: 400,
        message: '양식이 맞지 않아요!'
      });

      return
    }

    try {
      const { id, title, contents, thumbnailAddress } = body;
      
      const post = await this.postService.getPostForDiscrimination(id, decoded.memberId);

      if(!post) {
        res.status(403).json({
          status: 403,
          message: '게시글 수정 권한 없음',
        });

        return;
      }

      // 요청받은 게시글 id를 기준으로 데이터를 업데이트하는 함수입니다.
      await this.postService.updatePostByIdx(id, title, contents, thumbnailAddress);

      res.status(200).json({
        status: 200,
        message: '게시글 수정 성공',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: '게시글 수정 실패!'
      });
    }
  };

  // 게시글 삭제 함수
  public deletePost = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[DELETE] post delete api was called');
    const { decoded } = req;
    let id: string = req.query.id as string; 

    // 게시글 id를 검사합니다. (idx의 존재 여부, 1이상의 양의 정수인지 확인)
    if (!id) {
      res.status(400).json({
        status: 400,
        message: 'id를 정확히 작성해 주세요!'
      });

      return;
    }

    try {

      // 어드민 권한으로 해당 게시글을 삭제 합니다. delete anyway into admin access level
      if (decoded.accessLever === 0) {
          // 요청 받은 게시글 id를 기준으로 데이터를 삭제합니다. 
          await this.postService.deletePostByIdx(id);

          res.status(200).json({
            status: 200,
            message: '게시글 삭제 성공 (어드민)',
          });

          return;
      }

      // 삭제를 요청 하는 사용자의 id와 해당 게시글의 작성자를 대조하여 권한을 식별합니다.
      const post = await this.postService.getPostForDiscrimination(id, decoded.memberId);

      if(!post) {
        res.status(403).json({
          status: 403,
          message: '게시글 삭제 권한 없음',
        });

        return;
      }

      // 요청 받은 게시글 id를 기준으로 데이터를 삭제합니다. 
      await this.postService.deletePostByIdx(id);

      res.status(200).json({
        status: 200,
        message: '게시글 삭제 성공',
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        status: 500,
        message: '게시글 삭제 실패!'
      });
    }
  };
}
