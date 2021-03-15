import chai from 'chai';
import chaiHttp from 'chai-http';

import config from '../../config';
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

describe('Tag', async () => {

    after(async () => {
        await Post.delete({
            memberId: 'test',
        });
    });

    context('Add Tag to post', () => {
        beforeEach(() => {
            Post.save({
                ...postFormData,
            });  
        });

        it('should return 200 status code', (done) => {
            const body = {
                postId: 'test',
                tagName: 'testTag'
            };

            setTimeout(() => {
                chai.request(serverAddress)
                .post('/api/post/tag')
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

        it('should return 400 status code', (done) => {
            const body = {};

            setTimeout(() => {
                chai.request(serverAddress)
                .post('/api/post/tag')
                .set('token', testToken)
                .send(body)
                .end((err, res) => {
                    expect(res, err).to.have.status(400);
                    expect(res.body['message'], `
                        added like on post!
                    `).to.have.be.a('string');
                    done();
                });
            }, 1000);
        });
    });

    context('Delete Tag to post', () => {
        beforeEach(() => {
            Post.save({
                ...postFormData,
            });  
        });

        it('should return 200 status code', (done) => {
            // const body = {
            //     postId: 'test',
            // };

            setTimeout(() => {
                chai.request(serverAddress)
                .delete('/api/post/tag')
                .set('token', testToken)
                // .send(body)
                .end((err, res) => {
                    expect(res, err).to.have.status(200);
                    expect(res.body['message'], `
                        added like on post!
                    `).to.have.be.a('string');
                    done();
                });
            }, 1000);
        });

    });
});