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

describe('Temporary Test', async () => {

    after(async () => {
        await Post.delete({
            memberId: 'test',
        });
    });

    context('Get Temporary Post List', () => {
        beforeEach(() => {
            Post.save({
                ...postFormData,
            });  
        });

        it('should return 200 status code', (done) => {

            setTimeout(() => {
                chai.request(serverAddress)
                .get('/api/post/temporary')
                .set('token', testToken)
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
            chai.request(serverAddress)
            .get('/api/post/temporary')
            .end((err, res) => {
                expect(res, err).to.have.status(400);
                done();
            });
        });
    });
});