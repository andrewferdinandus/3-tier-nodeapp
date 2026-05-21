const request = require('supertest');
const app = require('./server');

describe('Backend API Tests', () => {
    it('should fetch health status successfully', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toEqual('UP');
    });
});
