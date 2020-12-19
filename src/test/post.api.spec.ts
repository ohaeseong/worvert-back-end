import chai from 'chai';
import chaiHttp from 'chai-http';
import { Repository } from 'typeorm';

import config from '../../config';
import { Post } from '../database/models/Post';
import * as colorConsole from '../lib/console';
import connectDatabase from '../database/connection';
import { after, before } from 'mocha';

chai.use(chaiHttp);

const serverAddress = config.replace;
const should = chai.should();
const testToken = config.testToken;

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

    before(async () => {
        await connectDatabase();
    });

    after(() => {
        Post.delete({
            writer: 'test',
        });
    });

    context("Read Post List", () => {
        // beforeEach(async ()  => {

        //     Promise.all([]).then(async () => {
        //         await Post.save({
        //             ...postFormData,
        //         });
        //     });
        // });

        // afterEach(async () => {
        //     await Promise.all([]).then(() => {
        //         Post.delete({
        //             id: 'test'
        //         });
        //     });
        // });


        it('should return 200 status code', (done) => {
            const params = {
                page: 0,
                category: 'server',
            };

            chai.request(serverAddress)
                .get('/api/post')
                .query(params)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('should return 400 status code', (done) => {
            const params = {};

            chai.request(serverAddress)
                .get('/api/post')
                .query(params)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                }); 
        });

    });

    context('Read Post Detail Data', () => {
        
        before(()  => {
            Post.save({
                ...postFormData,
            });
        });

        after(() => {
            Post.delete({
                id: 'test'
            });
        });

        it('should return 200', (done) => {
            const params = { id: 'test', };

            chai.request(serverAddress)
                .get(`/api/post/detail/:id`)
                .send(params)
                .end((err, res) => {
                    if (err) { colorConsole.error(err); }
                    res.should.have.status(200);
                    done();
                });
        });

        it('should return 400', (done) => {
            const params = { id: 'test12' };

            chai.request(serverAddress)
                .get(`/api/post/detail/`)
                .send(params)
                .end((err, res) => {
                    if (err) { colorConsole.error(err); }
                    res.should.have.status(400);
                    done();
                });
        });

        it('should return 404', (done) => {
            const params = {
                id: 'test id for status 404',
            };

            chai.request(serverAddress)
                .get(`/api/post/detail/`)
                .send(params)
                .end((err, res) => {
                    if (err) { colorConsole.error(err); }
                    res.should.have.status(404);
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
                    if (err) { colorConsole.error(err); }
                    res.should.have.status(200);
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
                    if (err) { colorConsole.error(err); }
                    res.should.have.status(400);
                    done();
                });
        });
    });

    context('Update post api', () => {

        beforeEach(async ()  => {
            await Post.save({
                ...postFormData,
            });
        });

        afterEach(async () => {
            await Post.delete({
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
                    if (err) { colorConsole.error(err) }
                    res.should.have.status(200);
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
                    if (err) { colorConsole.error(err) }
                    res.should.have.status(400);
                    done();
                });
        });

        it('should return 403', (done) => {
            const body = {
                id: 'test12',
                title: 'test post update',
                contents: 'test post update',
                thumbnailAddress: '',
            };

            chai.request(serverAddress)
                .put('/api/post')
                .set('token', testToken)
                .send(body)
                .end((err, res) => {
                    if (err) { colorConsole.error(err) }
                    res.should.have.status(403);
                    done();
                });
        });
    });

    context('Delete post api wait 1s for asynchronous', () => {
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

        it('should return 200', (done) => {
            const params = { id: 'test' };

            setTimeout(() => {
                chai.request(serverAddress)
                .delete('/api/post')
                .set('token', testToken)
                .query({id: params.id})
                .end((err, res) => {
                    if (err) { colorConsole.error(err) }
                    res.should.have.status(200);
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
                    if (err) { colorConsole.error(err) }
                    res.should.have.status(400);
                    done();
                });
        });

        it('should return 403', (done) => {
            const params = { id: 'not found' };

            chai.request(serverAddress)
                .delete('/api/post')
                .set('token', testToken)
                .query({id: params.id})
                .end((err, res) => {
                    if (err) { colorConsole.error(err) }
                    res.should.have.status(403);
                    done();
                });
        });
    });

});