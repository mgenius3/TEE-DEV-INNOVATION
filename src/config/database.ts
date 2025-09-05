import mysql from 'mysql2/promise';

let connection: mysql.Connection;

export const connectDB = async () => {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'tee_dev_jwt_auth_db',
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    console.log('Connected to MySQL database');

    // Create users table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('Users table ready');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

export const getConnection = () => {
  if (!connection) {
    throw new Error('Database not connected');
  }
  return connection;
};