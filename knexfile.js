module.exports = {
    development: {
      client: 'mysql',
      connection: {
        host : '127.0.0.1',
        user : 'root',
        password : '',
        database : 'recipes_cookbook'
       // insecureAuth : true
      },
      migrations: {
        directory: './database/migrations',
        tableName: 'dbmigrations',
      },
      seeds: { directory: './database/seeds' }
  },

  testing: {
    client: 'mysql',
      connection: {
        host : '127.0.0.1',
        user : 'root',
        password : '',
        database : 'recipes_cookbook_testing'
      },
      migrations: {
        directory: './database/migrations',
        tableName: 'dbmigrations',
      },
      seeds: { directory: './database/seeds' }
  },

  production: {
    client: 'mysql',
      connection: {
        host : 'us-cdbr-east-06.cleardb.net',
        user : 'b5a65b2732dae3',
        password : '0ed3e2df',
        database : 'heroku_d1afb5c97051740'
      },
      migrations: {
        directory: './database/migrations',
        tableName: 'dbmigrations',
      },
      seeds: { directory: './database/seeds' }
  },

   // this is needed when using foreign keys
   pool: {
    afterCreate: (conn, done) => {
      // runs after a connection is made to the sqlite engine
      conn.run("PRAGMA foreign_keys = ON", done) // turn on FK enforcement
    },
  },
   
};
