const router = require("express-promise-router")();
const jwt = require("jsonwebtoken");
const DB = require("../model/db");
const bcrypt = require("bcrypt");
const Auth = require("../model/Auth");
const saltRounds = 10;
const nodeMailer = require("nodemailer");
const randomstring = require("randomstring");
const config = require("../config");
var multer = require("multer");
const sgMail = require("@sendgrid/mail");

var fs = require("fs");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    console.log("dfddf", file);
    var filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    }
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    cb(null, "image-" + Date.now() + "." + filetype);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("myFile");

// Register user

router.post("/register", async (req, res) => {
 
  try {
    
    const userByEmail = await Auth.getUserByEmail(
      DB.connection,
      req.body.email
    );
    console.log('userbyEmail:',userByEmail)

    const userByUsername = await Auth.getUserByUsername(
      DB.connection,
      req.body.username
    );
    
    console.log("userbyUsername:", userByUsername)
    
    if (userByUsername.length == 1) {
      return res.status(400).send({
        msg: "That username is taken. Try another",
        success: false,
      });
    } else if (userByEmail.length == 1) {
      return res.status(400).send({
        msg: "That email is taken. Try another",
        success: false,
      });
    } else if (req.body.password.length <= 4) {
      return res.status(400).send({
        msg: "Use 5 character or more for your password",
        success: false,
      });
    } else if (req.body.password !== req.body.confirm_password) {
      return res.status(400).send({
        msg: "Those passwords didn't match. Try again.",
        success: false,
      });
    } else {
      const hash = await bcrypt.hash(req.body.password, saltRounds);
      const secretToken = randomstring.generate();
      console.log("otherExp")
      const user = {
        name: req.body.name,
        username: req.body.username,
        userType: req.body.role,
        email: req.body.email,
        token: secretToken,
        active: 0,
        forget: 0,
        block: 0,
        adminAccess: 0,
      };

      const output = `<!doctype html>

      <html lang="en">

      <body>
      <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">

      <!-- START HEADER/BANNER -->

          <tbody><tr>
            <td align="center">
              <table class="col-600" width="700" border="0" align="center" cellpadding="0" cellspacing="0">
                <tbody><tr>
                  <td align="center" valign="top" background="data:image/jpeg;base64,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" bgcolor="#66809b" style="background-size:cover; background-position:top;height=" 400""="">
                    <table class="col-600" width="600" height="400" border="0" align="center" cellpadding="0" cellspacing="0">

                      <tbody><tr>
                        <td height="40"></td>
                      </tr>


                      <tr>
                        <td align="center" style="line-height: 0px;">

                        </td>
                      </tr>

                      <tr>
                        <td align="center" style="font-family: 'Raleway', sans-serif; font-size:37px; color:#ffffff; line-height:24px; font-weight: bold; letter-spacing: 7px;">
                          Welcome To <span style="font-family: 'Raleway', sans-serif; font-size:37px; color:#ffffff; line-height:39px; font-weight: 300; letter-spacing: 7px;">Dj-App</span>
                        </td>
                      </tr>

<tr>
                        <td height="50"></td>
                      </tr>
                    </tbody></table>
                  </td>
                </tr>
              </tbody></table>
            </td>
          </tr>


      <!-- END HEADER/BANNER -->
<!-- START 3 BOX SHOWCASE -->

          <tr>
            <td align="center">
              <table class="col-600" width="700" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-left:20px; margin-right:20px; border-left: 1px solid #dbd9d9; border-right: 1px solid #dbd9d9;">
                <tbody><tr>
                  <td height="35"></td>
                </tr>

                <tr>
                  <td align="center" style="font-family: 'Raleway', sans-serif; font-size:22px; font-weight: bold; color:#2a3a4b;">Thank you for registration</td>
                </tr>

                <tr>
                  <td height="10"></td>
                </tr>

                <h1 style="margin-left:15px;">Hi, ${req.body.name}</h1>
                <tr>
                  <td align="center" style="font-family: 'Lato', sans-serif; font-size:15px; color:#000; line-height:24px; font-weight: 300; margin-left:20px;">
                    If you completed our registration form and you were expecting this e-mail, please click the link below to confirm registration:
                  </td>
                </tr>
                <tr>
                  <td height="30"></td>
                </tr>
                <tr align="center" valign="top">
                  <td>
                    <table class="button" style="border: 2px solid #fff;" bgcolor="#2b3c4d" width="30%" border="0" cellpadding="0" cellspacing="0">
                      <tbody><tr>
                        <td width="10"></td>
                        <td height="30" align="center" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px; color:#ffffff;">
                          <a href="${config.url.backendUrl}/auth/verify/${secretToken}" style="color:#ffffff;">Click Here</a>
                        </td>
                        <td width="10"></td>
                      </tr>
                    </tbody></table>
                  </td>
                </tr>

              </tbody></table>
            </td>
          </tr>

            <tr>
                <td height="5"></td>
          </tr>


      <!-- END 3 BOX SHOWCASE -->


      <!-- START WHAT WE DO -->

          <tr>
            <td align="center">
              <table class="col-600" width="700" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-left:20px; margin-right:20px;">
<tbody>

<!-- END WHAT WE DO -->

<!-- START FOOTER -->

          <tr>
            <td align="center">
              <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" style=" border-left: 1px solid #dbd9d9; border-right: 1px solid #dbd9d9;">
                <tbody><tr>
                  <td height="50"></td>
                </tr>
                <tr>
                  <td align="center" bgcolor="#34495e" background="https://designmodo.com/demo/emailtemplate/images/footer.jpg" height="185">
                    <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0">
                      <tbody><tr>
                        <td height="25"></td>
                      </tr>

                        <tr>
                        <td align="center" style="font-family: 'Raleway',  sans-serif; font-size:26px; font-weight: 500; color:#0395b9;">Follow us for some cool stuffs</td>
                        </tr>


                      <tr>
                        <td height="25"></td>
                      </tr>



                      </tbody></table><table align="center" width="35%" border="0" cellspacing="0" cellpadding="0">
                      <tbody><tr>
                        <td align="center" width="30%" style="vertical-align: top;">
                            <a href="https://www.facebook.com/djapp/" target="_blank"> <img src="https://designmodo.com/demo/emailtemplate/images/icon-fb.png"> </a>
                        </td>

                        <td align="center" class="margin" width="30%" style="vertical-align: top;">
                           <a href="https://twitter.com/djapp" target="_blank"> <img src="https://designmodo.com/demo/emailtemplate/images/icon-twitter.png"> </a>
                        </td>

                      </tr>
                      </tbody></table>



                    </td></tr></tbody></table>
                  </td>
                </tr>
              </tbody></table>
            </td>
          </tr>

      <!-- END FOOTER -->



              </tbody></table>   
      </body>

      </html>`;
      /*
      let transporter = nodeMailer.createTransport({
        host: config.sendgrid.host,
        port: config.sendgrid.port,
        secure: config.sendgrid.secure, // true for 465, false for other ports
        auth: {
          user: config.sendgrid.auth.user, // generated ethereal user
          pass: config.sendgrid.auth.pass, // generated ethereal password
        },
        tls: {
          rejectUnauthorized: config.sendgrid.tls.rejectUnauthorized,
        },
      });
      */
     let transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: config.mailService.mail,
        pass: config.mailService.pwd
        
        
      }
  });
      // setup email data with unicode symbols
      let mailOptions = {
//        from: "Dj-App noreply@godjmixapp.com", // sender address
        from:config.mailService.user,
        to: req.body.email, // list of receivers
        subject: `Thank you for register`,
        text: `Account Details for the new user Email ${req.body.email}`, // plain text body
        html: output, // html body
      };

      console.log("mailOptions")

      // send mail with defined transport object
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log('err')
          console.log("error", error);
          return res.status(400).send({ msg: "not", success: false });
        } else {
          const response = await Auth.userRegister(DB.connection, {
            ...user,
            password: hash,
          });
          if (response.affectedRows === 1) {
          
            return res.status(201).send({
              msg: "Registered Successfully",
              success: true,
            });
          } else {
            console.log("in 400");
            return res.status(400).send({
              msg: "Register request failed",
              success: false,
            });
          }
        }
      });
    }
  } catch (e) {
    console.log("error", e);
    res.status(500).send({
      error: e,
      msg: "Internal server error",
      success: false,
    });
  }
});

