import express from "express";
import cors from "cors";
import mongoose, { Schema } from "mongoose";
import { stringToHash, varifyHash } from "bcrypt-inzi";
import cookieParser from "cookie-parser";
import fs from "fs";
import multer from "multer";
// import admin from 'firebase-admin'
import admin from "firebase-admin";

const port = process.env.PORT || 3001;

let dbURI =
  process.env.MONGOOSEDBURI ||
  "mongodb+srv://abc:abc@cluster0.olyure1.mongodb.net/socialmediaapp12?retryWrites=true&w=majority";
mongoose.connect(dbURI);

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000", "*"],

    credentials: true,
  })
);

// http:// firebase.google.com/storage/admin/start

// var serviceAccount = require("path/to/serviceAccountKey.json");
var serviceAccount = {
  type: "service_account",
  project_id: "fileupload-1a44e",
  private_key_id: "6a610f92ebfcd22f25f6bdb6105a5d34fd88270e",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC61d/JWXHePh1Z\nw7fBqfeVExnIK8QPyu0Avy8wwPg7BuRjqV4qlMx+Gt/76vh495ymbGVDOINToaut\nxqHUwn5ra3z/Rj7WgN4oN4L4h4wjheOxFQjTPeqc5SxRLlJ9z18YIDaKDrXTsSF+\nddV4g4/mqwLQZU3o5iUezLCynzV/gBKkyTN3XhorrxtP5au9Ag8z4iJQDUiIXKYs\nUKhd3Ja8VceFYZhnkFgVeIrInObpRy9Arh4TYqYTHtJNdKCl6DyXMpX95dSQTwy8\n5Qicndm1C6kwBRzUeedc3Tt7NdB7jvPwNwfIeAnMscolBmB3SRavZUSU19OTjy6K\nVu3DgPphAgMBAAECggEATW3FSJSg9BGZ6FGMHd5qlIVN8f7xSfo3LlANJo9SUGQS\n0pqmQ89W0AwjNyuxvbAgY3gYnzsUcdxWYbYn6xyPd8UcEE70S8EsUE5xIL5L/YzH\nR+QHvEO0r0DqlNo1pZ4DMuRmteBSymBmGRqMVV1wjY/hoqvZFeQLDjCWKfCBI00i\nssCcvP5zA/Gg8ePVmsoK0VKOxWWsA4zUwndZ7IUl05fyHjtLJA0NYd6cg5+D0jMH\n8//O5C4OS6eUwrTKwn3B7Q107ANkS1vHEnBi59cuk5G/xLtfOmN5Mbfs5G4GNtml\nzZy7GlvDttodDFeYmxMT/qcg80ZmfSYlXUJaV6Hd4QKBgQDqw0sitmaQ26sDHCld\n3pz2/bgjDsQhATtvIQCWS8JYA+IcUpRFuJhfMTLHfuIlsOGZkygSIcWbPfdj0HKr\nG5B8NiqDHGt9huOTj4TKWFZqkdaj0KhDHYKM8DhY33RUD13H+Qem857jseIMoVYu\n/XZ4GhkEZ9ZbNSnUAoy47l1XwwKBgQDLvKnhbAfmMGClU7zWNsXcnCLoe67JfH1b\nZWINDrfRwNfAtL/QA0UFy827ufg3D+pG9tHNK1O5rkPa+XyXcRPFGmIDaK0VrCSl\nJ7nGJPdecnRntwd0ZDiyEkxfcCTrmVxpDPQHG6oJ9Dl/K0USTvU9OBFc9TZP/lyV\nPSQ+Y+qnCwKBgQCFK3MbpcxYr8M6aGcu0HDJyvMBMAchkcldKKNknmUH+GvzFQT2\n59fHZ+keMWOnbccLjuZUIsQtY+FJxZzGY0R6sV88MIrpEfNWaTsybRnYKhJPqrVI\nHR1JRZsxDtC2PmE8Zo9orRmcn/NSptJ0pWLmjidS0HRQGMA5e5jH7q8UcQKBgQCy\nhnBJ4lMNpuiZFkZLYxWAGaURGIfxcE+cTbtce8AhYZzs9LV7fdH2oT52uB/DiAOf\nCVqQMN4dv5EgCSvevCw5s8Oc/xVj/0LhIW1NLklAjoRn+V7j44o2p4gavPbtJ6Zt\nOvd+XwRh0oqrX2wX/e4xJbc5QHnGILpZ34ipzv3oPwKBgQCktHhj5YrqfLDdNBlE\nirnLJ+NEDA3i/BHIS9Mlqc0Z/5P33EV9tuNcVV77NLuLqHgMIfeBfMDL2biWxmp0\n1mmIwl6nfsK++LgFnHSGvmIBC7QXiXxoQgJ8c4onYkXK0lgOfReNmMxGvmsRFeRJ\ndTyLJdoZJbsoGU1aJRf3aGpfAw==\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-t7svu@fileupload-1a44e.iam.gserviceaccount.com",
  client_id: "102630454630107679051",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-t7svu%40fileupload-1a44e.iam.gserviceaccount.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fileupload-1a44e.firebaseio.com",
});
const bucket = admin.storage().bucket("gs://fileupload-1a44e.appspot.com");

