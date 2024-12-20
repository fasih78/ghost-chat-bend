const passport = require("passport");

 const Auth_google = passport.authenticate("google", {
    scope: ["email","profile"],
  });


  const Callback = passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure",
});
 const auth_fail = (req, res) => {
  res.send("Something went wrong");
};
 const after_auth = (req, res) => {
  const htmlContent = `
    <html>
      <head>
        <title>Authentication Success</title>
      </head>
      <body>
        <h1>Authentication Successfully</h1>
        <p>Hello, ${req.user.displayName}! This is a protected route.</p>
      </body>
    </html>
  `;

  res.send(htmlContent);
};
module.exports={Auth_google,Callback,auth_fail,after_auth}