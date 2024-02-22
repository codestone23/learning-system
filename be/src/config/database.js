module.exports = {
    HOST: process.env.HOST || 8081,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DB: process.env.DATABASE_NAME,
    dialect: "postgres",
    pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
    }
};