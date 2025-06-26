import express from "express";
import cookieParser from "cookie-parser";
const router = express.Router();
import bcrypt from "bcryptjs";
import Employer from "../models/Employer.js";
import USER from "../models/User.js";
router.use(cookieParser());
import authenticateToken from "../middleware/authenticateToken.js";


const generatePin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


router.post("/signup-employer", async (req, res, next) => {

  try {

    const { email, password, firstName, lastName, designation, company_name, country, city, company_type, company_category } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);
    const lowerCaseEmail = email.toLowerCase();
    const pin = generatePin();

    if (!email || !password ) {
      return res.status(400).send({
         error: "All fields are mandatory",
         data: null,
         message: "Please provide all fields",
       });
     }

    const existingUser = await Employer.findOne({ email: lowerCaseEmail });

    if (existingUser) {
      return res.status(400).send({
        error: "User already exists",
        data: null,
        message: "User already exists with the same email address. Please login to continue.",
      });
    }

    else{

    await Employer.create({
      email: lowerCaseEmail,
      password: hashedPassword,
      reset_pin : pin,
      firstName,
      lastName,
      designation,
      company_name,
      country,
      city,
      company_type,
      company_category

    });

    return res.status(200).send({ success: true });
  }
  } catch (error) {
    // return next(new ErrorHandler(error.message, 500));
  }
});

router.get("/verify-login-token", authenticateToken, async (req, res) => {
  return res.status(200).json({ valid: true, user: req.user });
});


router.get('/all_employers', async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    // Ensure valid numbers
    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page <= 0) page = 1;
    if (isNaN(limit) || limit <= 0) limit = 10;

    const totalCount = await Employer.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    const employers = await Employer.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      employers,
      totalPages,
    });
  } catch (err) {
    console.error('Error fetching employers:', err);
    return res.status(500).json({
      message: 'Server error while fetching employers',
      error: err.message,
    });
  }
});



router.post("/logout", authenticateToken, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

  
router.post('/get-user-details', authenticateToken, async function (req, res) {
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(400).json({ message: "Username is invalid." });
  }

  try {
    const result = await USER.findById(userId).populate('employmentDetails').populate('skills');

    if (result) {
      return res.status(200).send({
        success: true,
        data: {
          email: result.email,
          randomFirstName : result.randomFirstName,
          randomLastName : result.randomLastName,
          employmentDetails: result.employmentDetails,
          skills: result.skills
        },
      });
    } else {
      return res.status(200).send({ success: false, data: null });
    }

  } catch (error) {
    console.error("❌ Error fetching user details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



export default router;
