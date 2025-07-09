import express from "express";
import cookieParser from "cookie-parser";
const router = express.Router();
import bcrypt from "bcryptjs";
import EmploymentDetails from "../models/EmploymentDetails.js";
import USER from "../models/User.js";
import SHORTLIST from "../models/Shortlists.js";
import JobLocations from "../models/JobLocations.js";
import CONVERSATION from "../models/Conversation.js";
import MESSAGE from "../models/Messages.js";
import ProjectsWorked from "../models/Projects.js";
import Skills from "../models/Skills.js";
import Roles from "../models/Roles.js";
import sendMail from "../utils/sendMail.js";
router.use(cookieParser());
import authenticateToken from "../middleware/authenticateTokenProfessional.js";
import generateJWTtoken  from "../middleware/generateJWTtoken.js";
import disposableEmailDomains from 'disposable-email-domains-js';
import { promises as dns } from 'dns';
import validator from 'validator';


const generatePin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


router.post("/signup-user-gmail", async (req, res, next) => {


  try {
    const { email, firstName, lastName } = req.body;

    const user = await USER.findOne({ email });

    if (!user) {

      await USER.create({
        email: email,
        first_name: firstName,
        last_name: lastName,
        is_google_user : true
      });

    const createdUser = await USER.findOne({ email });

      createToken(createdUser, res);

    }

    else{

      createToken(user, res);

    }

  
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error",
      data: null,
      message: "An error occurred",
    });
  }
});

router.post("/user-login-gmail", async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await USER.findOne({ email });

    const now = new Date();
    let wasNew = false;

    if (!user) {
      // Create new user if they don't exist
      user = await USER.create({
        email,
        firstName,
        lastName,
        is_google_user: true,
        last_login: now,
        loginHistory: [now]
      });
      wasNew = true;
    } else {
      // Update last_login and append to loginHistory
      await USER.updateOne(
        { _id: user._id },
        {
          $set: { last_login: now },
          $push: { loginHistory: now }
        }
      );
    }

    const token = await generateJWTtoken(user._id, user.email);

    res.cookie("token_professional", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });

    return res.status(200).json({
      success: true,
      message: wasNew ? "User registered successfully" : "User logged in successfully",
      user: {
        user_id: user._id,
        user_email: user.email,
      },
      token,
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "An error occurred",
    });
  }
});

function isValidEmail(email) {
  // First, validate the email format
  if (!validator.isEmail(email)) {
      return false;
  }

  // Split into local part and domain
  const localPart = email.split('@')[0];

  // Check for meaningfulness using a regex (basic logic, can be improved)
  const meaningfulPattern = /^[a-zA-Z]{3,}([a-zA-Z0-9._]{0,})$/;

  return meaningfulPattern.test(localPart);
}

async function validateDomain(email) {
  const domain = email.split('@')[1];

  try {
      const mxRecords = await dns.resolveMx(domain);
      if (mxRecords && mxRecords.length > 0) {
          return true;
      } else {
          return false;
      }
  } catch (err) {
      return false;
  }
}


router.post("/verify_work_mail", authenticateToken, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ valid: false, message: "Invalid token" });
    }

    const user = await USER.findById(req.user.user_id);

    if (!user) {
      return res.status(404).json({ valid: false, message: "User not found" });
    }

    const { email } = req.body;
    const lowerCaseEmail = email.toLowerCase();
    const pin = generatePin();

    // General email format check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(lowerCaseEmail)) {
      return res.status(200).send({ valid: false, message: 'Invalid Email Address' });
    }

    // Custom email format validation (optional extra validation)
    if (!isValidEmail(lowerCaseEmail)) {
      return res.status(200).send({ valid: false, message: 'Invalid Email Address' });
    }

    const domain = lowerCaseEmail.split('@')[1];

    const baseDomain = domain.split('.').slice(-2).join('.'); // Handles subdomains like dept.company.com → company.com

    const commonEmailDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
      'protonmail.com', 'icloud.com', 'aol.com', 'zoho.com', 'mail.com'
    ];

    const isDomainValid = await validateDomain(lowerCaseEmail); // Should check for real domain & MX records if possible

    // Block common public domains and disposable domains
    if (
      !isDomainValid ||
      disposableEmailDomains.isDisposableEmailDomain(domain) ||
      disposableEmailDomains.isDisposableEmail(lowerCaseEmail) ||
      commonEmailDomains.includes(baseDomain)
    ) {
      return res.status(200).send({ valid: false, message: 'Use a valid work email (not public domains like Gmail)' });
    }

    // Email is valid and from a valid work domain
    const existingUser = await USER.findOne({ email: user.email });

    if (existingUser) {
      existingUser.verify_pin = pin;
      existingUser.work_email = lowerCaseEmail;
      await existingUser.save();

      const options = {
        to: lowerCaseEmail,
        subject: "Verify Account - Newrole.in",
        text: `Your 6-digit PIN: ${pin}`,
        userEmail: user.email
      };

      await sendMail(options);
      return res.status(200).send({ valid: true });
    }

    return res.status(404).send({ valid: false, message: 'User email not found in database' });

  } catch (error) {
    console.error("Verification Error:", error);
    return res.status(500).send({ valid: false, message: "Something went wrong" });
  }
});