// Verify User registration

router.get("/verify/:token", async (req, res) => {
  const response = await Auth.getUserByToken(DB.connection, req.params.token);
 

  if (response.length == 0) {
    res.send("<h1>Your token has been expired</h1>");
  } else {
    if (response[0].userType === "user") {
      await Auth.updateUser(DB.connection, response[0].id);
      return res.redirect(config.url.frontEndUserPanelUrl);
    }
  }
});

//Uplaod image

router.post("/upload", upload, async function (req, res) {
  const fileUrl = config.url.backendUrl + "/images/" + req.file.filename;
  const userDetail = await Auth.updateProfileImage(
    DB.connection,
    req.body.email,
    fileUrl
  );

  if (userDetail.affectedRows === 1) {
    res.status(200).send();
  } else {
    res.status(500).send();
  }
});

// Login User

router.post("/login", async (req, res) => {
  try {
    const users = await Auth.userLogin(
      DB.connection,
      req.body.email,
      req.body.role
    );
    if (users.length === 0) {
      return res.status(400).send({
        msg: "Couldn't find your email or username",
        success: false,
      });
    }

    if (users[0].active == 0) {
      return res.status(400).send({
        msg: "Your email not verify",
        success: false,
      });
    }
    bcrypt.compare(req.body.password, users[0].password, function (
      err,
      response
    ) {
      if (response) {
        res.status(200).send({
          token: jwt.sign(
            {
              id: users[0].id,
              email: users[0].email,
              role: users[0].userType,
            },
            config.jwt.secret
          ),
        });
      } else {
        res.status(400).send({
          msg:
            "Wrong password. Try again or click Forgot password to reset it.",
          success: false,
        });
      }
    });
  } catch (e) {
    res.status(500).send({
      msg: "Internal Server Error",
      success: false,
    });
  }
});

