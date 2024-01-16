const express = require("express");
const router = express.Router();
const users = require("./models/model");
const ObjectID = require("mongodb").ObjectId;

//setting credential

const credential = {
  email: "admin@gmail.com",
  password: 1,
};

//Routing to Home Page

router.get("/", (req, res) => {
  if (req.session.userlogged) {
    res.redirect("/home");
  } else {
    res.render("uslog", { title: "Login System", err: false });
  }
});

//User Login Page

router.post("/logit", async (req, res) => {
  const { email, password } = req.body;
  const connects = await users.findOne({ email: email, password: password });
  if (connects) {
    console.log("Login Successfull");
    req.session.user = req.body.email;
    req.session.userlogged = true;
    res.redirect("/home");
  } else {
    console.log("Loggin Failed");
    res.render("uslog", { err: "Invalid Username or Password" });
  }
});

//Router User Login Page


router.get("/", (req, res) => {
  if (req.session.userlogged) {
    res.redirect("/home");
  } else {
    res.render("uslog", { title: "Login System", err: false });
  }
});

//Admin Login Page

router.get("/adminlogin", (req, res) => {
  if (req.session.adminlogged) {
    res.redirect("/adhome");
  } else {
    res.render("adlog", { title: "user login", err: false });
  }
});

//Admin Login Page

router.post("/adlogin", (req, res) => {
  if (
    req.body.email == credential.email &&
    req.body.password == credential.password
  ) {
    req.session.user = req.body.email;
    req.session.adminlogged = true;
    res.setHeader('Cache-Control', 'no-store');
    
    res.redirect(303, "/adhome");
  } else {
    res.render("adlog", { err: "Invalid Username or Password" });
  }
});

//adding datas to the admin home page

router.get("/adhome", async (req, res) => {
  if (req.session.adminlogged) {
    var i = 0;
    const useData = await users.find();

    res.render("adhome", { title: "user details", useData, i });
  } else {
    res.redirect("/adlogin");
  }
});

//Routing to sign up page

router.get("/signup", (req, res) => {
  res.render("signup",{error:""});
});

// Sign Up Page

router.post("/signup2", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || /\s/.test(name)) {
    const error = "Fill valid details";
    return res.render("signup", { error });
  }

  const existingUser = await users.findOne({ email: email });

  if (existingUser) {
    const error = "User with this email already exists";
    return res.render("signup", { error });
  }

  const newUser = await users.create(req.body);


  req.session.user = email;
  req.session.userlogged = true;
   res.setHeader('Cache-Control', 'no-store');
  res.redirect(303,"/home");
});


// insertion of users
router.post("/insert", async (req, res) => {
  const { name, email, password } = req.body;

  // Validate if the name contains spaces
  if (name.includes(" ")) {
    return res.render("adduser", { error: "Name cannot contain spaces" });
  }

  // Create a new user only if the name is valid
  const newuser = await users.create(req.body);
  res.redirect("/adhome");
});


// -----------------------------------------------------------
// router.post("/adminlogin", (req, res) => {
//   res.redirect("/adminlogin");
// });
// ----------------------------------------------------------


//search user

router.post("/search", async (req, res) => {
  var i = 0;
  const data = req.body;
  console.log(data);
  let useData = await users.find({
    name: { $regex: "^" + data.search, $options: "i" },
  });
  console.log(`Search Data ${useData} `);
  res.render("adhome", { title: "Home", user: req.session.user, useData, i });
});

//home routing

router.get("/home", (req, res) => {
  if (req.session.user) {
    res.render("usehome", { user: req.session.user });
  } else {
    res.redirect("/");
  }
});

router.get("/add", (req, res) => {
  res.redirect("/adduser");
});

router.get("/adduser", (req, res) => {
  res.render("adduser",{error:""});
});

//setting deletion

router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const deleted = await users.deleteOne({ _id: id });
  res.redirect("/adhome");
});

//edit user

router.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const dataone = await users.findOne({ _id: id });
  res.render("userdata", { title: "userdata", dataone });
});

//add user

router.post("/update/:id", async (request, response) => {
  let newData = request.body;
  let id = request.params.id;
  await users.updateOne(
    { _id: id },
    {
      $set: {
        name: newData.name,
        email: newData.email,
      },
    }
  );
  response.redirect("/adhome");
});

//signout routing

router.get("/signout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/adhome", (req, res) => {
  res.render("adhome", { title: "adhome", table });
});

router.use((req, res, next) => {
  res.status(404).render('404');
});


module.exports = router;
