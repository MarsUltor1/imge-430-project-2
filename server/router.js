const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getTweets', mid.requiresLogin, controllers.Tweet.getTweets);
  app.get('/getAllTweets', controllers.Tweet.getAllTweets);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/changePassword', mid.requiresLogin, controllers.Account.changePasswordPage);
  app.post('/changePassword', mid.requiresLogin, mid.requiresSecure, controllers.Account.changePassword);

  app.get('/account', mid.requiresLogin, controllers.Account.accountPage);
  app.get('/accountInfo', mid.requiresLogin, controllers.Account.getInfo);

  app.post('/getPremium', mid.requiresLogin, controllers.Account.makePremium);
  app.post('/cancelPremium', mid.requiresLogin, controllers.Account.cancelPremium);

  app.get('/tweet', mid.requiresLogin, controllers.Tweet.writingPage);
  app.post('/tweet', mid.requiresLogin, controllers.Tweet.writeTweet);

  app.post('/togglePrivacy', mid.requiresLogin, controllers.Tweet.togglePrivacy);
  app.post('/deleteTweet', mid.requiresLogin, controllers.Tweet.deleteTweet);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/*', controllers.get404);
};

module.exports = router;
