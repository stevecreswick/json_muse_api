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

const findUser = (user) => {
  console.log('Searching for ', user);
  return database('users')
    .where({ name: user.name })
    .select('*')
}

const checkPassword = (reqPassword, foundUser) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(reqPassword, foundUser.password_digest, (err, response) => {
        if (err) {
          reject(err)
        }
        else if (response) {
          resolve(response)
        } else {
          reject(new Error('Passwords do not match.'))
        }
    })
  })
}

const updateUserToken = (token, user) => {
  return database('users')
    .where({ name: user.name })
    .update({ token: token })
    .returning('*');
}

const signin = (request, response) => {
  const userReq = request.body
  let user

  findUser(userReq)
    .then(foundUser => {
      user = foundUser[0]
      return checkPassword(userReq.password, user)
    })
    .then((res) => createToken())
    .then(token => updateUserToken(token, user))
    .then(() => {
      delete user.password_digest
      response.status(200).json(user)
    })
    .catch((err) => console.error(err))
}

module.exports = {
  signup,
  signin
}
