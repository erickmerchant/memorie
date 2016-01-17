const sergeant = require('sergeant')
const app = sergeant().describe('CLI for memorie')

app.command('account:list')
.describe('List accounts')
.action(function () {
  console.log(arguments)
})

app.command('account:create')
.describe('Create an account')
.parameter('name')
.parameter('password')
.action(function () {
  console.log(arguments)
})

app.command('account:update')
.describe('Update an account')
.parameter('id')
.parameter('name')
.parameter('password')
.action(function () {
  console.log(arguments)
})

app.command('account:delete')
.describe('Delete an account')
.parameter('id')
.action(function () {
  console.log(arguments)
})

app.run()