//
// Login Admin

router.post("/adminlogin", async (req, res) => {
  try {
    const users = await Auth.adminLogin(DB.connection, req.body.email);

    if (users.length === 0) {
      console.log("i am in thisd");
      return res.status(400).send({
        msg: "Couldn't find your email",
        success: false,
      });
    } else {
      if (users[0].userType === "user") {
        console.log("now in am in thisd");
        return res.status(400).send({
          msg: "Couldn't find your email",
          success: false,
        });
      } else {
        bcrypt.compare(req.body.password, users[0].password, function (
          err,
          response
        ) {
          if (response) {
            res.status(200).send({
              token: jwt.sign(
                {
                  id: users[0].id,
                  email: users[0].email,
                  role: users[0].userType,
                },
                config.jwt.secret
              ),
            });
          } else {
            res.status(400).send({
              msg:
                "Wrong password. Try again or click Forgot password to reset it.",
              success: false,
            });
          }
        });
      }
    }
  } catch (e) {
    console.log("eeee", e);
    res.status(500).send({
      msg: "Internal Server Error",
      success: false,
    });
  }
});

// Forget password user
router.post("/forget-password", async (req, res) => {
  console.log("hit theree");
  const secretToken = randomstring.generate();

  const user = await Auth.userLogin(
    DB.connection,
    req.body.email,
    req.body.role
  );

  if (user.length == 0) {
    return res.status(400).send({
      success: false,
      msg: "That email account doesn't exist. Enter a different account .",
    });
  }

  try {
    user[0].token = secretToken;
    user[0].forgot = 1;

    const output = `<!doctype html>

    <html lang="en">
    
    <body>
    <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
    
    <!-- START HEADER/BANNER -->
    
        <tbody><tr>
          <td align="center">
            <table class="col-600" width="700" border="0" align="center" cellpadding="0" cellspacing="0">
              <tbody><tr>
                <td align="center" valign="top" background="data:image/jpeg;base64,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" bgcolor="#66809b" style="background-size:cover; background-position:top;height=" 400""="">
                  <table class="col-600" width="600" height="400" border="0" align="center" cellpadding="0" cellspacing="0">
    
                    <tbody><tr>
                      <td height="40"></td>
                    </tr>
    
    
                    <tr>
                      <td align="center" style="line-height: 0px;">
                      
                      </td>
                    </tr>
    
    
    
                    <tr>
                      <td align="center" style="font-family: 'Raleway', sans-serif; font-size:37px; color:#ffffff; line-height:24px; font-weight: bold; letter-spacing: 7px;">
                        Welcome To <span style="font-family: 'Raleway', sans-serif; font-size:37px; color:#ffffff; line-height:39px; font-weight: 300; letter-spacing: 7px;">Dj-App</span>
                      </td>
                    </tr>
    
    
    
    
    
    
    
    
                    <tr>
                      <td height="50"></td>
                    </tr>
                  </tbody></table>
                </td>
              </tr>
            </tbody></table>
          </td>
        </tr>
    
    
    <!-- END HEADER/BANNER -->
    
    
    <!-- START 3 BOX SHOWCASE -->
    
        <tr>
          <td align="center">
            <table class="col-600" width="700" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-left:20px; margin-right:20px; border-left: 1px solid #dbd9d9; border-right: 1px solid #dbd9d9;">
              <tbody><tr>
                <td height="35"></td>
              </tr>
    
              <tr>
                <td align="center" style="font-family: 'Raleway', sans-serif; font-size:22px; font-weight: bold; color:#2a3a4b;">Update your password</td>
              </tr>
    
              <tr>
                <td height="10"></td>
              </tr>
    
              <h1 style="margin-left:15px;">Hi, ${user[0].name}</h1>
           
              <tr>
                <td align="center" style="font-family: 'Lato', sans-serif; font-size:15px; color:#000; line-height:24px; font-weight: 300; margin-left:20px;">
                Please click the link below and update the password after update you can login with your new credentials.Thanks
                  </td>

               

              </tr>
              <tr>
                <td height="30"></td>
              </tr>
              <tr align="center" valign="top">
                <td>
                  <table class="button" style="border: 2px solid #fff;" bgcolor="#2b3c4d" width="30%" border="0" cellpadding="0" cellspacing="0">
                    <tbody><tr>
                      <td width="10"></td>
                      <td height="30" align="center" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px; color:#ffffff;">
                      <a href="${config.url.backendUrl}/auth/update-password?djtk=${secretToken}" style="color:#ffffff;">Click Here</a>
                      </td>
                      <td width="10"></td>
                    </tr>
                  </tbody></table>
                </td>
              </tr>
    
            </tbody></table>
          </td>
        </tr>
    
          <tr>
              <td height="5"></td>
        </tr>
    
    
    <!-- END 3 BOX SHOWCASE -->
    
    
    <!-- START WHAT WE DO -->
    
        <tr>
          <td align="center">
            <table class="col-600" width="700" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-left:20px; margin-right:20px;">
    
    
    
        <tbody>
    
    
    <!-- END WHAT WE DO -->
    
    
    
    <!-- START FOOTER -->
    
        <tr>
          <td align="center">
            <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" style=" border-left: 1px solid #dbd9d9; border-right: 1px solid #dbd9d9;">
              <tbody><tr>
                <td height="50"></td>
              </tr>
              <tr>
                <td align="center" bgcolor="#34495e" background="https://designmodo.com/demo/emailtemplate/images/footer.jpg" height="185">
                  <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0">
                    <tbody><tr>
                      <td height="25"></td>
                    </tr>
    
                      <tr>
                      <td align="center" style="font-family: 'Raleway',  sans-serif; font-size:26px; font-weight: 500; color:#0395b9;">Follow us for some cool stuffs</td>
                      </tr>
    
    
                    <tr>
                      <td height="25"></td>
                    </tr>
    
    
    
                    </tbody></table><table align="center" width="35%" border="0" cellspacing="0" cellpadding="0">
                    <tbody><tr>
                      <td align="center" width="30%" style="vertical-align: top;">
                          <a href="https://www.facebook.com/djapp/" target="_blank"> <img src="https://designmodo.com/demo/emailtemplate/images/icon-fb.png"> </a>
                      </td>
    
                      <td align="center" class="margin" width="30%" style="vertical-align: top;">
                         <a href="https://twitter.com/djapp" target="_blank"> <img src="https://designmodo.com/demo/emailtemplate/images/icon-twitter.png"> </a>
                      </td>
  
                    </tr>
                    </tbody></table>
    
    
    
                  </td></tr></tbody></table>
                </td>
              </tr>
            </tbody></table>
          </td>
        </tr>
    
  
    
                
              
            </tbody></table>   
    </body>
    
    </html>`;

    let transporter = nodeMailer.createTransport({
      host: config.sendgrid.host,
      port: config.sendgrid.port,
      secure: config.sendgrid.secure, // true for 465, false for other ports
      auth: {
        user: config.sendgrid.auth.user, // generated ethereal user
        pass: config.sendgrid.auth.pass, // generated ethereal password
      },
      tls: {
        rejectUnauthorized: config.sendgrid.tls.rejectUnauthorized,
      },
    });

    let mailOptions = {
      from: "DjApp noreply@godjmixapp.com", // sender address
      to: req.body.email, // list of receivers
      subject: `Update Password`,
      text: `Updated password`, // plain text body
      html: output, // html body
    };
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return res.status(400).send({
          msg: "Problem in sending",
          success: false,
        });
      } else {
        await Auth.updateUserSetToken(DB.connection, user[0].id, user[0].token);
        res.status(201).send({
          msg: "Check your email",
          success: true,
        });
      }
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
      success: false,
    });
  }

  //
});

