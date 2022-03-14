const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");
const sgMail = require("@sendgrid/mail");

const cloudinary = require("cloudinary");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const expressJwt = require("express-jwt");
const { Link } = require("../models/link");
exports.getAllUser = async (req, res) => {
  const getAllUser = await User.find({});

  res.json(getAllUser);
};

exports.authCheck = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

exports.getUserById = async (req, res) => {
  try {
    const getUserById = await User.findById(req.params.id).select("-password");
    if (!getUserById)
      return res.status(400).json({ message: "user not found" });

    const links = await Link.find({ postedBy: req.params.id }).select(
      "urlPreview views likes"
    );

    if (!links) return res.status(400).json({ message: "links not found" });
    res.json({ getUserById, links });
  } catch (error) {
    console.log(error);
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      return res.json({
        error: "isim zorunludur",
      });
    }
    if (!email) {
      return res.json({
        error: "Email zorunludur",
      });
    }
    if (!password || password.lenght < 6) {
      return res.json({
        error: "Parola zorunlu veya en az 6 karekterli olmalıdır",
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        err: "Email kayıtlı",
      });
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    const newEmail = email.toLowerCase();
    let user = await new User({
      name,
      email: newEmail,
      password: hashPassword,
    }).save();

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      user: { name: user.name, _id: user._id, email: user.email },
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let emailLowerCase = email.toLowerCase();
    const dbUser = await User.findOne({ email: emailLowerCase });
    if (!dbUser) return res.json({ error: "Kullanıcı bulunamadı" });

    if (dbUser && bcrypt.compareSync(password, dbUser.password)) {
      const token = jwt.sign(
        {
          userId: dbUser._id,
          email: dbUser.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        user: { name: dbUser.name, email: dbUser.email, _id: dbUser._id },
        token: token,
      });
    }
    return res.json({ error: "Error. Try Again" });
  } catch (error) {
    console.log(error);
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ error: "Kullanıcı bulunamadı" });

  const resetCode = nanoid(5).toUpperCase();

  user.resetCode = resetCode;
  user.save();

  const emailData = {
    from: process.env.EMAİL_FROM,
    to: user.email,
    subject: "Şifre yenileme kodu",
    html: `
    <h4> Şifre yenileme </h4>
    <h1> Şifre yenilemek için kod :  ${resetCode} </h1>
    `,
  };

  try {
    const data = await sgMail.send(emailData);
    console.log(data);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.json({ ok: false });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, password, resetCode } = req.body;
    const lowerCaseEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowerCaseEmail });

    if (!user)
      return res.status(400).json({ error: "Email yenileme kodu geçersiz" });

    if (!password || password.lenght > 6) {
      return res.json({
        error: "Parola zorunludur",
      });
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    user.password = hashPassword;
    user.resetCode = "";
    user.save();
    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    console.log(req.user);
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: nanoid(),
      resource_type: "jpg",
    });
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        image: {
          public_id: result.public_id,
          url: result.secure_url,
        },
      },
      { new: true }
    );

    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    });
  } catch (error) {
    console.log(error);
  }
};
