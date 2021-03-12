import { Service } from 'typedi';
import { Response } from 'express';
import { PostService } from '../../services/post.service';
import { AuthRequest, PostComment, PostDetail, PostWriteForm } from '../../typings'; 
import * as Validate  from '../../lib/validate/post.validate';
import { asyncForeach, generatedId } from '../../lib/method.lib';
import * as colorConsole from '../../lib/console';
import config from '../../../config';
import { PostCommentService } from '../../services/post.comment.service';
import { PostLikeService } from '../../services/post.like.service';
import { PostTagService } from '../../services/post.tag.service';
import { PostReplyCommentService } from '../../services/post.reply.comment.service';
import { Comment } from '../../database/models/Comment';

const { replace } = config;

@Service() // typedi를 이용한 의존성 주입 위한 설정
export class PostCtrl {
  constructor(
    private postService: PostService,
    private commentService: PostCommentService,
    private likeService: PostLikeService,
    private tagService: PostTagService,
    private replyCommentService: PostReplyCommentService,
  ) { }
  
  // 게시글 리스트 조회 함수
  public getPosts = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[GET] post list lookup api was called');
    const category: string  = req.query.category as string;
    const limit: string  = req.query.limit as string;
    const kinds: string = req.query.kinds as string;

    // limit, page의 요청 방식이 올바른지 확인 하는 코드입니다.
    if (!limit || parseInt(limit) < 0 || !category) {
          res.status(400).json({
            status: 400,
            message: '양식이 맞지 않아요!'
          });

          return
        }

    try {
      
      
      // DB에 있는 데이터를 조회 합니다.
      const posts = await this.postService.getPostsByLimit(parseInt(limit, 10), category, kinds);
      const allPosts = await this.postService.getAllPostDataByCategory(category, kinds); 
      
      const totalPage = Math.ceil(allPosts.length / parseInt(limit, 10));

      await asyncForeach(posts, async (post: PostDetail) => {
        // const commentData = await this.commentService.getPostCommentListAll(post.id);
        const likeData = await this.likeService.getAllLikeByPostId(post.id);
        
        // post.commentList = commentData.length;
        post.like = likeData.length;

        delete post.member.pw;
        delete post.member.accessLevel;
      });

      await asyncForeach(posts, async (post: PostDetail) => {
        let replyComments;
        if (post.comments) {
          post.commentCount = post.comments.length;
        }
        for(let i = 0; i < post.comments.length; i++) {
          const comment = post.comments[i];
          replyComments = await this.replyCommentService.getCommentByReplyCommentIdx(comment.idx);
  
          if (replyComments) {
            post.commentCount = post.commentCount + replyComments.length;
          }
        }
      
      });
      

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

      delete post.member.pw;
      delete post.member.accessLevel;

      const commentData = await this.commentService.getPostCommentList(post.id);
      let replyComments: any;

      let commentCount = 0;
      let replyCommentCount = 0;
      if (commentData) {
        commentCount = commentData.length;
      }

      await asyncForeach(commentData, async (comment: PostComment) => {
        replyComments = await this.replyCommentService.getCommentByReplyCommentIdx(comment.idx);
        comment.replyComments = replyComments;

        if (replyComments) {
          replyCommentCount = replyCommentCount + replyComments.length;
        }
      });

      if (replyComments) {
        commentCount = replyCommentCount + commentCount;
      }


      const likeData = await this.likeService.getAllLikeByPostId(post.id);
      const tagData = await this.tagService.getTags(post.id);

      post.commentList = {
        commentData,
      };

      post.tagList = {
        tagData,
      };

      post.commentCount = commentCount;

      post.like = likeData;

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

  public publishPost = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[PUT] post publish api was called');
    const { body } = req;

    try {
      await Validate.publishPostValidate(body);
    } catch (error) {
      colorConsole.error(error);
      
      res.status(400).json({
        status: 400,
        message: '양식이 맞지 않아요!'
      });

      return
    }

    try {
      const { id, kinds, thumbnailAddress, category, slugUrl, intro, publishType } = body;
      
      await this.postService.updatePostStatusToPublish(id, kinds, thumbnailAddress, category, slugUrl, intro, publishType);

      res.status(200).json({
        status: 200,
        message: '게시글 출판 성공',
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
    const { body, decoded } = req;

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
      const { memberId } = decoded;
      const { title, contents } = body;
      
      const id: string = await generatedId();
      
      const postFormData = {
        id,
        memberId,
        contents,
        title,
      } as PostWriteForm;

      // DB에 저장하는 함수를 실행합니다.
      const post = await this.postService.createPost(postFormData);

      res.status(200).json({
        status: 200,
        message: '게시글 작성 성공',
        data: {
          ...post,
        }
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
