const request = require('supertest');
const app = require('../../server'); // Make sure to export app from server.js
const { pool } = require('../../config/db.config');
const { createTestUser } = require('../helpers/testUtils');
const jwt = require('jsonwebtoken');

describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should not register user with existing email', async () => {
      await createTestUser();

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(user.email);
    });

    it('should fail with incorrect password', async () => {
      await createTestUser();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should get user profile with valid token', async () => {
      const user = await createTestUser();
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe(user.email);
      expect(response.body.user).toHaveProperty('joinDate');
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authentication failed');
    });
  });

  describe('PUT /api/auth/profile', () => {
    it('should update user profile successfully', async () => {
      const user = await createTestUser();
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

      const updatedData = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.user.name).toBe(updatedData.name);
      expect(response.body.user.email).toBe(updatedData.email);
    });

    it('should not update profile with existing email', async () => {
      await createTestUser({
        email: 'existing@example.com'
      });
      
      const user = await createTestUser();
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'New Name',
          email: 'existing@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email already in use');
    });
  });
});
