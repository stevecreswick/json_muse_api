const environment = process.env.NODE_ENV || 'development';

const knex = require('knex');
const configuration = require('../../knexfile')[environment];
const database = knex(configuration);

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');

const hashPassword = (password) => {
  return new Promise((resolve, reject) =>
    bcrypt.hash(password, 10, (err, hash) => {
      err ? reject(err) : resolve(hash)
    })
  )
}

const createUser = (user) => {
  user.uuid = uuidv4();

  return database('users')
    .insert(user)
    .returning('*');
}

const createToken = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, data) => {
      err ? reject(err) : resolve(data.toString('base64'))
    })
  })
}

const signup = (request, response) => {
  const user = request.body

  hashPassword(user.password)
    .then((hashedPassword) => {
      delete user.password
      user.password_digest = hashedPassword
    })
    .then(() => createToken())
    .then(token => user.token = token)
    .then(() => createUser(user))
    .then(user => {
      delete user.password_digest
      response.status(201).json({ user })
    })
    .catch((err) => {
      response.status(409).json({ 'error': err })
    } )
}

module.exports = {
  signup,
}