router.post('/check-work-email-verified', authenticateToken, async (req, res) => {
  
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(400).json({ message: 'Invalid user.' });
  }

  try {
    const user = await USER.findById(userId).select('working_mail_verified');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.working_mail_verified) {
      return res.status(200).json({ verified: true });
    } else {
      return res.status(200).json({ verified: false });
    }

  } catch (error) {
    console.error('❌ Error checking verification status:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post("/get-user-additional-details", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ valid: false, message: "Invalid token" });
    }

    const userId = req.user.user_id;

    const user = await USER.findById(userId).select("linkedinUrl");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.post("/update-user-additional-details", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ valid: false, message: "Invalid token" });
    }

    const userId = req.user.user_id;

    const updates = {};
    if (req.body.linkedinUrl !== undefined) {
      updates.linkedinUrl = req.body.linkedinUrl;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    await USER.findByIdAndUpdate(userId, { $set: updates });

    res.json({ success: true, message: "User details updated" });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post('/get-user-certifications', authenticateToken, async (req, res) => {
  try {
      if (!req.user) {
      return res.status(401).json({ valid: false, message: "Invalid token" });
    }

    const userId = req.user.user_id   

    const user = await USER.findById(userId).select('certifications');
    res.json({ success: true, data: user.certifications || [] });
  } catch (err) {
    res.json({ success: false });
  }
});

router.post('/add-user-certification', authenticateToken, async (req, res) => {
  try {

     if (!req.user) {
      return res.status(401).json({ valid: false, message: "Invalid token" });
    }

    const userId = req.user.user_id   

    const { certificationName, issuedBy, issuedOn } = req.body;

    await USER.findByIdAndUpdate(userId, {
      $push: {
        certifications: { certificationName, issuedBy, issuedOn }
      }
    });

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

router.put("/update-user-certification", authenticateToken, async (req, res) => {
  try {
     if (!req.user) {
      return res.status(401).json({ valid: false, message: "Invalid token" });
    }

    const userId = req.user.user_id   
    const { certId, certificationName, issuedBy, issuedOn } = req.body;
    await USER.updateOne(
      { _id: userId, "certifications._id": certId },
      {
        $set: {
          "certifications.$.certificationName": certificationName,
          "certifications.$.issuedBy": issuedBy,
          "certifications.$.issuedOn": issuedOn,
        },
      }
    );
    res.json({ success: true });
  } catch {
    res.json({ success: false });
  }
});

router.delete("/delete-user-certification", authenticateToken, async (req, res) => {
  try {

      if (!req.user) {
      return res.status(401).json({ valid: false, message: "Invalid token" });
    }

    const userId = req.user.user_id  

    const { certId } = req.body;
    await USER.findByIdAndUpdate(userId, {
      $pull: { certifications: { _id: certId } },
    });
    res.json({ success: true });
  } catch {
    res.json({ success: false });
  }
});


router.get("/verify-login-token-refresh-token", authenticateToken, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ valid: false, channelConnected : false, message: "Invalid token" });
        }

        const user = await USER.findById(req.user.user_id);

        if (!user) {
            return res.status(404).json({ valid: false, channelConnected : false, message: "User not found" });
        }

        if (!user.youtube_channel_linked) {
            return res.status(400).json({ valid: true, channelConnected : false, message: "No linked YouTube channel" });
        }


        return res.status(200).json({ valid: true, channelConnected : true });

    } catch (error) {
        console.error("Unexpected error:", error.response?.data || error.message);
        return res.status(500).json({ valid: false, channelConnected : false, message: "Internal Server Error" });
    }
});

router.post("/check-email-exists-sendMail", async function (req, res) {

  const { email } = req.body;
  const pin = generatePin();

  
  USER.findOne({ email : email}).then( async (result)=>{

    if(result){

      const options = {
        to: email,
        subject: "Password Reset PIN - CreatorConsole",
        text: `Your 6-digit PIN: ${pin}`,
    }

    await USER.findByIdAndUpdate(result._id, { reset_pin: pin });
    await sendMail(options);

    res.status(200).send({ exists : true, emailSent: true});
    res.end();


    }

    else{

      res.status(200).send({ exists: false});
      res.end();


    }

  }).catch((err) =>{

    return res.status(500).send({
      error: "Internal server error",
      data: null,
      message: "An error occurred",
    });

  })


});

router.post("/delete-account-permanently-with-code", authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ emailSent: false, error: "Invalid token" });
    }

    const user = await USER.findById(req.user.user_id);

    if (!user) {
      return res.status(404).json({ emailSent: false, error: "User does not exist" });
    }

    const pin = generatePin();

    const options = {
      to: user.email,
      subject: "Account Delete Code - NewRole.in",
      text: `Your 6-digit PIN: ${pin}`,
    };

    await Promise.all([
      USER.findByIdAndUpdate(user._id, { account_delete_code: pin }),
      sendMail(options),
    ]);

    return res.status(200).json({ emailSent: true });

  } catch (error) {
    console.error("Delete code error:", error);
    return res.status(500).json({
      emailSent: false,
      error: "Internal server error. Please try again later.",
    });
  }
});


router.post("/change-password", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const { password, newPassword } = req.body;
    if (!password || !newPassword) {
      return res.status(400).json({ success: false, message: "Both passwords are required" });
    }

    const userId = req.user.user_id;
    const user = await USER.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if old password is correct
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Wrong current password" });
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await USER.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});