//forget password admin
router.post("/forget-password-admin", async (req, res) => {
  const secretToken = randomstring.generate();
  const user = await Auth.getUserByEmail(DB.connection, req.body.email);

  if (user.length == 0) {
    return res.status(400).send({
      success: false,
      msg: "That email account doesn't exist. Enter a different account .",
    });
  }

  try {
    user[0].token = secretToken;
    user[0].forgot = 1;

    const output = `<!doctype html>

    <html lang="en">
    
    <body>
    <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
    
    <!-- START HEADER/BANNER -->
    
        <tbody><tr>
          <td align="center">
            <table class="col-600" width="700" border="0" align="center" cellpadding="0" cellspacing="0">
              <tbody><tr>
                <td align="center" valign="top" background="data:image/jpeg;base64,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" bgcolor="#66809b" style="background-size:cover; background-position:top;height=" 400""="">
                  <table class="col-600" width="600" height="400" border="0" align="center" cellpadding="0" cellspacing="0">
    
                    <tbody><tr>
                      <td height="40"></td>
                    </tr>
    
    
                    <tr>
                      <td align="center" style="line-height: 0px;">
                      
                      </td>
                    </tr>
    
    
    
                    <tr>
                      <td align="center" style="font-family: 'Raleway', sans-serif; font-size:37px; color:#ffffff; line-height:24px; font-weight: bold; letter-spacing: 7px;">
                        Welcome To <span style="font-family: 'Raleway', sans-serif; font-size:37px; color:#ffffff; line-height:39px; font-weight: 300; letter-spacing: 7px;">Dj-App</span>
                      </td>
                    </tr>
    
    
    
    
    
    
    
    
                    <tr>
                      <td height="50"></td>
                    </tr>
                  </tbody></table>
                </td>
              </tr>
            </tbody></table>
          </td>
        </tr>
    
    
    <!-- END HEADER/BANNER -->
    
    
    <!-- START 3 BOX SHOWCASE -->
    
        <tr>
          <td align="center">
            <table class="col-600" width="700" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-left:20px; margin-right:20px; border-left: 1px solid #dbd9d9; border-right: 1px solid #dbd9d9;">
              <tbody><tr>
                <td height="35"></td>
              </tr>
    
              <tr>
                <td align="center" style="font-family: 'Raleway', sans-serif; font-size:22px; font-weight: bold; color:#2a3a4b;">Update your password</td>
              </tr>
    
              <tr>
                <td height="10"></td>
              </tr>
    
              <h1 style="margin-left:15px;">Hi, ${user[0].name}</h1>
           
              <tr>
                <td align="center" style="font-family: 'Lato', sans-serif; font-size:15px; color:#000; line-height:24px; font-weight: 300; margin-left:20px;">
                Please click the link below and update the password after update you can login with your new credentials.Thanks
                  </td>

               

              </tr>
              <tr>
                <td height="30"></td>
              </tr>
              <tr align="center" valign="top">
                <td>
                  <table class="button" style="border: 2px solid #fff;" bgcolor="#2b3c4d" width="30%" border="0" cellpadding="0" cellspacing="0">
                    <tbody><tr>
                      <td width="10"></td>
                      <td height="30" align="center" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px; color:#ffffff;">
                      <a href="${config.url.backendUrl}/auth/update-password?djtk=${secretToken}" style="color:#ffffff;">Click Here</a>
                      </td>
                      <td width="10"></td>
                    </tr>
                  </tbody></table>
                </td>
              </tr>
    
            </tbody></table>
          </td>
        </tr>
    
          <tr>
              <td height="5"></td>
        </tr>
    
    
    <!-- END 3 BOX SHOWCASE -->
    
    
    <!-- START WHAT WE DO -->
    
        <tr>
          <td align="center">
            <table class="col-600" width="700" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-left:20px; margin-right:20px;">
    
    
    
        <tbody>
    
    
    <!-- END WHAT WE DO -->
    
    
    
    <!-- START FOOTER -->
    
        <tr>
          <td align="center">
            <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" style=" border-left: 1px solid #dbd9d9; border-right: 1px solid #dbd9d9;">
              <tbody><tr>
                <td height="50"></td>
              </tr>
              <tr>
                <td align="center" bgcolor="#34495e" background="https://designmodo.com/demo/emailtemplate/images/footer.jpg" height="185">
                  <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0">
                    <tbody><tr>
                      <td height="25"></td>
                    </tr>
    
                      <tr>
                      <td align="center" style="font-family: 'Raleway',  sans-serif; font-size:26px; font-weight: 500; color:#0395b9;">Follow us for some cool stuffs</td>
                      </tr>
    
    
                    <tr>
                      <td height="25"></td>
                    </tr>
    
    
    
                    </tbody></table><table align="center" width="35%" border="0" cellspacing="0" cellpadding="0">
                    <tbody><tr>
                      <td align="center" width="30%" style="vertical-align: top;">
                          <a href="https://www.facebook.com/djapp/" target="_blank"> <img src="https://designmodo.com/demo/emailtemplate/images/icon-fb.png"> </a>
                      </td>
    
                      <td align="center" class="margin" width="30%" style="vertical-align: top;">
                         <a href="https://twitter.com/djapp" target="_blank"> <img src="https://designmodo.com/demo/emailtemplate/images/icon-twitter.png"> </a>
                      </td>
  
                    </tr>
                    </tbody></table>
    
    
    
                  </td></tr></tbody></table>
                </td>
              </tr>
            </tbody></table>
          </td>
        </tr>
    
  
    
                
              
            </tbody></table>   
    </body>
    
    </html>`;

    let transporter = nodeMailer.createTransport({
      host: config.sendgrid.host,
      port: config.sendgrid.port,
      secure: config.sendgrid.secure, // true for 465, false for other ports
      auth: {
        user: config.sendgrid.auth.user, // generated ethereal user
        pass: config.sendgrid.auth.pass, // generated ethereal password
      },
      tls: {
        rejectUnauthorized: config.sendgrid.tls.rejectUnauthorized,
      },
    });

    let mailOptions = {
      from: "Bitnautic noreply@godjmixapp.com", // sender address
      to: req.body.email, // list of receivers
      subject: `Update Password`,
      text: `Updated password`, // plain text body
      html: output, // html body
    };
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return res.status(400).send({
          msg: "Problem in sending",
          success: false,
        });
      } else {
        await Auth.updateUserSetToken(DB.connection, user[0].id, user[0].token);
        res.status(201).send({
          msg: "Check your email",
          success: true,
        });
      }
    });
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
      success: false,
    });
  }

  //
});

