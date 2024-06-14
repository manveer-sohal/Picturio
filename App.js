const express = require("express");
const path = require("path");
const multer = require("multer");
const mysql = require("mysql2");
const sharp = require("sharp"); // Import the sharp library
const mailer = require("nodemailer");
const { resolveAny } = require("dns");

const app = express();
const port = 3001;

const upload = multer({ storage: multer.memoryStorage() });
app.use(express.json({ limit: "1mb" }));

//creats the pool connection to mysql databas
const accountConnection = mysql
  .createPool({
    user: "root",
    host: "localhost",
    password: "password",
    database: "accountDatabase",
  })
  .promise();

const pool = mysql
  .createPool({
    user: "root",
    host: "localhost",
    password: "password",
    database: "photoDatabase",
  })
  .promise();

async function checkIfExists(email) {
  const [rows, fields] = await accountConnection.execute(
    "SELECT * FROM user WHERE email = ?",
    [email]
  );
  if (rows.length > 0) {
    console.log("User with email", email, "already exists");
    return true;
  } else {
    console.log("User with email", email, "does not exist");
    return false;
  }
}

//**************
// fetches account information and checks if it exists,
// if it doesnt send verification
//**************
app.post("/singUp", async (req, res) => {
  const account = {
    password: req.body.account_info.password,
    username: req.body.account_info.username,
  };

  const generateCode = req.body.code;

  const exists = await checkIfExists(account.username);
  //check if the email already has an account, if not send the verification
  if (!exists) {
    verifyEmail(account.username, generateCode);
    res.json({ exist: false });
  } else {
    res.json({ exist: true });
  }
});

//once email is verifed insert it into data Base
app.post("/verified", async (req, res) => {
  const account = {
    password: req.body.account_info.password,
    username: req.body.account_info.username,
  };
  try {
    await accountConnection.query(
      "INSERT INTO user (email, password) VALUES (?, ?)",
      [account.username, account.password]
    );
  } catch (error) {
    console.error("Query error:", error);

    res.json({ data: err });
  } finally {
    // Release the connection back to the pool
  }
});

async function checkPassword(user, password) {
  try {
    const results = await accountConnection.query(
      `SELECT * FROM user WHERE email = ?`,
      [user]
    );
    await console.log("test", results[0][0].password);
    if (password === results[0][0].password) {
      console.log("true penis");
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Query error:", error);
    res.json({ data: err });
  }
}

app.post("/logIn", async (req, res) => {
  const account = {
    password: req.body.password,
    username: req.body.username,
  };

  const exists = await checkIfExists(account.username);
  const passMatch = await checkPassword(account.username, account.password);
  console.log("passmatch", passMatch);
  if (exists && passMatch) {
    res.json({ exist: true, match: true });
  } else if (!exists) {
    res.json({ exist: false, match: true });
  } else {
    res.json({ exist: false, match: false });
  }
});

//fetches image file url from pic.html, and puts the binary into database
app.post("/api", upload.single("file"), async (req, res) => {
  const fileData = req.file.buffer;
  const fileText = req.body.text;
  const user = req.body.user;

  //compresses image to a lower quality
  const compressedImageData = await sharp(fileData)
    .resize({ width: 400 }) // Resize the image if necessary
    .jpeg({ quality: 40 }) // Set JPEG quality to 50%
    .toBuffer();

  console.log("insert");
  //inserts the edited photo into the database
  try {
    await accountConnection.query(
      "INSERT INTO user_auth (email, photoText, photoData) VALUES (?, ?, ?)",
      [user, fileText, compressedImageData]
    );
  } catch (error) {
    console.log("the error is", error);
  }
  console.log("inserted");

  // Convert compressed image data to base64
  const compressedImageBase64 = compressedImageData.toString("base64");

  // Construct the data URL with the compressed image data
  const imageUrl = `data:image/jpeg;base64,${compressedImageBase64}`;
  res.json({
    url: imageUrl,
    text: fileText,
    user: user,
  });
});

//gets all the data in database, converts the binary into url form and sends it back
app.post("/load", (req, res) => {
  const user = req.body.user;
  console.log("user in load", user);

  try {
    const results = accountConnection
      .query(`SELECT * FROM user_auth WHERE email = ?`, [user])
      .then((results) => {
        console.log(user, "user loaded database");
        console.log(results.length);

        if (results && results.length > 0) {
          const imageData = [];
          const imageUrl = [];
          const imageText = [];

          for (var i = 0; i < results[0].length; i++) {
            imageText[i] = results[0][i].photoText;
            imageData[i] = results[0][i].photoData.toString("base64");
            imageUrl[i] = `data:image/jpeg;base64,${imageData[i]}`;
          }

          res.json({
            url: imageUrl,
            text: imageText,
          });
        } else {
          console.log("No record found ");
          res.status(404).json({ error: "No record found" });
        }
      });
  } catch (error) {
    console.error("Error retrieving photo from database:", error);
    res.status(500).send("Error retrieving photo from database");
  }
});

//direcotry to react file
const reactPath = path.join(__dirname, "client", "build");
const picture = path.join(__dirname, "client", "src", "images");

app.use(express.static(reactPath));
app.use(express.static(picture));

// Middleware for handling requests to resources that are not found
app.use((req, res) => {
  // Set the HTTP status code to 404 (Not Found) and  simple HTML error message
  res.status(404).send("<h1> Error 404: Resource Not Found :(");
});

//rip it
app.listen(port, () => {
  console.log(`App listening  on port ${port}`);
});

//send an email to the email provided

function verifyEmail(email, code) {
  console.log(`sending email. to ${email}...`);
  // Create a transporter object using the default SMTP transport
  let transporter = mailer.createTransport({
    service: "hotmail", // You can use other services like 'outlook', 'hotmail', etc.
    port: "587",
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
    auth: {
      user: "picturio.verify@outlook.com", // Your email address
      pass: "PicturioVerifyAccount123$", // Your password
    },
  });

  let mailOptions = {
    from: "picturio.verify@outlook.com", // Sender address
    to: `${email}`, // List of recipients
    subject: "Verify Email For Picturio", // Subject line
    text: `Please verify your account by inserting this code ${code}`, // Plain text body
    html: `<p>Please verify your account by inserting this code <b>${code}</b></p>`, // HTML body
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error occurred:", error.message);
      return;
    }
    console.log("Email sent successfully!");
  });
}
