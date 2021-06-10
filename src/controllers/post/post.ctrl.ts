import { Service } from 'typedi';
import { Response } from 'express';
import { v4 as uuid4 } from 'uuid';
import { PostService } from '../../services/post.service';
import { AuthRequest, PostComment, PostDetail, PostWriteForm } from '../../typings'; 
import * as Validate  from '../../lib/validate/post.validate';
import { asyncForeach, generatedId } from '../../lib/method.lib';
import * as colorConsole from '../../lib/console';
import config from '../../../config';
import * as emailLib from '../../lib/email';
import { PostCommentService } from '../../services/post.comment.service';
import { PostLikeService } from '../../services/post.like.service';
import { PostTagService } from '../../services/post.tag.service';
import { PostReplyCommentService } from '../../services/post.reply.comment.service';
import dayjs from 'dayjs';
import { SocialService } from '../../services/social.service';

const { replace } = config;

@Service() // typedi를 이용한 의존성 주입 위한 설정
export class PostCtrl {
  constructor(
    private postService: PostService,
    private commentService: PostCommentService,
    private likeService: PostLikeService,
    private tagService: PostTagService,
    private postTagService: PostTagService,
    private replyCommentService: PostReplyCommentService,
    private socialService: SocialService,
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

      let toDay = new Date();
      const subtractToDay = dayjs(toDay).subtract(14, 'day').format('YYYY-MM-DD');
      

      posts.sort((a: any, b: any) => {
        return b.like - a.like;
      });


      for (let i = 0; i < posts.length; i++) {
        if (subtractToDay > dayjs(posts[i].createTime).format('YYYY-MM-DD')) {
          posts[posts.length - 1] =  posts[i];
          posts.splice(i, 1);
        }
      }

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

    // 사용자 별 북마크 표시 게시글, 임시저장 게시글, 비공개 게시글 조회
  public getPostsByState = async (req: AuthRequest, res: Response) => {
      colorConsole.info('[GET] post list lookup by state');
      const state: string  = req.query.state as string;
      const memberId: string  = req.query.memberId as string;
  
      // limit, page의 요청 방식이 올바른지 확인 하는 코드입니다.
      if (!state) {
            res.status(400).json({
              status: 400,
              message: '양식이 맞지 않아요!'
            });
  
            return
      }
  
      try {
        
        // DB에 있는 데이터를 조회 합니다.
        const posts = await this.postService.getPostsByMemberId(memberId, parseInt(state));
        // const allPosts = await this.postService.getAllPostDataByCategory(category); 
        
        // const totalPage = Math.ceil(allPosts.length / parseInt(limit, 10));
  
        await asyncForeach(posts, async (post: PostDetail) => {
          // const commentData = await this.commentService.getPostCommentListAll(post.id);
          const likeData = await this.likeService.getAllLikeByPostId(post.id);
          const tagData = await this.tagService.getTags(post.id);

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
          
          // post.commentList = commentData.length;
          post.like = likeData.length;
          post.tagList = {
            tagData,
          };
  
          delete post.member.pw;
          delete post.member.accessLevel;
        });

        res.status(200).json({
          status: 200,
          message: '게시글 조회 성공',
          data: {
            posts,
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

    public getPostsByMemberId = async (req: AuthRequest, res: Response) => {
      colorConsole.info('[GET] post list lookup by memberId');
      const memberId: string  = req.query.memberId as string;
      // const limit: string  = req.query.limit as string;
  
      // limit, page의 요청 방식이 올바른지 확인 하는 코드입니다.
      if (!memberId) {
            res.status(400).json({
              status: 400,
              message: '양식이 맞지 않아요!'
            });
  
            return
      }
  
      try {
        
        
        // DB에 있는 데이터를 조회 합니다.
        const posts = await this.postService.getPostsByMemberId(memberId, 1);
        // const allPosts = await this.postService.getAllPostDataByCategory(category); 
        
        // const totalPage = Math.ceil(allPosts.length / parseInt(limit, 10));
  
        await asyncForeach(posts, async (post: PostDetail) => {
          // const commentData = await this.commentService.getPostCommentListAll(post.id);
          const likeData = await this.likeService.getAllLikeByPostId(post.id);
          const tagData = await this.tagService.getTags(post.id);

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
          // post.commentList = commentData.length;
          post.like = likeData.length;
          post.tagList = {
            tagData,
          };

          delete post.member.pw;
          delete post.member.accessLevel;
        });
  
        res.status(200).json({
          status: 200,
          message: '게시글 조회 성공',
          data: {
            posts,
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

  public getPostById = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[GET] post detail data lookup api was called (by id) ');
    const id: string  = req.params.id as string;
    if (!id) {
      res.status(400).json({
        status: 400,
        message: '요청 오류!'
      });

      return
    }

    try {
      const post: PostDetail = await this.postService.getPostById(id);

      if(!post) {
        res.status(404).json({
          status: 404,
          messgae: '게시글을 찾을 수 없습니다.',
        });

        return;
      }

      const tagData = await this.tagService.getTags(post.id);

      post.tagList = {
        tagData,
      };

      delete post.member.pw;
      delete post.member.accessLevel;

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

  public searchMemberPosts = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[GET] search member posts api call ');
    const memberId: string  = req.query.memberId as string;
    const searchWord: string  = req.query.searchWord as string;
    
    if (!memberId) {
      res.status(400).json({
        status: 400,
        message: '요청 오류!'
      });

      return
    }

    try {
      const posts = await this.postService.getMemberPostsByLike(memberId, searchWord);

      await asyncForeach(posts, async (post: PostDetail) => {
        // const commentData = await this.commentService.getPostCommentListAll(post.id);
        const likeData = await this.likeService.getAllLikeByPostId(post.id);
        const tagData = await this.tagService.getTags(post.id);

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
        
        // post.commentList = commentData.length;
        post.like = likeData.length;
        post.tagList = {
          tagData,
        };

        delete post.member.pw;
        delete post.member.accessLevel;
      });

      res.status(200).json({
        status: 200,
        message: '회원 게시글 검색 성공',
        data: {
          posts,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: '게시글 조회 실패!'
      });
    }
  };

  public searchPosts = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[GET] search posts api call ');
    const searchWord: string  = req.query.searchWord as string;
    
    if (!searchWord) {
      res.status(400).json({
        status: 400,
        message: '요청 오류!'
      });

      return
    }

    try {
      const posts = await this.postService.getPostsByLike(searchWord);

      await asyncForeach(posts, async (post: PostDetail) => {
        // const commentData = await this.commentService.getPostCommentListAll(post.id);
        const likeData = await this.likeService.getAllLikeByPostId(post.id);
        const tagData = await this.tagService.getTags(post.id);

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
        
        // post.commentList = commentData.length;
        post.like = likeData.length;
        post.tagList = {
          tagData,
        };

        delete post.member.pw;
        delete post.member.accessLevel;
      });

      res.status(200).json({
        status: 200,
        message: '게시글 검색 성공',
        data: {
          posts,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: '게시글 조회 실패!'
      });
    }
  };

  public searchTagPosts = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[GET] search tag posts api call ');
    const tag: string  = req.query.tag as string;
    
    if (!tag) {
      res.status(400).json({
        status: 400,
        message: '요청 오류!'
      });

      return
    }

    try {
      const posts = await this.tagService.getPostsByTag(tag);
      const publicPosts: any = [];

      await asyncForeach(posts, async (post: any) => {
        // post = {
        //   tagName: post.tagName,
        //   ...post.post,
        // };
        // const commentData = await this.commentService.getPostCommentListAll(post.id);
        // const likeData = await this.likeService.getAllLikeByPostId(post.id);
        const tagData = await this.tagService.getTags(post.postId);
        // console.log(post.postId);
        

        // let replyComments;
        // if (post.comments) {
        //   post.commentCount = post.comments.length;
        // }

        // for(let i = 0; i < post.comments.length; i++) {
        //   const comment = post.comments[i];
        //   replyComments = await this.replyCommentService.getCommentByReplyCommentIdx(comment.idx);
  
        //   if (replyComments) {
        //     post.commentCount = post.commentCount + replyComments.length;
        //   }
        // }
        
        // post.commentList = commentData.length;
        // post.like = likeData.length;
        // console.log(post);
        
        post.tagList = {
          tagData,
        };
      });

      posts.forEach(postData => {
        if (postData.post.state === 1) {
          publicPosts.push(postData);
        }
      });
      

      res.status(200).json({
        status: 200,
        message: '게시글 태그 검색 성공',
        data: {
          posts: publicPosts,
        },
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
  public getPostByUrlSlug = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[GET] post detail data lookup api was called (by slug)');
    const slug: string  = req.query.slug as string;
    const memberId: string  = req.query.memberId as string;
    
    // id의 요청 방식이 올바른지 확인 하는 코드입니다.
    if (!slug || !memberId) {
      res.status(400).json({
        status: 400,
        message: '요청 오류!'
      });

      return
    }
    

    try {
      // const splitSlug = slug.split("-");
      const replaceUrl = `/${memberId}/${slug}`;
      console.log(replaceUrl);

      // DB에 있는 데이터를 조회 합니다.
      const post: PostDetail = await this.postService.getPostBySlug(replaceUrl);

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
      const followers = await this.socialService.findFollowers(post.memberId);

      post.commentList = {
        commentData,
      };

      post.tagList = {
        tagData,
      };

      post.followers = followers;

      post.commentCount = commentCount;

      post.like = likeData;

      res.status(200).json({
        status: 200,
        message: '게시글 조회 성공 (by url)',
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
    const { memberId  } = req.decoded;

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
      const { id, kinds, thumbnailAddress, category, intro, publishType, tags } = body;
      let { slugUrl } = body;

      const post = await this.postService.getPostBySlug(slugUrl);
      

      if (post && id !== post.id) {
        let uid: string = uuid4();
        uid = `-${uid.slice(0, 10)}`;
        slugUrl = `/${slugUrl.split("/")[1]}/${slugUrl.split("/")[2]}${uid}`;
      }
      
      await this.postService.updatePostStatusToPublish(id, kinds, thumbnailAddress, category, slugUrl, intro, publishType);

      await this.postTagService.deleteAllTags(id);

      if (tags) {
        await asyncForeach(tags, async (tagName: string) => {
          await this.postTagService.addTag(id, tagName);
        });
      }

      const followers = await this.socialService.findFollowers(memberId);

      followers.forEach((member) => {
        emailLib.sendPublishPostInfoToFollowers(member.member.displayEmail, post.url, memberId);
      });

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
      const { title, contents, tags } = body;
      
      const id: string = await generatedId();
      
      const postFormData = {
        id,
        memberId,
        contents,
        title,
      } as PostWriteForm;

      // DB에 저장하는 함수를 실행합니다.
      const post = await this.postService.createPost(postFormData);

      if (tags) {
        await asyncForeach(tags, async (tagName: string) => {
          await this.postTagService.addTag(post.id, tagName);
        });
      }

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
      const { id, title, contents, thumbnailAddress, tags } = body;
      
      
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

      await this.postTagService.deleteAllTags(id);

      await asyncForeach(tags, async (tagName: string) => {
        await this.postTagService.addTag(id, tagName);
      });

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
      if (decoded.accessLevel === 0) {
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