// update password redirect through email
router.get("/update-password", async (req, res) => {
  const response = await Auth.getUserByToken(DB.connection, req.query.djtk);
  console.log("resposne", response[0]);
  if (response.length == 0) {
    res.send(
      "<h1>This url has been expired.Click on forget password and put recovery email to update password again</h1>"
    );
  } else {
    if (response[0].userType === "user") {
      return res.redirect(
        config.url.frontEndUserPanelUrl +
          `change-password?djtk=${req.query.djtk}`
      );
    }
    if (response[0].userType === "superadmin") {
      return res.redirect(
        config.url.frontEndadminpanelUrl +
          `auth/change-password/${req.query.djtk}`
      );
    }
    if (response[0].userType === "admin") {
      return res.redirect(
        config.url.frontEndadminpanelUrl +
          `auth/change-password/${req.query.djtk}`
      );
    }
  }
});

// Change password

router.post("/change-password", async (req, res) => {
  console.log("body", req.body);
  try {
    if (req.body.password.length <= 4) {
      return res.status(400).send({
        msg: "Use 5 character or more for your password",
        success: false,
      });
    }
    if (req.body.password !== req.body.confirm_password) {
      return res.status(400).send({
        msg: "Those passwords didn't match. Try again.",
        success: false,
      });
    } else {
      const hash = await bcrypt.hash(req.body.password, saltRounds);
      const response = await Auth.getUserByToken(DB.connection, req.body.token);

      if (response.length == 0) {
        return res.status(400).send({
          msg: "Not Exist",
          success: false,
        });
      }

      await Auth.updateUserById(DB.connection, response[0].id, hash);
      return res.status(201).send({
        msg: "password update",
        success: false,
      });
    }
  } catch (e) {
    res.status(500).send({
      msg: "Internal server error",
      success: false,
    });
  }
});

