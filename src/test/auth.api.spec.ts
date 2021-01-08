import chai from 'chai';
import chaiHttp from 'chai-http';

import config from '../../config';
import { Member } from '../database/models/Member';
import connectDatabase from '../database/connection';
import { after, before } from 'mocha';
import { Post } from '../database/models/Post';

chai.use(chaiHttp);

const serverAddress = config.replace;
const should = chai.should();
const expect = chai.expect;

const MemberFormData = {
    memberId: 'test',
    pw: 'test1234',
    accessLevel: 0,
    memberName: 'test',
    profileImage: ''
} as any;

describe('MemberService Test', async () => {
    before(async () => {
        await connectDatabase();

        Member.save({
            ...MemberFormData,
        });
    });


    context('Login test account', () => {

        beforeEach(() => {
            const MemberFormData = {
                memberId: 'test',
                pw: 'test1234',
                accessLevel: 0,
                memberName: 'test',
                profileImage: ''
            } as any;

            Member.save({
                ...MemberFormData,
            });
        });
        it('should return 200 and token string', (done) => {
            const body = {
                memberId: 'test',
                pw: 'test1234'
            };

            setTimeout(() => {
                chai.request(serverAddress)
                .post('/api/auth/login')
                .send(body)
                .end((err, res) => {
                    expect(res, err).to.have.status(200);
                    expect(res.body['data']['token'], `
                        user login token type is not string!
                    `).to.should.have.be.string;
                    done();
                });
            }, 1000);
        });

        it('should return 400', (done) => {
            const body = {
                memberId: '',
                pw: ''
            };

            chai.request(serverAddress)
            .post('/api/auth/login')
            .send(body)
            .end((err, res) => {
                expect(res, err).to.have.status(400);
                done();
            });
        });

        it('should return 404', (done) => {
            const body = {
                memberId: 'test 404',
                pw: 'fail pw'
            };

            chai.request(serverAddress)
            .post('/api/auth/login')
            .send(body)
            .end((err, res) => {
                expect(res, err).to.have.status(404);
                done();
            });
        });
    });
});