router.post("/check-verify-pin-professional", authenticateToken, async function (req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ valid: false, message: "Invalid token" });
    }

    const user = await USER.findById(req.user.user_id);
    if (!user) {
      return res.status(404).json({ valid: false, message: "User not found" });
    }

    const { pin } = req.body;
    const pinAsInt = parseInt(pin);

    if (user.verify_pin === pinAsInt) {
      const randomNumber = Math.floor(Math.random() * 900000) + 100000;
      const applicantName = `AN${randomNumber}`;

      await USER.findByIdAndUpdate(
        user._id,
        {
          working_mail_verified: true,
          applicantName: applicantName
        },
        { new: true }
      );

      return res.status(200).send({ matching: true });
    } else {
      return res.status(200).send({ matching: false });
    }
  } catch (error) {
    console.error("❌ Error verifying pin:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



router.post("/check-resetPin-withDb", async function (req, res) {

  const { email, pin } = req.body;
  const pinAsInt = parseInt(pin);
  
  USER.findOne({ email : email}).then(async (result)=>{

    if(result.reset_pin === pinAsInt){

  res.status(200).send({ matching: true, email: email});
  res.end();

    }

    else{

      res.status(200).send({ matching: false});
      res.end();

    }

  }).catch((err) =>{

  })

});

router.post("/check-deleteCode-withDb", authenticateToken, async function (req, res) {


  const userId = req.user?.user_id; //user_id from authenticated token

  if (!userId) {
    return res.status(400).json({ message: "Username is invalid." });
  }

  const { pin } = req.body;
  const pinAsInt = parseInt(pin);
  
  USER.findById(userId).then(async (result)=>{

    if (result.account_delete_code === pinAsInt) {
      await USER.findByIdAndDelete(userId);
      return res.status(200).json({ matching: true, deleted: true, message: "Account successfully deleted." });
    } else {
      return res.status(200).json({ matching: false, deleted: false, message: "Incorrect PIN." });
    }

  }).catch((err) =>{

  })

});



router.post("/delete_employment_details", authenticateToken, async function (req, res) {
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(400).json({ message: "User is invalid." });
  }

  const { employment_id } = req.body;

  try {
    // Step 1: Delete from EmploymentDetails collection
    await EmploymentDetails.findByIdAndDelete(employment_id);

    // Step 2: Pull reference from User collection
    await USER.updateMany(
      { employmentDetails: employment_id },
      { $pull: { employmentDetails: employment_id } }
    );
    
    res.status(200).json({ deleted : true, message: 'Employment deleted successfully' });
  } catch (error) {
    console.error('Error deleting employment:', error);
    res.status(500).json({ deleted : true, message: 'Server error' });
  }

});

router.post("/save_employment_details", authenticateToken, async function (req, res) {
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(400).json({ message: "User is invalid." });
  }

  const {
    isCurrentEmployment,
    employmentType,
    companyName,
    hideCurrentCompany,
    jobRoleId,
    fromYear,
    fromMonth,
    toYear,
    toMonth,
    ctc,
    currency,
    noticePeriod,
    workLocation
  } = req.body;

  const monthToNumber = {
    January: 1, February: 2, March: 3, April: 4,
    May: 5, June: 6, July: 7, August: 8,
    September: 9, October: 10, November: 11, December: 12
  };

  try {
    const fromMonthNum = monthToNumber[fromMonth] || 1;

    let toYearFinal = toYear;
    let toMonthNum = monthToNumber[toMonth] || 1;

    if (isCurrentEmployment) {
      const currentDate = new Date();
      toYearFinal = currentDate.getFullYear();
      toMonthNum = currentDate.getMonth() + 1;
    }

    const totalExpInMonths =
      (toYearFinal - fromYear) * 12 + (toMonthNum - fromMonthNum);

    const newEmployment = new EmploymentDetails({
      user_id: userId,
      isCurrentEmployment,
      employmentType,
      companyName,
      hideCurrentCompany,
      jobRoleId,
      fromYear,
      fromMonth,
      toYear,
      toMonth,
      ctc,
      currency,
      noticePeriod,
      totalExpInMonths: Math.max(0, totalExpInMonths),
      workLocation
    });

    const savedEmployment = await newEmployment.save();

    await USER.findByIdAndUpdate(
      userId,
      { $push: { employmentDetails: savedEmployment._id } },
      { new: true, useFindAndModify: false }
    );

    return res.status(201).json({ saved: true, message: "Employment details saved successfully." });
  } catch (error) {
    console.error("Error saving employment details:", error);
    return res.status(500).json({ saved : false, message: "Internal server error." });
  }
});

