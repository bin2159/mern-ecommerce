const { User } = require('../model/User')
const crypto = require('crypto')
const { sanitizeUser } = require('../services/common')
const jwt = require('jsonwebtoken')
exports.createUser = async (req, res) => {
  if (await User.findOne({ email: req.body.email })) {
    return res.status(400).json({ message: 'User Already Exist' })
  }
  try {
    const salt = crypto.randomBytes(16)
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      'sha256',
      async function (err, hashedPassword) {
        const user = await User.create({
          ...req.body,
          password: hashedPassword,
          salt,
        })
        req.login(sanitizeUser(user), (err) => {
          if (err) {
            res.status(400).json({ message: error.message })
          }
          const SECRET_KEY = 'SECRET_KEY'
          const token = jwt.sign(sanitizeUser(user), SECRET_KEY)
          console.log(token)
          res
            .cookie('jwt', token, {
              expires: new Date(Date.now() + 3600000),
              httpOnly: true,
            })
            .status(201)
            .json({ id: user.id, role: user.role })
        })
      }
    )
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.loginUser = async (req, res) => {
  const user = req.user
  res
    .cookie('jwt', req.user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json({ id: user.id, role: user.role }  )
}

exports.checkAuth = (req, res) => {
  if (req.user) {
    res.json(req.user)
  }else{
    res.status(401)
  }
}
