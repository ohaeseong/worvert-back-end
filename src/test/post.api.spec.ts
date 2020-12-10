import chai from 'chai';
import chaiHttp from 'chai-http';
import config from '../../config';

import * as colorConsole from '../lib/console';

chai.use(chaiHttp);

const serverAddress = config.replace;
const should = chai.should();
const testToken = config.testToken;

// test code for post api
describe('PostService', () => {
    context("Read Post List", () => {
        beforeEach((done) => {
        
        });
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
        it('should return 200', (done) => {
            const params = {
                id: '4b1c41e284225536a06a62d10315d9c6',
            };

            chai.request(serverAddress)
                .get(`/api/post/detail/:id=${params.id}`)
                .end((err, res) => {
                    if (err) { colorConsole.error(err); }
                    res.should.have.status(200);
                    done();
                });
        });

        it('should return 400', (done) => {
            const params = {
                // id: '4b1c41e284225536a06a62d10315d9c6',
            };

            chai.request(serverAddress)
                .get(`/api/post/detail/:id=${''}`)
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
                .get(`/api/post/detail/:id=${'test id for status 404'}`)
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
        it('should return 200', (done) => {
            const body = {
                id: '4d81b14f4f85bd7ebec0d50adcd05497',
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
                    res.should.have.status(200);
                    done();
                });
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
                id: '4d81b14f4f85bd7ebec0d50adcd054971',
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

    // context('Delete post api', () => {
    //     it('should return 200', (done) => {
    //         const params = { id: '41fd0de7973483ee829d088415d65192' };


    //     });
    // });

});