// This file contains unit tests for the token API, ensuring that the routes and controller methods work as expected.

import request from 'supertest';
import app from '../src/app'; // Adjust the path as necessary

describe('Token API', () => {
    it('should generate a token, creator wallet, and private key', async () => {
        const response = await request(app)
            .post('/api/token/generate') // Adjust the route as necessary
            .send();

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('creatorWallet');
        expect(response.body).toHaveProperty('privateKey');
    });
});