router.post('/update_employment_details', authenticateToken, async (req, res) => {

  try {
    const {
      employment_id,
      employmentType,
      companyName,
      jobRoleId,
      fromYear,
      fromMonth,
      toYear,
      toMonth,
      ctc,
      currency,
      noticePeriod,
      workLocation,
    } = req.body;

    const userId = req.user.user_id;

    // Make sure employment record exists and belongs to the user
    const employment = await EmploymentDetails.findOne({
      _id: employment_id,
      user_id: userId,
      is_del: false,
    });

    if (!employment) {
      return res.status(404).json({ saved: false, message: 'Employment not found or unauthorized' });
    }

    // Update fields directly
    employment.employmentType = employmentType;
    employment.companyName = companyName;
    employment.jobRoleId = jobRoleId;
    employment.fromYear = fromYear;
    employment.fromMonth = fromMonth;
    employment.toYear = toYear || null;
    employment.toMonth = toMonth || null;
    employment.ctc = ctc;
    employment.currency = currency || 'INR';
    employment.noticePeriod = noticePeriod;
    employment.workLocation = workLocation;
    employment.updated_at = new Date();

    await employment.save();



    return res.json({ saved: true, message: 'Employment updated successfully' });
  } catch (error) {
    console.error('Error updating employment:', error);
    return res.status(500).json({ saved: false, message: 'Internal Server Error' });
  }
});

