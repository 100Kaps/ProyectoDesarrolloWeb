module.exports = {
  user: process.env.DB_USER || "db_proyecto_web",
  password: process.env.DB_PASSWORD || "Password123#",
  connectString: process.env.DB_CONNECT_STRING || "localhost:1521/xe"
};