const storageConfig = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    console.log("mul-file: ", file);
    cb(null, `${new Date().getTime()} - ${file.originalname}`);
  },
});
const upload = multer({ storage: storageConfig });
const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String, required: true },

  createdOn: { type: Date, default: Date.now, required: true },
});

const userModel = mongoose.model("Users", userSchema);

app.post("/signup", upload.any(), (req, res) => {
  let body = req.body;

  // console.log("req.body : ",body)
  // console.log("req.body : ",body.firstName)
  // console.log("req.body : ",body.lastName)
  // console.log("req.body : ",body.email)
  // console.log("req.body : ",body.password)

  console.log("file : ", req.files[0]);

  if (
    !body.firstName 
    || !body.email 
    || !body.password
  ) {
    res.status(400).send(
      `required field missing, request example :
      {
          firstName :"john"
          email  :"abd@abc.com
          lastName :"doe"
          address :"city name"
          password :"12345"
      }`
    );
    return;
  }

  // http://googleapis.dev/nodejs/storage/latest/Bucket.html#upload-examples

  bucket.upload(
    req.files[0].path,
    {
     destination: `profilePhotos/${req.files[0].filename}`, //give destination
    },

    function (err, file, apiResponse) {
      if (!err) {
        // console.log("api response",apiResponse)

        //https://googleapis.dev/nodejs/torage/latest/Bucket.html#getSignedUrl
        file
          .getSignedUrl({
            action: "read",
            expires: "03-09-2491",
          })
          .then((urlData, err) => {
            if (!err) {
              console.log("public download url :", urlData[0]); // this is public downloadable url

              // delete file from folder before sending response back to client (optional but recommended)
              // optional because it is gonna delete automatically sooner or later
              // recommended because you may run out of space if you dont do so, and if your files are sensitive it is simply not safe in server folder

              try {
                fs.unlinkSync(req.files[0].path);
                //file removed
              } catch (err) {
                console.error(err);
              }


              userModel.findOne({ email: body.email }, (err, user) => {
                if (!err) {
                  console.log("user",user);
            
                  if (user) {
                    //user already exist
                    console.log("user already exist :", user);
                    res
                      .status(400)
                      .send({ message: "user already exist,,Please try deffrent email" });
                    return;
                  } else {
                    //user not already exist
            
                    stringToHash(body.password).then((hashString) => {
                      userModel.create(
                        {
                          firstName: body.firstName,
                          // lastName: body.lastName,
                          // address: body.address,
                          email: body.email.toLowerCase(),
                          password: hashString,
                          profilePicture:urlData[0]
                        },
                        (err, result) => {
                          if (!err) {
                            console.log("data saved:", result);
                            res.status(201).send({
                               message: "user is created" ,
                            data : {
                              firstName: body.firstName,
                              email: body.email.toLowerCase(),
                              profilePicture:urlData[0]
                            }
                          
                          });
                          } else {
                            console.log("db error: ", err);
                            res.status(500).send({ message: "internal server error" });
                          }
                        }
                      );
                    });
                  }
                } else {
                  console.log("db error: ", err);
                  res.status(500).send({ message: "db error in query" });
                  return;
                }
              });
            
            
          
              // res.send("ok");
            }
          });
      } else {
        console.log("err: ", err);
        res.status(500).send();
      }
    }
  );

  // check if user already exist // query email user

  // userModel.findOne({ email: body.email }, (err, user) => {
  //   if (!err) {
  //     console.log("user");

  //     if (user) {
  //       //user already exist
  //       console.log("user already exist :", user);
  //       res
  //         .status(400)
  //         .send({ message: "user already exist,,Please try deffrent email" });
  //       return;
  //     } else {
  //       //user not already exist

  //       stringToHash(body.password).then((hashString) => {
  //         userModel.create(
  //           {
  //             firstName: body.firstName,
  //             lastName: body.lastName,
  //             address: body.address,
  //             email: body.email.toLowerCase(),
  //             password: hashString,
  //           },
  //           (err, result) => {
  //             if (!err) {
  //               console.log("data saved:", result);
  //               res.status(201).send({ message: "user is created" });
  //             } else {
  //               console.log("db error: ", err);
  //               res.status(500).send({ message: "internal server error" });
  //             }
  //           }
  //         );
  //       });
  //     }
  //   } else {
  //     console.log("db error: ", err);
  //     res.status(500).send({ message: "db error in query" });
  //     return;
  //   }
  // });












});


// get all user

app.get("/users", async (req, res) => {
  console.log("users recived :", req.body);

  try {
    let users = await userModel.find({}).exec();

    console.log("all users", users);

    res.send({
      message: "all users",
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      message: "falled to get users",
    });
  }
});



app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
/////////////////////////////////////////////////////////////////////////////////////////////////
mongoose.connect(dbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on("connected", function () {
  //connected
  console.log("Mongoose is connected");
});

mongoose.connection.on("disconnected", function () {
  //disconnected
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on("error", function (err) {
  //any error
  console.log("Mongoose connection error: ", err);
  process.exit(1);
});

process.on("SIGINT", function () {
  /////this function will run jst before app is closing
  console.log("app is terminating");
  mongoose.connection.close(function () {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////