router.post('/get-projects-worked', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Step 1: Get project IDs from user
    const user = await USER.findById(userId).select('projects_worked_on');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const projectIds = user.projects_worked_on || [];

    if (projectIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Step 2: Get project details
    const projects = await ProjectsWorked.find({
      _id: { $in: projectIds },
      is_del: false

    });

    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post('/add-project', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const newProject = new ProjectsWorked({
      ...req.body,
      user_id: userId,
    });

    await newProject.save();

    // Optionally add to user's profile (if you maintain a reference array)
    await USER.findByIdAndUpdate(userId, {
      $addToSet: { projects_worked_on: newProject._id }
    });

    return res.status(200).json({ success: true, message: "Project saved" });
  } catch (err) {
    console.error("Error saving project:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post('/update-project/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const projectId = req.params.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const project = await ProjectsWorked.findOne({
      _id: projectId,
      user_id: userId,
      is_del: false
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Update fields
    const updatableFields = [
      'projectName',
      'roleInProject',
      'projectSummary',
      'responsibilities',
      'projectImpact',
      'projectLinks'
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    return res.status(200).json({ success: true, message: "Project updated" });
  } catch (err) {
    console.error("Error updating project:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE Project route
router.post('/delete-project/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const projectId = req.params.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Soft delete from ProjectsWorked
    const project = await ProjectsWorked.findOneAndUpdate(
      { _id: projectId, user_id: userId },
      { is_del: true },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Remove reference from User collection
    await USER.findByIdAndUpdate(userId, {
      $pull: { projects_worked_on: projectId }
    });

    return res.status(200).json({ success: true, message: "Project deleted" });
  } catch (error) {
    console.error("Delete project error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


router.get('/search-skills', async (req, res) => {

  try {
    const query = req.query.query;
    if (!query) return res.json({ success: true, skills: [] });

    const results = await Skills.find({
      name: { $regex: new RegExp(query, 'i') },
    })
      .limit(10)
      .select('name'); // Include _id by default, so no need to explicitly include it

    res.json({ success: true, skills: results }); // Send full array of { _id, name }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/search-roles', async (req, res) => {

  try {
    const query = req.query.query;

    if (!query) return res.json({ success: true, roles: [] });

    const results = await Roles.find({
      name: { $regex: new RegExp(query, 'i') },
    })
      .limit(10)
      .select('name');

    res.json({ success: true, roles: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/save_user_skills', authenticateToken, async (req, res) => {
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(400).json({ success: false, message: "Invalid user." });
  }

  const skillObjects = req.body.skills;

  if (!Array.isArray(skillObjects)) {
    return res.status(400).json({ success: false, message: "Skills must be an array." });
  }

  // Extract valid ObjectIds from skill objects
  const skillIds = skillObjects.map(s => s._id);

  if (skillIds.length === 0) {
    return res.status(400).json({ success: false, message: "No valid skill IDs provided." });
  }

  try {
    // Optional: validate those IDs exist in DB
    const existingSkills = await Skills.find({ _id: { $in: skillIds } }).select('_id');
    const existingSkillIds = existingSkills.map(s => s._id.toString());

    // Filter valid skill IDs that exist in the DB
    const validSkillIds = skillIds.filter(id => existingSkillIds.includes(id));

    // Fetch the user's current skills
    const user = await USER.findById(userId);

    // Avoid adding duplicates by combining current skills with valid ones
    const updatedSkills = [...new Set([...user.skills, ...validSkillIds])];

    // Update the user's skills
    await USER.findByIdAndUpdate(
      userId,
      { skills: updatedSkills },
      { new: true }
    );

    res.json({ success: true, message: "Skills updated successfully." });
  } catch (err) {
    console.error("Error saving skills:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post('/remove_user_skill', authenticateToken, async (req, res) => {
  const userId = req.user?.user_id;


  if (!userId) {
    return res.status(400).json({ success: false, message: "Invalid user." });
  }

    const { skillId } = req.body; 

  if (!skillId) {
    return res.status(400).json({ success: false, message: "No skill ID provided." });
  }

  try {



    // Find the user and pull the specified skill ID from the skills array
    const user = await USER.findByIdAndUpdate(
      userId,
      { $pull: { skills: skillId } }, // Pull the skill ID from the array
      { new: true } // Return the updated user document
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.json({ success: true, message: "Skill removed successfully.", skills: user.skills });
  } catch (err) {
    console.error("Error removing skill:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/get_job_locations", async function (req, res) {

  const { countryCode } = req.body;

  JobLocations.find({ country_code : countryCode}).then(async (result)=>{

    if(result){

  res.status(200).send({ fetched: true, cities: result});
  res.end();

    }

    else{

      res.status(200).send({ fetched: false});
      res.end();

    }

  }).catch((err) =>{

  })

});


router.post('/save_job_preferences', authenticateToken, async (req, res) => {
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(400).json({ success: false, message: "Invalid user." });
  }

  const {
    jobType,
    companyType,
    mobileNumber,
    ctcFrom,
    ctcTo,
    currency,
  } = req.body.formData;

  const {
    selectedCities,
    selectedCountry
  } = req.body;

  try {
    const user = await USER.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Use only the new selectedCities, filtered for valid IDs
    const newCityIds = (selectedCities || []).filter(Boolean);

    // Prepare updated data
    const updateData = {
      pref_company_type: companyType || '',
      pref_job_type: jobType || '',
      mobile_number: mobileNumber || '',
      expected_ctcFrom: ctcFrom || null,
      expected_ctcTo: ctcTo || null,
      currency: currency || '',
      country: selectedCountry?.label || '',
      // REPLACE pref_job_locations with newCityIds (no merge)
      pref_job_locations: newCityIds,
    };

    // Save updated data
    await USER.findByIdAndUpdate(userId, updateData, { new: true });

    res.json({ success: true, message: "Job preferences updated successfully." });
  } catch (err) {
    console.error("Error saving job preferences:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



router.post("/update-password", async function (req, res) {

  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  
  USER.findOne({email : email}).then(async (result)=>{

    if(result){

      await USER.findByIdAndUpdate(result._id, { password: hashedPassword });
 
  res.status(200).send({ success: true});
  res.end();


    }

    else{

      res.status(200).send({ success: false});
      res.end();


    }

  }).catch((err) =>{

  })

});




router.get("/verify-login-token", authenticateToken, async (req, res) => {
  return res.status(200).json({ valid: true, user: req.user });
});


// router.get("/profile-completion", authenticateToken, async (req, res) => {
//   try {

//     const userId = req.user?.user_id;

//     if (!userId) {
//       return res.status(400).json({ success: false, message: "Invalid user." });
//     }

//     // Fetch user with populated fields
//     const user = await USER.findById(userId).populate(['skills', 'pref_job_locations']);

//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     let completion = 0;

//     // Part 1: Check current employment
//     const currentEmployment = await EmploymentDetails.findOne({
//       user_id: userId,
//       isCurrentEmployment: true,
//       is_del: false
//     });

//     if (currentEmployment) {
//       completion += 75;
//     }

//     // Part 2: At least one skill
//     if (user.skills && user.skills.length > 0) {
//       completion += 25;
//     }

//     // Part 3: Check required fields
//     const requiredFields = [
//       user.pref_company_type,
//       user.pref_job_type,
//       user.pref_job_locations && user.pref_job_locations.length > 0,
//       user.expected_ctcFrom,
//       user.expected_ctcTo,
//       user.mobile_number
//     ];

//     const allPresent = requiredFields.every(field => field !== undefined && field !== null && field !== '');
//     if (allPresent) {
//       completion += 25;
//     }

//     if (completion > 100) completion = 100;

//     // Profile views count
//     const profileViewsCount = user.profileViews?.length || 0;

//     const openForJobs = user.openForJobs;

//     // Invitations count (unique employer-professional pairs)
//     const totalInvitations = await CONVERSATION.countDocuments({ professional: userId });

//     return res.status(200).json({
//       success: true,
//       completionPercentage: completion,
//       profileViews: profileViewsCount,
//       totalInvitations: totalInvitations,
//       openForJobs : openForJobs
//     });

//   } catch (error) {
//     console.error('Error in /profile-completion route:', error);
//     return res.status(500).json({ success: false, message: 'Server Error', error });
//   }
// });



router.get("/profile-completion", authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Invalid user." });
    }

    // Fetch user with populated fields
    const user = await USER.findById(userId).populate(['skills', 'pref_job_locations']);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let completion = 0;

    // Part 1: Check current employment (50%)
    const currentEmployment = await EmploymentDetails.findOne({
      user_id: userId,
      isCurrentEmployment: true,
      is_del: false
    });

    if (currentEmployment) {
      completion += 50;
    }

    // Part 2: Skills check (25%)
    if (user.skills && user.skills.length > 0) {
      completion += 25;
    }

    // Part 3: Job preferences check (25%)
    const jobPrefFields = [
      user.pref_company_type,
      user.pref_job_type,
      user.pref_job_locations && user.pref_job_locations.length > 0,
      user.expected_ctcFrom,
      user.expected_ctcTo,
      user.mobile_number
    ];

    const jobPrefComplete = jobPrefFields.every(
      field => field !== undefined && field !== null && field !== ''
    );

    if (jobPrefComplete) {
      completion += 25;
    }

    // Final cap
    if (completion > 100) completion = 100;

    const profileViewsCount = user.profileViews?.length || 0;
    const openForJobs = user.openForJobs;
    const totalShortlists = await SHORTLIST.countDocuments({
  user_id: userId,
  short_listed: true,
  is_del: false,
});


    return res.status(200).json({
      success: true,
      completionPercentage: completion,
      profileViews: profileViewsCount,
      totalShortlists: totalShortlists,
      openForJobs: openForJobs
    });

  } catch (error) {
    console.error('Error in /profile-completion route:', error);
    return res.status(500).json({ success: false, message: 'Server Error', error });
  }
});



router.post('/toggle-open-for-jobs', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.user_id;
    const { openForJobs } = req.body;

    if (typeof openForJobs !== 'boolean') {
      return res.status(400).json({ success: false, message: "Invalid value for openForJobs." });
    }

    const user = await USER.findByIdAndUpdate(
      userId,
      { openForJobs },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      message: `Profile visibility set to ${openForJobs ? 'ON' : 'OFF'}.`
    });
  } catch (err) {
    console.error("Error updating openForJobs:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});




router.post("/logout", authenticateToken, (req, res) => {
  res.clearCookie("token_professional", {
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

   const result = await USER.findById(userId)
  .populate({
    path: 'employmentDetails',
    populate: [
      {
        path: 'jobRoleId',
        model: 'roles',
      },
      {
        path: 'workLocation',
        model: 'job_locations',
        select: 'city',
      },
    ],
  })
  .populate('skills');


    if (result) {

      return res.status(200).send({
        success: true,
        data: {
          email: result.email,
          applicantName: result.applicantName,
          workmail: result.work_email,
          account_id: result.account_id,
          country: result.country,
          mobile_number: result.mobile_number,
          employmentDetails: result.employmentDetails,
          skills: result.skills,
          workLocation: result.workLocation, // includes city here
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


router.get('/role/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const role = await Roles.findById(id);
    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    return res.json({ success: true, role });
  } catch (err) {
    console.error('Error fetching role by ID:', err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


router.post('/is-workmail-verified', async function (req, res) {

  const { user_id } = req.body;

  try {
    const result = await USER.findById(user_id);

    if (result && result.working_mail_verified) {
      return res.status(200).send({ verified: true });
    } else {
      return res.status(200).send({ verified: false });
    }

  } catch (error) {
    console.error("❌ Error fetching user details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/update_anonymous_name", authenticateToken, async function (req, res) {

    const userId = req.user?.user_id;

  if (!userId) {
    return res.status(400).json({ message: "Username is invalid." });
  }

  const { editApName } = req.body;

  try {

      await USER.findById(userId).then(async (result)=>{

    if(result){

      await USER.findByIdAndUpdate(userId, { applicantName: editApName });
 
  res.status(200).send({ success: true});
  res.end();


  }

  else {
      return res.status(200).send({ success: false, data: null });
    }
  });

}

  catch (error) {
    console.error("❌ Error fetching user details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }


});

router.get('/get-job-preferences', authenticateToken, async function (req, res) {
  
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(400).json({ message: "Username is invalid." });
  }

  try {
    const result = await USER.findById(userId).populate('pref_job_locations');

    if (result) {
      return res.status(200).send({
        success: true,
        data: {
          pref_company_type:result.pref_company_type,
          pref_job_type:result.pref_job_type,
          pref_job_locations:result.pref_job_locations,
          expected_ctcFrom:result.expected_ctcFrom,
          expected_ctcTo:result.expected_ctcTo,
          currency:result.currency,
          mobile_number:result.mobile_number,
          email:result.email
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


router.post('/get-invitations-for-professional', authenticateToken, async (req, res) => {
  const professionalId = req.user?.user_id;

  if (!professionalId) {
    return res.status(400).json({ message: 'Invalid user ID.' });
  }

  try {
    // Get all conversations for this professional
    const conversations = await CONVERSATION.find({ professional: professionalId })
      .populate('employer', 'firstName lastName company_name designation email')
      .lean();

    const invitations = await Promise.all(
      conversations.map(async (conv) => {
        // Fetch all messages in the conversation
        const messages = await MESSAGE.find({ conversation: conv._id })
          .sort({ sentAt: 1 }) // sort ascending to get last message later
          .lean();

        // Check if any employer message is unread by the professional
        const hasUnreadFromEmployer = messages.some((msg) => {
          return (
            msg.senderType === 'employer' &&
            !msg.readBy?.some((readEntry) =>
              readEntry.readerId?.toString() === professionalId.toString()
            )
          );
        });

        const lastMessage = messages[messages.length - 1]; // last one

        return {
          conversationId: conv._id,
          employer: conv.employer,
          lastMessage: lastMessage?.content || '',
          sentAt: lastMessage?.sentAt || null,
          isRead: !hasUnreadFromEmployer,
        };
      })
    );

    res.status(200).json({ invitations });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    res.status(500).json({ message: "Server error" });
  }
});




router.post('/get-conversation-by-id', authenticateToken, async (req, res) => {
  const { conversationId } = req.body;

  if (!conversationId) {
    return res.status(400).json({ message: "Missing conversationId" });
  }

  try {
    const messages = await MESSAGE.find({ conversation: conversationId })
      .sort({ sentAt: 1 })
      .lean();

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post('/send-message-by-professional', authenticateToken, async (req, res) => {
  const { conversationId, content } = req.body;
  const userId = req.user?.user_id;

  if (!conversationId || !content || !userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newMsg = new MESSAGE({
      conversation: conversationId,
      senderType: "professional",
      senderId: userId,
      content,
    });

    await newMsg.save();

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/mark-messages-read', authenticateToken, async (req, res) => {
  const { conversationId } = req.body;
  const userId = req.user?.user_id;

  if (!conversationId || !userId) {
    return res.status(400).json({ message: "Missing conversationId or user" });
  }

  try {
    await MESSAGE.updateMany(
      {
        conversation: conversationId,
        senderId: { $ne: userId },
        "readBy.readerId": { $ne: userId }
      },
      {
        $push: {
          readBy: {
            readerId: userId,
            readAt: new Date()
          }
        }
      }
    );

    return res.json({ message: "Marked messages as read." });
  } catch (error) {
    console.error("Error marking read:", error);
    return res.status(500).json({ message: "Failed to mark messages as read." });
  }
});



 const options = {
        to: 'techiebhaskar7@gmail.com',
        subject: "Verify Account - Newrole.in",
        text: 'Verification Pin: 6363636',
        userEmail: 'techiebhaskar7@gmail.com'
      };

  // sendMail(options);


const cities = [
   "Pune", "Noida", "Gurgaon", "Delhi", "Ahmedabad", "Kolkata",
  "Jaipur", "Indore", "Chandigarh", "Mohali", "Coimbatore",
  "Nagpur", "Bhubaneswar", "Thiruvananthapuram", "Kochi", "Visakhapatnam",
  "Mysuru", "Vadodara", "Surat", "Mangalore", "Lucknow",
  "Bhopal", "Ranchi", "Guwahati", "Madurai", "Vijayawada"
];


// const insertLocations = async () => {
//   const documents = cities.map(city => ({
//     country: "INDIA",
//     country_code: "IN",
//     city,
//   }));

//   try {
//     await JobLocations.insertMany(documents);
//     console.log("Cities inserted successfully");
//   } catch (err) {
//     console.error("Error inserting cities:", err);
//   }
// };

// insertLocations();



const roles = [
  // Development
  { name: "Intern Software Developer", department: "Development", color: "#4CAF50" },
  { name: "Junior Software Engineer", department: "Development", color: "#4CAF50" },
  { name: "Software Engineer", department: "Development", color: "#4CAF50" },
  { name: "Senior Software Engineer", department: "Development", color: "#4CAF50" },
  { name: "Lead Software Engineer", department: "Development", color: "#4CAF50" },
  { name: "Principal Software Engineer", department: "Development", color: "#4CAF50" },
  { name: "Backend Developer", department: "Development", color: "#4CAF50" },
  { name: "Frontend Developer", department: "Development", color: "#4CAF50" },
  { name: "Full Stack Developer", department: "Development", color: "#4CAF50" },
  { name: "Mobile App Developer", department: "Development", color: "#4CAF50" },
  { name: "iOS Developer", department: "Development", color: "#4CAF50" },
  { name: "Android Developer", department: "Development", color: "#4CAF50" },
  { name: "React Native Developer", department: "Development", color: "#4CAF50" },
  { name: "Web Developer", department: "Development", color: "#4CAF50" },
  { name: "API Developer", department: "Development", color: "#4CAF50" },
  { name: "Game Developer", department: "Development", color: "#4CAF50" },

  // DevOps / Cloud
  { name: "DevOps Engineer", department: "DevOps & Cloud", color: "#03A9F4" },
  { name: "Senior DevOps Engineer", department: "DevOps & Cloud", color: "#03A9F4" },
  { name: "Cloud Engineer", department: "DevOps & Cloud", color: "#03A9F4" },
  { name: "AWS Engineer", department: "DevOps & Cloud", color: "#03A9F4" },
  { name: "Azure Engineer", department: "DevOps & Cloud", color: "#03A9F4" },
  { name: "GCP Engineer", department: "DevOps & Cloud", color: "#03A9F4" },
  { name: "Site Reliability Engineer", department: "DevOps & Cloud", color: "#03A9F4" },
  { name: "Infrastructure Engineer", department: "DevOps & Cloud", color: "#03A9F4" },
  { name: "Kubernetes Administrator", department: "DevOps & Cloud", color: "#03A9F4" },

  // QA & Testing
  { name: "QA Engineer", department: "Quality Assurance", color: "#FF9800" },
  { name: "Senior QA Engineer", department: "Quality Assurance", color: "#FF9800" },
  { name: "Test Automation Engineer", department: "Quality Assurance", color: "#FF9800" },
  { name: "Manual Tester", department: "Quality Assurance", color: "#FF9800" },
  { name: "Performance Tester", department: "Quality Assurance", color: "#FF9800" },
  { name: "Security Tester", department: "Quality Assurance", color: "#FF9800" },
  { name: "QA Lead", department: "Quality Assurance", color: "#FF9800" },

  // Data
  { name: "Data Analyst", department: "Data & Analytics", color: "#673AB7" },
  { name: "Data Scientist", department: "Data & Analytics", color: "#673AB7" },
  { name: "Senior Data Scientist", department: "Data & Analytics", color: "#673AB7" },
  { name: "Data Engineer", department: "Data & Analytics", color: "#673AB7" },
  { name: "Big Data Engineer", department: "Data & Analytics", color: "#673AB7" },
  { name: "Data Architect", department: "Data & Analytics", color: "#673AB7" },
  { name: "BI Analyst", department: "Data & Analytics", color: "#673AB7" },

  // AI / ML
  { name: "Machine Learning Engineer", department: "AI/ML", color: "#E91E63" },
  { name: "Senior Machine Learning Engineer", department: "AI/ML", color: "#E91E63" },
  { name: "Deep Learning Engineer", department: "AI/ML", color: "#E91E63" },
  { name: "AI Engineer", department: "AI/ML", color: "#E91E63" },
  { name: "Prompt Engineer", department: "AI/ML", color: "#E91E63" },
  { name: "MLOps Engineer", department: "AI/ML", color: "#E91E63" },
  { name: "NLP Engineer", department: "AI/ML", color: "#E91E63" },

  // Security
  { name: "Security Analyst", department: "Cybersecurity", color: "#F44336" },
  { name: "Cybersecurity Engineer", department: "Cybersecurity", color: "#F44336" },
  { name: "Ethical Hacker", department: "Cybersecurity", color: "#F44336" },
  { name: "SOC Analyst", department: "Cybersecurity", color: "#F44336" },
  { name: "Security Architect", department: "Cybersecurity", color: "#F44336" },

  // UI/UX
  { name: "UI Designer", department: "UI/UX", color: "#9C27B0" },
  { name: "UX Designer", department: "UI/UX", color: "#9C27B0" },
  { name: "UX Researcher", department: "UI/UX", color: "#9C27B0" },
  { name: "Product Designer", department: "UI/UX", color: "#9C27B0" },

  // Product & Project Management
  { name: "Product Manager", department: "Product & Project", color: "#795548" },
  { name: "Technical Product Manager", department: "Product & Project", color: "#795548" },
  { name: "Scrum Master", department: "Product & Project", color: "#795548" },
  { name: "Technical Project Manager", department: "Product & Project", color: "#795548" },

  // Support & Infra
  { name: "Technical Support Engineer", department: "IT Support", color: "#607D8B" },
  { name: "IT Support Specialist", department: "IT Support", color: "#607D8B" },
  { name: "Application Support Engineer", department: "IT Support", color: "#607D8B" },
  { name: "ERP Consultant", department: "IT Support", color: "#607D8B" },
  { name: "Salesforce Consultant", department: "IT Support", color: "#607D8B" },

  // Leadership
  { name: "Engineering Manager", department: "Leadership", color: "#3F51B5" },
  { name: "Technical Architect", department: "Leadership", color: "#3F51B5" },
  { name: "Solutions Architect", department: "Leadership", color: "#3F51B5" },
  { name: "CTO", department: "Leadership", color: "#3F51B5" }
];

const skills = [
  { name: "React", color: "#61DBFB" },
  { name: "React JS", color: "#61DAFB" },
  { name: "React Native", color: "#3B5998" },
  { name: "JavaScript", color: "#F7DF1E" },
  { name: "TypeScript", color: "#007ACC" },
  { name: "Next.js", color: "#000000" },
  { name: "Vue.js", color: "#42b883" },
  { name: "Angular", color: "#dd1b16" },
  { name: "Node.js", color: "#68A063" },
  { name: "Express.js", color: "#303030" },
  { name: "MongoDB", color: "#47A248" },
  { name: "MySQL", color: "#00758F" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "Python", color: "#306998" },
  { name: "Django", color: "#092E20" },
  { name: "Flask", color: "#000000" },
  { name: "Java", color: "#b07219" },
  { name: "Spring Boot", color: "#6DB33F" },
  { name: "Kotlin", color: "#A97BFF" },
  { name: "Swift", color: "#FA7343" },
  { name: "Objective-C", color: "#438EFF" },
  { name: "C#", color: "#68217A" },
  { name: ".NET", color: "#512BD4" },
  { name: "PHP", color: "#777BB4" },
  { name: "Laravel", color: "#FF2D20" },
  { name: "REST APIs", color: "#E34F26" },
  { name: "GraphQL", color: "#E10098" },
  { name: "Docker", color: "#2496ED" },
  { name: "Kubernetes", color: "#326CE5" },
  { name: "AWS", color: "#FF9900" },
  { name: "Azure", color: "#0078D4" },
  { name: "Google Cloud", color: "#4285F4" },
  { name: "Jenkins", color: "#D24939" },
  { name: "Git", color: "#F05032" },
  { name: "GitHub", color: "#181717" },
  { name: "Bitbucket", color: "#205081" },
  { name: "HTML", color: "#E34F26" },
  { name: "CSS", color: "#1572B6" },
  { name: "SASS", color: "#CC6699" },
  { name: "Tailwind CSS", color: "#06B6D4" },
  { name: "Redux", color: "#764ABC" },
  { name: "Zustand", color: "#000000" },
  { name: "React Query", color: "#FF4154" },
  { name: "Jira", color: "#0052CC" },
  { name: "Firebase", color: "#FFCA28" },
  { name: "CI/CD", color: "#1E1E1E" },
  { name: "Agile", color: "#0275d8" },
  { name: "Scrum", color: "#17A2B8" },
  { name: "Postman", color: "#FF6C37" },
  { name: "Testing Library", color: "#E33332" },
  { name: "Cypress", color: "#17202C" },
  { name: "Jest", color: "#99425B" },
  { name: "Mocha", color: "#8D6748" },
  { name: "Puppeteer", color: "#3B8070" }
];


async function insertRoles() {
  try {

    await Skills.insertMany(skills);
    console.log("✅ Roles inserted successfully.");

  } catch (error) {
    console.error("❌ Error inserting roles:", error);
  }
}

// insertRoles();


export default router;
