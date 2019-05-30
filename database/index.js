const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./database/data.sqlite3"
  },
  useNullAsDefault: true
})

knex.schema
  .createTable('todos', todo => {
    todo.increments('id').primary();
    todo.string('text');
    todo.dateTime('createdAt');
    todo.dateTime('updatedAt');
    todo.boolean('completed');
  })
  .then(() => console.log('Todos Table created'))
  .catch(() => {});

module.exports = knex;