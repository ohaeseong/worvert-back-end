import chai from 'chai';
import chaiHttp from 'chai-http';

import config from '../../config';
import { Like } from '../database/models/Like';
import { after } from 'mocha';
import { Post } from '../database/models/Post';

chai.use(chaiHttp);

const serverAddress = config.replace;
const should = chai.should();
const expect = chai.expect;
const testToken = config.testToken;
const testToken2 = config.testToken2;

const postFormData = {
    id: 'test',
    title: 'test title',
    contents: 'test contents',
    category: 'test category',
    thumbnailAddress :'',
    kinds: 'front-end',
    series: 'test series',
    memberId: 'test',
  } as any;

describe('Like', async () => {

    after(async () => {
        await Post.delete({
            memberId: 'test',
        });
    });

    context('Add Post Like and if has like on post alreay, cancel like', () => {
        beforeEach(() => {
            Post.save({
                ...postFormData,
            });  
        });

        it('should return 200 status code', (done) => {
            const body = {
                postId: 'test',
            };

            setTimeout(() => {
                chai.request(serverAddress)
                .post('/api/post/like')
                .set('token', testToken)
                .send(body)
                .end((err, res) => {
                    expect(res, err).to.have.status(200);
                    expect(res.body['message'], `
                        added like on post!
                    `).to.have.be.a('string');
                    done();
                });
            }, 1000);
        });

        it('should return 200 status code', (done) => {
            const body = {
                postId: 'test',
            };

            setTimeout(() => {
                chai.request(serverAddress)
                .post('/api/post/like')
                .set('token', testToken)
                .send(body)
                .end((err, res) => {
                    expect(res, err).to.have.status(200);
                    expect(res.body['message'], `
                        canceled like in post!
                    `).to.have.be.a('string');
                    done();
                });
            }, 1000);
        });

        it('should return 400 status code', (done) => {
            chai.request(serverAddress)
            .post('/api/post/like')
            .set('token', testToken)
            .end((err, res) => {
                expect(res, err).to.have.status(400);
                done();
            });
        });
    });
});