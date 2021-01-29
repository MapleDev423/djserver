const config = {
  database: {
    host: "127.0.0.1",
    user: "root",
    password: "djapppassword",
//    password: "",

    database: "djapp",
  },
  url: {
    frontEndUserPanelUrl: "http://72.14.189.240:3000/",
//    frontEndUserPanelUrl: "http://localhost:3000/",

    frontEndadminpanelUrl: "http://72.14.189.240:3001/",

    backendUrl: "http://72.14.189.240:5000",
//    backendUrl: "http://localhost:5000",

  },
  jwt: {
    secret: "testing",
  },
  mailService:{
    mail:'benrosenfeldupwork@gmail.com',
    pwd:'littlestar2020'
  },
  sendgrid: {
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "steven@siliconslopesconsulting.com", // generated ethereal user
      pass: "Access2020$", // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  environment: "development",
};

module.exports = config;
