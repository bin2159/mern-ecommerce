const { User } = require('../model/User')

exports.createUser = async (req, res) => {
  if (await User.findOne({ email: req.body.email })) {
    return res.status(400).json({ message: 'User Already Exist' })
  }
  try {
    const user = await User.create(req.body)
    res.status(201).json({id:user.id,role:user.role})
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.loginUser = async (req, res) => {
  try {
    console.log(req.body)
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      res.status(401).json({ message: 'No user Found' })
    } else if (user.password === req.body.password) {
      res.status(201).json({id:user.id,role:user.role})
    } else {
      res.status(401).json({ message: 'Invalid credentials' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
