#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const program = require('commander');
const Table = require('cli-table');
const database = require('../database');
clear();

console.log(
  chalk.green(
    figlet.textSync('todo - cli',{
      font: 'basic',
      horizontalLayout: 'full'
    })
  )
);

program
  .version('0.0.1')
  .description("An example CLI for Todos list")

program
  .command('add <task>')
  .description('Add new todo')
  .action(async task=> {
    try {
      await database('todos').insert({
        text: task,
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      console.log(`TODO ${chalk.green(task)} created`)
      process.exit(0)
    } catch (error) {
      console.log(
        chalk.red(error)
      )
      process.exit(1)
    }
  })
  
program
  .command('show')
  .description('List all current todo')
  .action(async () => {
    const table = new Table({
      head: [
        chalk.blueBright('id'),
        chalk.blueBright('todo'),
        chalk.blueBright('completed')
      ]
    })
    try {
      const todos = await database("todos").select();
      if (todos.length === 0) {
        console.log(chalk.bold.keyword('orange')('You have no todos'))
      } else {
        todos.forEach(todo => {
          const {id, text, completed} = todo;
          const status = completed !== 0 ? chalk.green('done [✓]') : chalk.red('not completed [✕]');
          table.push([id, text, status])
        })
        console.log(table.toString())
      }
      process.exit(0)
    } catch(error) {
      console.log(
        chalk.red(error)
      )
      process.exit(1)
    }
  })

program
  .command('delete <id>')
  .description('Delete todo by Id')
  .action(async id => {
    try {
      const [todo] = await database('todos').where("id", id);
      if (todo) {
        await database('todos').where("id", id).delete();
        console.log(chalk.yellow(`Todo with id ${id} deleted`))
        process.exit(0)
      } else {
        throw new Error('Todo not found')
      }
    } catch(error) {
      console.log(
        chalk.red(error)
      )
      process.exit(1)
    }
  })

program
  .command('done <id>')
  .description('Mark a todo as done')
  .action(async id => {
    try {
      const [todo] = await database('todos').where("id", id);
      if (todo) {
        console.log('todo:', todo)
        await database('todos')
          .where('id', id)
          .update({
            completed: true,
            updatedAt: Date.now()
          })
        console.log('Done this todo')
        process.exit(0)
      } else {
        throw new Error('Todo not found')
      }
    } catch(error) {
      console.log(
        chalk.red(error)
      )
      process.exit(1)
    }
  })
  
program.parse(process.argv)