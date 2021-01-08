import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';

import config from '../../config';
import { after, before } from 'mocha';
import * as tokenLib from '../lib/token.lib';
import { Member } from '../database/models/Member';

chai.use(chaiHttp);

const serverAddress = config.replace;
const expect = chai.expect;

let refreshToken = '';
let refreshTokenUnauthorized = '';

const payload = {
    memberId: 'test',
  };

const option = { expiresIn: '1min', issuer: 'tech-diary.com boo!', subject: 'is not refresh' };

describe('Token Service Test', async () => {

    before(async () => {
        refreshToken = await tokenLib.createRefreshToken('test refresh token');
        refreshTokenUnauthorized = await jwt.sign(payload, 'test', option);
    });

    after(() => {
        refreshToken = '';
        refreshTokenUnauthorized = '';

        Member.delete({
            memberId: 'test',
        });
    });

    context('reissued token with refresh token', () => {

        it('should return 200 and token string', (done) => {
            const body = {
                refreshToken,
            };
    
            chai.request(serverAddress)
            .post('/api/token')
            .send(body)
            .end((err, res) => {
                expect(res, err).to.have.status(200);
                expect(res.body['tokenData']['token'], `
                    reissued token type is not string!
                `).to.should.have.be.string;
                done();
            });
        });

        it('should return 401', (done) => {
            const body = {
                refreshToken: refreshTokenUnauthorized,
            };
    
            chai.request(serverAddress)
            .post('/api/token')
            .send(body)
            .end((err, res) => {
                expect(res, err).to.have.status(401);
                done();
            });
        });

    });
});