const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/tweet' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/tweet' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

const changePasswordPage = (req, res) => res.render('changePassword');

const changePassword = async (req, res) => {
  const oldPass = `${req.body.oldPass}`;
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;

  // Make sure all fields were filled out
  if (!oldPass || !newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  // Make sure new passwords match
  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  // Check that the correct current password was given
  return Account.authenticate(req.session.account.username, oldPass, async (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong password!' });
    }

    try {
      // hash the new password
      const hash = await Account.generateHash(newPass);

      // Update user's password
      const user = { _id: req.session.account._id };
      await Account.updateOne(user, { $set: { password: hash } });

      // Send user back to maker page
      return res.json({ redirect: '/tweet' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error while changing password!' });
    }
  });
};

const accountPage = (req, res) => res.render('account');

const getInfo = async (req, res) => {
  try {
    const user = await Account.findOne({ _id: req.session.account._id })
      .select('username premium createdDate').lean().exec();

    const userInfo = {
      username: user.username,
      date: user.createdDate,
      premium: user.premium,
    };

    return res.json({ info: userInfo });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error while retrieving account info!' });
  }
};

const makePremium = async (req, res) => {
  try {
    // Change premium boolean in user info
    const user = { _id: req.session.account._id };
    await Account.updateOne(user, { $set: { premium: true } });

    return res.json({success: 'Premium Purchased'});
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({error: 'Error while updating premium status'})
  }
}

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  changePasswordPage,
  changePassword,
  accountPage,
  getInfo,
  makePremium,
};
