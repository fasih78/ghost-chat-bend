// Routes code
const router = require("express").Router();
const { Auth_google, Callback, after_auth, auth_fail } = require('./google_auth');
const isLoggedIn = require('../helper/google-auth-login');
require('../helper/google-auth');

router.get("/", (req, res) => {
  res.send(
    '<a href="/auth/google">Authenticate with Google <br><a href="/auth/facebook">Authenticate with Facebook'
  );
});

router.get("/auth/failure", auth_fail);

// Use middleware directly instead of calling it as a function
router.get("/auth/google", Auth_google);

router.get("/google/callback", Callback);

router.get("/protected", after_auth);

router.get("/logout", (req, res) => {
  res.redirect("https://accounts.google.com/logout");
  res.redirect("http://localhost:2000/google/callback");
});

module.exports = router;