// Get user Profile
router.get("/profile", async (req, res) => {
  try {
    const userDetail = await Users.getUserByID(DB.connection, req.query.userID);
    res.status(200).send({
      userDetail: userDetail,
      msg: "userDetail fetched successfully",
      success: true,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      error: e,
      msg: "userDetail not fetched successfully",
      success: false,
    });
  }
});

router.post("/addNewAdmin", async (req, res) => {
  try {
    const userByEmail = await Auth.getUserByEmail(
      DB.connection,
      req.body.email
    );

    const userByUsername = await Auth.getUserByUsername(
      DB.connection,
      req.body.username
    );

    if (userByUsername.length == 1) {
      return res.status(400).send({
        msg: "That username is taken. Try another",
        success: false,
      });
    } else if (userByEmail.length == 1) {
      return res.status(400).send({
        msg: "That email is taken. Try another",
        success: false,
      });
    } else {
      const hash = await bcrypt.hash(req.body.password, saltRounds);
      const secretToken = randomstring.generate();

      const user = {
        name: req.body.name,
        username: req.body.username,
        userType: req.body.role,
        email: req.body.email,
        token: "",
        active: 1,
        forget: 0,
        block: 0,
        adminAccess: 1,
      };

      const output = `<!doctype html>

      <html lang="en">

      <body>
      <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">

      <!-- START HEADER/BANNER -->

          <tbody><tr>
            <td align="center">
              <table class="col-600" width="700" border="0" align="center" cellpadding="0" cellspacing="0">
                <tbody><tr>
                  <td align="center" valign="top" background="data:image/jpeg;base64,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" bgcolor="#66809b" style="background-size:cover; background-position:top;height=" 400""="">
                    <table class="col-600" width="600" height="400" border="0" align="center" cellpadding="0" cellspacing="0">

                      <tbody><tr>
                        <td height="40"></td>
                      </tr>


                      <tr>
                        <td align="center" style="line-height: 0px;">

                        </td>
                      </tr>

                      <tr>
                        <td align="center" style="font-family: 'Raleway', sans-serif; font-size:37px; color:#ffffff; line-height:24px; font-weight: bold; letter-spacing: 7px;">
                          Welcome To <span style="font-family: 'Raleway', sans-serif; font-size:37px; color:#ffffff; line-height:39px; font-weight: 300; letter-spacing: 7px;">Dj-App</span>
                        </td>
                      </tr>

<tr>
                        <td height="50"></td>
                      </tr>
                    </tbody></table>
                  </td>
                </tr>
              </tbody></table>
            </td>
          </tr>


      <!-- END HEADER/BANNER -->
<!-- START 3 BOX SHOWCASE -->

          <tr>
            <td align="center">
              <table class="col-600" width="700" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-left:20px; margin-right:20px; border-left: 1px solid #dbd9d9; border-right: 1px solid #dbd9d9;">
                <tbody><tr>
                  <td height="35"></td>
                </tr>

                <tr>
                  <td align="center" style="font-family: 'Raleway', sans-serif; font-size:22px; font-weight: bold; color:#2a3a4b;">Welcome to dj app</td>
                </tr>

                <tr>
                  <td height="10"></td>
                </tr>

                <h1 style="margin-left:15px;">Hi, ${req.body.name}</h1>
                <tr>
                  <td align="center" style="font-family: 'Lato', sans-serif; font-size:15px; color:#000; line-height:24px; font-weight: 300; margin-left:20px;">
                   You have given admin access and your credential is here:</br>
                   Email:${req.body.email}</br>
                   Password:${req.body.password}</br>
                   Click below button to login into the platform and update your password and profile and add your playlist and song
                  </td>
                </tr>
                <tr>
                  <td height="30"></td>
                </tr>
                <tr align="center" valign="top">
                  <td>
                    <table class="button" style="border: 2px solid #fff;" bgcolor="#2b3c4d" width="30%" border="0" cellpadding="0" cellspacing="0">
                      <tbody><tr>
                        <td width="10"></td>
                        <td height="30" align="center" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px; color:#ffffff;">
                          <a href="${config.url.frontEndadminpanelUrl}" style="color:#ffffff;">Click Here To Login</a>
                        </td>
                        <td width="10"></td>
                      </tr>
                    </tbody></table>
                  </td>
                </tr>

              </tbody></table>
            </td>
          </tr>

            <tr>
                <td height="5"></td>
          </tr>


      <!-- END 3 BOX SHOWCASE -->


      <!-- START WHAT WE DO -->

          <tr>
            <td align="center">
              <table class="col-600" width="700" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-left:20px; margin-right:20px;">
<tbody>

<!-- END WHAT WE DO -->

<!-- START FOOTER -->

          <tr>
            <td align="center">
              <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" style=" border-left: 1px solid #dbd9d9; border-right: 1px solid #dbd9d9;">
                <tbody><tr>
                  <td height="50"></td>
                </tr>
                <tr>
                  <td align="center" bgcolor="#34495e" background="https://designmodo.com/demo/emailtemplate/images/footer.jpg" height="185">
                    <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0">
                      <tbody><tr>
                        <td height="25"></td>
                      </tr>

                        <tr>
                        <td align="center" style="font-family: 'Raleway',  sans-serif; font-size:26px; font-weight: 500; color:#0395b9;">Follow us for some cool stuffs</td>
                        </tr>


                      <tr>
                        <td height="25"></td>
                      </tr>



                      </tbody></table><table align="center" width="35%" border="0" cellspacing="0" cellpadding="0">
                      <tbody><tr>
                        <td align="center" width="30%" style="vertical-align: top;">
                            <a href="https://www.facebook.com/djapp/" target="_blank"> <img src="https://designmodo.com/demo/emailtemplate/images/icon-fb.png"> </a>
                        </td>

                        <td align="center" class="margin" width="30%" style="vertical-align: top;">
                           <a href="https://twitter.com/djapp" target="_blank"> <img src="https://designmodo.com/demo/emailtemplate/images/icon-twitter.png"> </a>
                        </td>

                      </tr>
                      </tbody></table>



                    </td></tr></tbody></table>
                  </td>
                </tr>
              </tbody></table>
            </td>
          </tr>

      <!-- END FOOTER -->



              </tbody></table>   
      </body>

      </html>`;

      let transporter = nodeMailer.createTransport({
        host: config.sendgrid.host,
        port: config.sendgrid.port,
        secure: config.sendgrid.secure, // true for 465, false for other ports
        auth: {
          user: config.sendgrid.auth.user, // generated ethereal user
          pass: config.sendgrid.auth.pass, // generated ethereal password
        },
        tls: {
          rejectUnauthorized: config.sendgrid.tls.rejectUnauthorized,
        },
      });

      // setup email data with unicode symbols
      let mailOptions = {
        from: "Dj-App noreply@godjmixapp.com", // sender address
        to: req.body.email, // list of receivers
        subject: `Welocme to our portal`,
        text: `Account Details for the new user Email ${req.body.email}`, // plain text body
        html: output, // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          return res.status(400).send({ msg: "not", success: false });
        } else {
          const response = await Auth.userRegister(DB.connection, {
            ...user,
            password: hash,
          });
          if (response.affectedRows === 1) {
            return res.status(201).send({
              msg: "Admin Added",
              success: true,
            });
          } else {
            return res.status(400).send({
              msg: "Register request failed",
              success: false,
            });
          }
        }
      });
    }
  } catch (e) {
    console.log("error", e);
    res.status(500).send({
      error: e,
      msg: "Internal server error",
      success: false,
    });
  }
});

module.exports.authRouter = router;
