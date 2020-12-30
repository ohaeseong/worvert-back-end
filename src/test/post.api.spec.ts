import chai from 'chai';
import chaiHttp from 'chai-http';

import config from '../../config';
import { Post } from '../database/models/Post';
import { after } from 'mocha';

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
    series: 'test series',
    writer: 'test',
  } as any;

// test code for post api
describe('PostService', async () => {

    after(async () => {
        await Post.delete({
            writer: 'test',
        });
    });

    context('Read Post List', () => {
        it('should return 200 status code', (done) => {
            const params = {
                page: 0,
                category: 'test category',
            };

            chai.request(serverAddress)
                .get('/api/post')
                .query(params)
                .end((err, res) => {
                    expect(res, err).to.have.status(200);
                    expect(res.body['data']['posts'], `
                        post list type is array but, it is not!
                    `).to.have.be.a('array');
                    done();
                });
        });

        it('should return 400 status code', (done) => {
            const params = {};

            chai.request(serverAddress)
                .get('/api/post')
                .query(params)
                .end((err, res) => {
                    expect(res, err).to.have.status(400);
                    done();
                }); 
        });

    });

    context('Read Post Detail Data', () => {
        
        beforeEach(()  => {
            Post.save({
                ...postFormData,
            });  
        });

        afterEach(() => {
            Post.delete({
                id: 'test'
            });
        });

        it('should return 200  wait 1s for asynchronous', (done) => {
            const params = { id: 'test' };

            setTimeout(() => {
                chai.request(serverAddress)
                .get('/api/post/detail/' + params.id)
                .end((err, res) => {
                    expect(res, err).to.have.status(200);
                    expect(res.body['data']['post'], `
                        post detail type is object but, it is not!
                    `).to.should.have.be.a('object');
                    done();
                });
            }, 1000);
        });

        it('should return 404  wait 1s for asynchronous', (done) => {
            const params = {
                id: 'test id for status 404',
            };

       
            chai.request(serverAddress)
            .get('/api/post/detail/' + params.id)
            .end((err, res) => {
                expect(res, err).to.have.status(404);
                done();
            });
        });
    });

    context('Write post api', () => {
        it('should return 200', (done) => {
            const body = {
                title: 'this is test title!!@@',
                contents: 'this is test contents~',
                category: 'TEST',
                series: 'TEST series',
                thumbnailAddress: '',
            };

            chai.request(serverAddress)
                .post('/api/post')
                .set('token', testToken)
                .send(body)
                .end((err, res) => {
                    expect(res, err).to.have.status(200);
                    done();
                });
        });

        it('should return 400', (done) => {
            const body = {};

            chai.request(serverAddress)
                .post('/api/post')
                .set('token', testToken)
                .send(body)
                .end((err, res) => {
                    expect(res, err).to.have.status(400);
                    done();
                });
        });
    });

    context('Update post api', () => {

        beforeEach(()  => {
            Post.save({
                ...postFormData,
            });
        });

        afterEach(() => {
            Post.delete({
                id: 'test',
            });
        });

        it('should return 200 wait 1s for asynchronous', (done) => {
            const body = {
                id: 'test',
                title: 'test post update',
                contents: 'test post update',
                thumbnailAddress: '',
            };

            setTimeout(() => {
                chai.request(serverAddress)
                .put('/api/post')
                .set('token', testToken)
                .send(body)
                .end((err, res) => {
                    expect(res, err).to.have.status(200);
                    done();
                });
            }, 1000);
        });

        it('should return 400', (done) => {
            const body = {};

            chai.request(serverAddress)
                .put('/api/post')
                .set('token', testToken)
                .send(body)
                .end((err, res) => {
                    expect(res, err).to.have.status(400);
                    done();
                });
        });

        it('should return 403', (done) => {
            const body = {
                id: 'test',
                title: 'test post update',
                contents: 'test post update',
                thumbnailAddress: '',
            };

            chai.request(serverAddress)
                .put('/api/post')
                .set('token', testToken2)
                .send(body)
                .end((err, res) => {
                    expect(res, err).to.have.status(403);
                    done();
                });
        });
    });

    context('Delete post api', () => {
        beforeEach(()  => {
             Post.save({
                ...postFormData,
            });
        });

        afterEach(() => {
            Post.delete({
                id: 'test',
            });
        });

        it('should return 200 wait 1s for asynchronous', (done) => {
            const params = { id: 'test' };

            setTimeout(() => {
                chai.request(serverAddress)
                .delete('/api/post')
                .set('token', testToken)
                .query({id: params.id})
                .end((err, res) => {
                    expect(res, err).to.have.status(200);
                    done();
                });
            }, 1000);
        });

        it('should return 400', (done) => {
            const params = { id: '' };

            chai.request(serverAddress)
                .delete('/api/post')
                .set('token', testToken)
                .query({id: params.id})
                .end((err, res) => {
                    expect(res, err).to.have.status(400);
                    done();
                });
        });

        it('should return 403', (done) => {
            const params = { id: 'test' };

            chai.request(serverAddress)
                .delete('/api/post')
                .set('token', testToken2)
                .query({id: params.id})
                .end((err, res) => {
                    expect(res, err).to.have.status(403);
                    done();
                });
        });
    });

});