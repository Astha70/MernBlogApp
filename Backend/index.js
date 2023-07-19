import express, {json} from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./Modals/userModal.js";
import Post from "./Modals/postModal.js";


const app = express();
const PORT = 5000;


app.use(express.json());
app.use(cors());

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "API running successfully!",
  });
});


// Connect to databse
mongoose.connect("mongodb+srv://astha3000:qwZ7YMhT2dDLbRdi@cluster0.wce9axw.mongodb.net/BlogApp").then(() => {
    console.log("Database connected successfully!");
})

const generateToken = (_id) => {
  const token = jwt.sign(
    {
      _id,
    },
    "secret",
    { expiresIn: "1d" }
  );

  return token;
};

const checkToken = (req, res, next) => {

  let token = req.headers.authorization;

  // token present or not
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized!",
    });
  }

  // check validity of the token
  try {
    token = token.split(" ")[1];

    let decodedToken = jwt.verify(token, "secret");

    req._id = decodedToken._id;

    next();
  } catch {
    return res.status(401).json({
      message: "Unauthorized!",
    });
  }
};


app.post("/register", (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    //validation
    if (!username || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please Fill all fields",
      });
    }
    //exisiting user
    User.findOne({ email }).then((data,err) => {
      if (err) {
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }

      if (data) {
      return res.status(401).send({
        success: false,
        message: "user already exisits",
      });
    }else{
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const encryptedPassword = bcrypt.hashSync(password, salt);


      //save new user
      User.create({ 
        username, 
        email, 
        password: encryptedPassword,
      }).then((data,err) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }

        return res.status(201).send({
          success: true,
          message: "New User Created",
          user:data,
          token: generateToken(data._id),
        });
      }); 
    }
  })  
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(401).json({
      success: false,
      message: "Please provide email or password",
    });
  }

  User.findOne({
    email,
  }).then((data, err) => {
    if (err) {
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }

    if (data) {
      const isMatch = bcrypt.compareSync(password, data.password);

      if (isMatch) {
        return res.status(200).json({
          message: "Login successfull!",
          user: data,
          token: generateToken(data._id),
        });
      } else {
        return res.status(401).json({
          message: "Invalid Credentials",
          success: false,
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "email is not registered",
      });
    }
  });
});

app.get("/all-users", (req, res) => {
  User.find({}).then((data,err) => {
    if(err) {
      return res.status(500).send({
        success: false,
        message: "Error In Get ALl Users",
      });
    }
    if(data){
      return res.status(200).send({
        userCount: data.length,
        success: true,
        message: "all users data",
        users: data,
      });
    } 
  }); 
});

//GET ALL BLOGS
app.get("/all-blog",checkToken, (req, res) => {
  Post.find({}).populate("user").then((data,err) => {
    if(err) {
      return res.status(500).send({
        success: false,
        message: "Error While Getting Blogs",
        err,
      });
    }
    if (!data) {
      return res.status(200).send({
        success: false,
        message: "No Blogs Found",
      });
    }
    return res.status(200).send({
      success: true,
      BlogCount: blogs.length,
      message: "All Blogs lists",
      blogs: data,
    });
  });
    
});

//POST || create blog
app.post("/create-blog",checkToken, (req, res) => {
  const { title, description, image, user } = req.body;
    //validation
  if (!title || !description || !image || !user) {
      return res.status(400).send({
        success: false,
        message: "Please Provide All Fields",
      });
  }
    User.findById(user).then(async (data, err) => {
      //validaton
      if(err) {
        return res.status(400).send({
          success: false,
          message: "Error While Creting blog",
          err,
        });
      }
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "unable to find user",
      });
    }

    const newBlog = new Post({ title, description, image, user });
    const session = await mongoose.startSession();
    session.startTransaction();
    await newBlog.save({ session });
    data.blogs.push(newBlog);
    await data.save({ session });
    await session.commitTransaction();
    await newBlog.save();
    return res.status(201).send({
      success: true,
      message: "Blog Created!",
      newBlog,
    });
    })
});

//PUT || update blog
app.put("/update-blog/:id",checkToken,async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;
    const blog = await Post.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "Blog Updated!",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error While Updating Blog",
      error,
    });
  }
});

//GET || SIngle Blog Details
app.get("/get-blog/:id",checkToken,async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Post.findById(id);
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "blog not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "fetch single blog",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "error while getting single blog",
      error,
    });
  }
});

//DELETE || delete blog
app.delete("/delete-blog/:id",checkToken,async (req, res) => {
  try {
    const blog = await Post
      // .findOneAndDelete(req.params.id)
      .findByIdAndDelete(req.params.id)
      .populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
    return res.status(200).send({
      success: true,
      message: "Blog Deleted!",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Erorr WHile Deleteing BLog",
      error,
    });
  }
});

//GET || user blog
app.get("/user-blog/:id",checkToken,async (req, res) => {
  try {
    const userBlog = await User.findById(req.params.id).populate("blogs");

    if (!userBlog) {
      return res.status(404).send({
        success: false,
        message: "blogs not found with this id",
      });
    }
    return res.status(200).send({
      success: true,
      message: "user blogs",
      userBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "error in user blog",
      error,
    });
  }
});

app.listen(PORT, () => {
    console.log("Listening on port: "+ PORT);
})
