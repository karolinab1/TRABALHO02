module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      database: 'db_karolina',
      port: 3306,
      user: 'root',
      password: 'User-12910'
    },
    
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'     
    }
  },

};