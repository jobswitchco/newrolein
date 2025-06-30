import express from "express";
import cookieParser from "cookie-parser";
const router = express.Router();
import bcrypt from "bcryptjs";
import Employer from "../models/Employer.js";
import USER from "../models/User.js";
import SHORTLIST from "../models/Shortlists.js";
import CONVERSATION from "../models/Conversation.js";
import MESSAGE from "../models/Messages.js";
import PaidSubscriptions from '../models/PaidSubscriptions.js';
import sendMail from "../utils/sendMail.js";
import sendInvitationMail from "../utils/sendMailInvitationEmployer.js";
import sendMailForMessages from "../utils/sendMailForMessages.js";

router.use(cookieParser());
import authenticateToken from "../middleware/authenticateTokenEmployer.js";
import generateJWTtoken  from "../middleware/generateJWTtoken.js";
import mongoose from 'mongoose';



const generatePin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post("/check-email-exists-sendMail", async function (req, res) {

  const { email } = req.body;
  const pin = generatePin();

  
  USER.findOne({ email : email, is_del: false}).then( async (result)=>{

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
      subject: "Account Delete Code - CreatorConsole",
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
    const user = await Employer.findById(userId).select("+password");

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
    await Employer.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.post("/employer-login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        error: "All fields are mandatory",
        data: null,
        message: "Please provide all fields",
      });
    }

    const user = await Employer.findOne({ email }).select("+hashPassword");

    if (!user) {
      return res.status(400).send({
        error: "User does not exist!",
        data: null,
        message: "User does not exist!",
      });
    }

    const token = await generateJWTtoken(user._id, user.email);

    bcrypt.compare(password, user.password, async function (err1, result) {
      if (result === true) {
        const now = new Date();

        // Update last_login and push to loginHistory
        await Employer.updateOne(
          { _id: user._id },
          {
            $set: { last_login: now },
            $push: { loginHistory: now }
          }
        );

        res.cookie("token_employer", token, {
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
        });

        return res.status(200).json({
          success: true,
          user: {
            user_id: user._id,
            user_email: user.email,
          },
          token,
        });
      } else {
        return res.status(400).send({
          error: "email, password mismatch",
          data: null,
          message: "Wrong Email or Password",
        });
      }
    });
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error",
      data: null,
      message: "An error occurred",
    });
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
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(400).json({ message: "Username is invalid." });
  }

  const { pin } = req.body;
  const pinAsInt = parseInt(pin);

  try {
    const user = await USER.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.account_delete_code === pinAsInt) {
      await USER.findByIdAndUpdate(userId, { is_del: true });
      return res.status(200).json({
        matching: true,
        deleted: true,
        message: "Account marked as deleted.",
      });
    } else {
      return res.status(200).json({
        matching: false,
        deleted: false,
        message: "Incorrect PIN.",
      });
    }
  } catch (err) {
    console.error("Error while verifying delete code:", err);
    return res.status(500).json({
      message: "Server error. Please try again later.",
    });
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


router.post("/logout", authenticateToken, (req, res) => {
  res.clearCookie("token_employer", {
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


router.post('/get-employer-details', authenticateToken, async function (req, res) {
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(400).json({ message: "Username is invalid." });
  }

  try {
    const result = await Employer.findById(userId);

    if (result) {
      return res.status(200).send({
        success: true,
        data: {
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          designation : result.designation,
          company_name : result.company_name,
          company_type : result.company_type,
          company_category : result.company_category,
          country : result.country,
          city : result.city,
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


router.post('/get-all-professional-details', authenticateToken, async (req, res) => {
  const employer = req.user?.user_id;
  if (!employer) return res.status(400).json({ message: "Username is invalid." });

  let { page = 1, limit = 10, filters = {} } = req.body;

  try {
    page = parseInt(page);
    limit = parseInt(limit);

    // Step 1: Fetch all active user IDs
    const allUserIds = await USER.find({ is_del: false, openForJobs : true }).select('_id');
    const userIdList = allUserIds.map(u => u._id);

    // Step 2: Find user_ids that are ALREADY shortlisted by this employer
    const shortlistedDocs = await SHORTLIST.find({
      employer,
      short_listed: true,
      is_del: false
    }).select('user_id');

    const shortlistedUserIds = shortlistedDocs.map(doc => String(doc.user_id));

    // Step 3: Exclude already shortlisted user_ids
    const nonShortlistedUserIds = userIdList.filter(id => !shortlistedUserIds.includes(String(id)));

    if (nonShortlistedUserIds.length === 0) {
      return res.status(200).json({ users: [], totalPages: 0 });
    }

    // Step 4: Build pipeline for aggregation
    const matchStage = {
      _id: { $in: nonShortlistedUserIds.map(id => new mongoose.Types.ObjectId(id)) },
      is_del: false
    };

    if (filters.roleId) {
      matchStage['employmentDetails.jobRoleId'] = new mongoose.Types.ObjectId(filters.roleId);
    }
    if (filters.noticePeriod) {
      matchStage['employmentDetails.noticePeriod'] = filters.noticePeriod;
    }
    if (filters.ctcFrom || filters.ctcTo) {
      matchStage['employmentDetails.ctc'] = {};
      if (filters.ctcFrom) matchStage['employmentDetails.ctc'].$gte = parseInt(filters.ctcFrom);
      if (filters.ctcTo) matchStage['employmentDetails.ctc'].$lte = parseInt(filters.ctcTo);
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'employment_details',
          localField: 'employmentDetails',
          foreignField: '_id',
          as: 'employmentDetails'
        }
      },
      { $unwind: '$employmentDetails' },
      { $match: { 'employmentDetails.isCurrentEmployment': true } },
      {
        $lookup: {
          from: 'roles',
          localField: 'employmentDetails.jobRoleId',
          foreignField: '_id',
          as: 'employmentDetails.jobRole'
        }
      },
      {
        $unwind: {
          path: '$employmentDetails.jobRole',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$_id',
          userData: { $first: '$$ROOT' },
          employmentDetails: { $push: '$employmentDetails' },
          totalExperienceMonths: { $sum: '$employmentDetails.totalExpInMonths' }
        }
      },
      ...(filters.experience
        ? [{ $match: { totalExperienceMonths: { $gte: parseInt(filters.experience) * 12 } } }]
        : []),
      {
        $addFields: {
          'userData.employmentDetails': '$employmentDetails'
        }
      },
      {
        $replaceRoot: { newRoot: '$userData' }
      },
      { $sort: { created_at: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ];

    const users = await USER.aggregate(pipeline);

    // Step 5: Count pipeline
    const countPipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'employment_details',
          localField: 'employmentDetails',
          foreignField: '_id',
          as: 'employmentDetails'
        }
      },
      { $unwind: '$employmentDetails' },
      { $match: { 'employmentDetails.isCurrentEmployment': true } },
      {
        $group: {
          _id: '$_id',
          totalExperienceMonths: { $sum: '$employmentDetails.totalExpInMonths' }
        }
      },
      ...(filters.experience
        ? [{ $match: { totalExperienceMonths: { $gte: parseInt(filters.experience) * 12 } } }]
        : []),
      { $count: 'total' }
    ];

    const countResult = await USER.aggregate(countPipeline);
    const totalUsers = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({ users, totalPages });

  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.post('/get-professional-details', authenticateToken, async (req, res) => {


  const employerId = req.user?.user_id;
  if (!employerId) return res.status(400).json({ message: "Username is invalid." });

  const { userId } = req.body;

  try {
    const user = await USER.findById(userId)
      .populate({
        path: 'employmentDetails',
        populate: [{ path: 'jobRoleId', model: 'roles' }, {
        path: 'workLocation',
        model: 'job_locations',
        select: 'city',
      }]
      })
      .populate({ path: 'skills', model: 'skills' })
      .populate({ path: 'pref_job_locations', model: 'job_locations' })
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const shortlistEntry = await SHORTLIST.findOne({
      employer: employerId,
      user_id: userId,
      is_del: false
    });

    const isShortlisted = !!(shortlistEntry?.short_listed);

    const isInvited = !!(shortlistEntry?.invited);

    const basicDetails = {
      name: user.applicantName,
      email: user.email,
      phone: user.phone,
      city: user.city,
      country: user.country,
    };

    const jobPreferences = {
      pref_company_type: user.pref_company_type,
      pref_job_locations: user.pref_job_locations || [],
      pref_job_type: user.pref_job_type,
      expected_ctcFrom: user.expected_ctcFrom,
      expected_ctcTo: user.expected_ctcTo,
    };

    const employmentDetails = (user.employmentDetails || []).map(emp => ({
      _id: emp._id,
      companyName: emp.companyName,
      hideCompanyName: emp.hideCurrentCompany,
      jobRole: emp.jobRoleId || null,
      ctc: emp.ctc,
      currency: emp.currency,
      employmentType: emp.employmentType,
      noticePeriod: emp.noticePeriod,
      fromMonth: emp.fromMonth,
      fromYear: emp.fromYear,
      toMonth: emp.toMonth,
      toYear: emp.toYear,
      isCurrentEmployment: emp.isCurrentEmployment,
      totalExpInMonths: emp.totalExpInMonths,
      projects: emp.projects || [],
      workLocation: emp.workLocation,

    }));

    const skills = (user.skills || []).map(skill => ({
      _id: skill._id,
      name: skill.name,
      color: skill.color
    }));

    return res.status(200).json({
      basicDetails,
      employmentDetails,
      jobPreferences,
      skills,
      isShortlisted,
      isInvited
    });
  } catch (error) {
    console.error('❌ Error in /get-professional-details:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post('/track-profile-view', authenticateToken, async (req, res) => {
  const employerId = req.user?.user_id;
  const { userId } = req.body;
  if (!employerId || !userId) return res.sendStatus(400);

  try {
    await USER.findByIdAndUpdate(userId, {
      $push: {
        profileViews: {
          employerId,
          viewedAt: new Date()
        }
      }
    });
    return res.sendStatus(200);
  } catch (err) {
    console.error("Track view error:", err);
    return res.sendStatus(500);
  }
});


router.post('/update-view-duration', authenticateToken, async (req, res) => {
  const employerId = req.user?.user_id;
  const { userId, durations, totalDuration } = req.body;

  if (!employerId || !userId || !durations) return res.sendStatus(400);

  try {
    await USER.findByIdAndUpdate(userId, {
      $push: {
        tabViewDurations: {
          employerId,
          viewedAt: new Date(),
          durations,
          totalDuration
        }
      }
    });
    return res.sendStatus(200);
  } catch (err) {
    console.error("Tab duration update error:", err);
    return res.sendStatus(500);
  }
});




router.post('/shortlist-a-candidate', authenticateToken, async (req, res) => {
  const employerId = req.user?.user_id;
  const { userId } = req.body;

  if (!employerId || !userId ) {
    return res.status(400).json({ message: "Invalid data provided." });
  }

  try {
    const existing = await SHORTLIST.findOne({ employer: employerId, user_id: userId });

    if (existing) {
      existing.short_listed = true;
      existing.updated_at = new Date();
      await existing.save();
    } else {
      await SHORTLIST.create({
        employer: employerId,
        user_id: userId,
        short_listed : true,
        created_at: new Date(),
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error in /shortlist-a-candidate:', err);
    res.status(500).json({ message: "Server error." });
  }
});


router.post('/get-all-shortlisted-candidates', authenticateToken, async (req, res) => {
  const employerId = req.user?.user_id;
  if (!employerId) return res.status(400).json({ message: "Invalid employer." });

  let { page = 1, limit = 10, startDate, endDate } = req.body;
  page = parseInt(page);
  limit = parseInt(limit);

  try {
    const shortlistQuery = {
      employer: employerId,
      short_listed: true,
      is_del: false
    };

 

      if (startDate && endDate) {
      shortlistQuery.updated_at = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const shortlisted = await SHORTLIST.find(shortlistQuery)
      .select('user_id updated_at invited');

    const userMetaMap = new Map();
    const userIds = [];

    shortlisted.forEach(doc => {
      userMetaMap.set(doc.user_id.toString(), {
        ShortListed_date: doc.updated_at,
        status: doc.invited
      });
      userIds.push(doc.user_id);
    });

    if (userIds.length === 0) {
      return res.status(200).json({ users: [], totalPages: 0 });
    }

    const users = await USER.find({ _id: { $in: userIds }, is_del: false })
      .populate({
        path: 'employmentDetails',
        match: { isCurrentEmployment: true },
        populate: {
          path: 'jobRoleId',
          model: 'roles'
        }
      });

    const formatExperience = (months) => {
      const years = Math.floor(months / 12);
      const monthsLeft = months % 12;
      return [
        years ? `${years} Year${years > 1 ? 's' : ''}` : '',
        monthsLeft ? `${monthsLeft} Month${monthsLeft > 1 ? 's' : ''}` : ''
      ].filter(Boolean).join(' ') || '0 Months';
    };

    const filteredUsers = users.map(user => {
      const meta = userMetaMap.get(user._id.toString()) || {};
      const employment = user.employmentDetails?.[0];

      return {
        user_id: user._id,
        name: user.applicantName,
        Designation: employment?.jobRoleId?.name || 'N/A',
        Experience: formatExperience(employment?.totalExpInMonths || 0),
        CTC: employment?.ctc || 'N/A',
        ShortListed_date: meta.ShortListed_date,
        status: meta.status
      };
    });

    const totalUsers = filteredUsers.length;
    const totalPages = Math.ceil(totalUsers / limit);
    const paginated = filteredUsers.slice((page - 1) * limit, page * limit);

    return res.status(200).json({ users: paginated, totalPages });

  } catch (error) {
    console.error("❌ Error fetching shortlisted candidates:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});





router.post('/get-all-invited-candidates', authenticateToken, async (req, res) => {
  const employerId = req.user?.user_id;
  if (!employerId) return res.status(400).json({ message: "Invalid employer." });

  let { page = 1, limit = 10, startDate, endDate } = req.body;
  page = parseInt(page);
  limit = parseInt(limit);

  try {
    const shortlistQuery = {
      employer: employerId,
      short_listed: true,
      invited: true,
      is_del: false,
    };

    if (startDate && endDate) {
      shortlistQuery.updated_at = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const invited = await SHORTLIST.find(shortlistQuery).select('user_id updated_at invited');
    const userMetaMap = new Map();
    const userIds = [];

    invited.forEach(doc => {
      userMetaMap.set(doc.user_id.toString(), {
        ShortListed_date: doc.updated_at,
        status: doc.invited,
      });
      userIds.push(doc.user_id);
    });

    if (userIds.length === 0) {
      return res.status(200).json({ users: [], totalPages: 0 });
    }

    const users = await USER.find({ _id: { $in: userIds }, is_del: false }).populate({
      path: 'employmentDetails',
      match: { isCurrentEmployment: true },
      populate: {
        path: 'jobRoleId',
        model: 'roles',
      },
    });

    const formatExperience = (months) => {
      const years = Math.floor(months / 12);
      const monthsLeft = months % 12;
      return [
        years ? `${years} Year${years > 1 ? 's' : ''}` : '',
        monthsLeft ? `${monthsLeft} Month${monthsLeft > 1 ? 's' : ''}` : ''
      ].filter(Boolean).join(' ') || '0 Months';
    };

    const conversations = await CONVERSATION.find({
      employer: employerId,
      professional: { $in: userIds },
    });

    const convMap = new Map();
    conversations.forEach(conv => {
      convMap.set(conv.professional.toString(), conv._id);
    });

    // 🟨 Check isRead for each conversation
    const isReadMap = new Map();

    for (const [userId, convId] of convMap.entries()) {
      const unreadExists = await MESSAGE.exists({
        conversation: convId,
        senderType: 'professional', // Only messages from professionals
        'readBy.readerId': { $ne: employerId },
      });
      isReadMap.set(userId, !unreadExists);
    }

    const filteredUsers = users.map(user => {
      const meta = userMetaMap.get(user._id.toString()) || {};
      const employment = user.employmentDetails?.[0];
      const totalExpInMonths = employment?.totalExpInMonths || 0;

      return {
        user_id: user._id,
        name: user.applicantName,
        Designation: employment?.jobRoleId?.name || 'N/A',
        Experience: formatExperience(totalExpInMonths),
        CTC: employment?.ctc || 'N/A',
        ShortListed_date: meta.ShortListed_date,
        status: meta.status,
        conversation_id: convMap.get(user._id.toString()) || null,
        isRead: isReadMap.get(user._id.toString()) ?? true,
      };
    });

    const totalUsers = filteredUsers.length;
    const totalPages = Math.ceil(totalUsers / limit);
    const paginated = filteredUsers.slice((page - 1) * limit, page * limit);

    return res.status(200).json({ users: paginated, totalPages });

  } catch (error) {
    console.error("❌ Error fetching invited candidates:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});




// Employer marks professional's messages as read
router.post('/mark-messages-read-by-employer', authenticateToken, async (req, res) => {
  const { conversationId } = req.body;
  const employerId = req.user?.user_id;

  if (!conversationId || !employerId) {
    return res.status(400).json({ message: "Missing conversationId or employer ID" });
  }

  try {
    await MESSAGE.updateMany(
      {
        conversation: conversationId,
        senderId: { $ne: employerId },
        "readBy.readerId": { $ne: employerId }
      },
      {
        $push: {
          readBy: {
            readerId: employerId,
            readAt: new Date()
          }
        }
      }
    );

    return res.json({ message: "Marked messages as read by employer." });
  } catch (error) {
    console.error("Error marking messages as read by employer:", error);
    return res.status(500).json({ message: "Failed to mark messages as read by employer." });
  }
});




router.post('/get-professional-names', authenticateToken, async (req, res) => {

    const employerId = req.user?.user_id;
  if (!employerId) return res.status(400).json({ message: "Invalid employer." });

  const { userIds } = req.body;

  try {
    const users = await USER.find({ _id: { $in: userIds } }, { _id: 1, applicantName: 1 });
    res.json({ users });
  } catch (err) {
    console.error("Error fetching user names", err);
    res.status(500).json({ error: "Failed to fetch names" });
  }
});

router.post('/get-conversation-with-user', authenticateToken, async (req, res) => {
  const employerId = req.user?.user_id;
  const { userId: professionalId } = req.body;

  if (!employerId || !professionalId) {
    return res.status(400).json({ message: "Invalid request." });
  }

  try {
    const conversation = await CONVERSATION.findOne({
      employer: employerId,
      professional: professionalId
    });

    if (!conversation) {
      return res.status(200).json({ messages: [] });
    }

    const messages = await MESSAGE.find({ conversation: conversation._id })
      .sort({ sentAt: 1 })
      .select('senderType content sentAt')
      .lean();

    return res.status(200).json({ messages });

  } catch (error) {
    console.error("Error fetching conversation:", error);
    return res.status(500).json({ message: "Server error." });
  }
});


router.post('/send-message-to-user', authenticateToken, async (req, res) => {
  const employerId = req.user?.user_id;
  const { conversationId, content } = req.body;

  if (!employerId || !conversationId || !content) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Fetch conversation using conversationId
    const conversation = await CONVERSATION.findById(conversationId).select('professional');
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    const professionalId = conversation.professional;

    // Create message
    const message = new MESSAGE({
      conversation: conversation._id,
      senderType: 'employer',
      senderId: employerId,
      content
    });

    // Fetch user email
    const user = await USER.findById(professionalId).select('email');
    if (!user || !user.email) {
      console.warn('User not found or email missing for ID:', professionalId);
    } else {
      const previewContent = content.length > 100 ? content.slice(0, 100) + '...' : content;

      const options = {
        to: user.email.toLowerCase(),
        subject: "New Message from Employer on Newrole.in",
        text: previewContent
      };

      await sendMailForMessages(options);
    }

    await message.save();

    res.status(200).json({ message: "Message sent." });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error." });
  }
});





router.post('/delist-candidates', authenticateToken, async (req, res) => {
  const employerId = req.user?.user_id;
  const { selectedIds } = req.body;

  if (!employerId || !Array.isArray(selectedIds) || selectedIds.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid request data' });
  }

  try {
    await SHORTLIST.updateMany(
      {
        employer: employerId,
        user_id: { $in: selectedIds },
      },
      {
        $set: { short_listed: false },
      }
    );

    return res.status(200).json({ success: true, message: 'Candidates delisted successfully' });
  } catch (error) {
    console.error('Error in delisting candidates:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});



router.post('/send-interview-invitation', authenticateToken, async (req, res) => {
  try {
    const employer = req.user?.user_id;
    const { userIds, message } = req.body;

    if (!employer || !userIds || !Array.isArray(userIds) || userIds.length === 0 || !message) {
      return res.status(400).json({ message: 'Missing employer, message or userIds.' });
    }

    for (const userId of userIds) {
      let conversation = await CONVERSATION.findOne({ employer, professional: userId });

      if (!conversation) {
        conversation = await CONVERSATION.create({ employer, professional: userId });
      }

      await MESSAGE.create({
        conversation: conversation._id,
        senderType: 'employer',
        senderId: employer,
        content: message
      });

      // Mark as invited in shortlist
      await SHORTLIST.updateOne(
        { employer, user_id: userId },
        { $set: { invited: true } }
      );

      // ✅ Fetch professional's email from USER collection
      const user = await USER.findById(userId).select('email');
      if (user && user.email) {
        const options = {
          to: user.email,
          subject: "You've Received a Job Invitation on Newrole.in",
        };

        await sendInvitationMail(options);
      } else {
        console.warn(`Email not found for userId: ${userId}`);
      }
    }

    res.status(201).json({
      message: 'Invitations sent successfully.',
      sent: true
    });

  } catch (error) {
    console.error('Error sending invitations:', error);
    res.status(500).json({ message: 'Internal server error.', sent: false });
  }
});


  //  const options = {
  //         to: 'techiebhaskar7@gmail.com',
  //         subject: "You've Received a Job Invitation on Newrole.in",
  //       };

  //       await sendInvitationMail(options);


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



router.get('/get-subscription-details', authenticateToken, async (req, res) => {
  try {
    const employerId = req.user?.user_id;

    if (!employerId) {
      return res.status(400).json({ success: false, message: 'Invalid employer ID.' });
    }

    // Fetch active subscription for the employer
    const activeSub = await PaidSubscriptions.findOne({
      employer: employerId,
      is_del: false
    }).populate({
      path: 'plan_id',
      model: 'plan_details'
    });

    if (!activeSub || !activeSub.plan_id) {
      return res.status(200).json({ success: true, subscription: null });
    }

    const plan = activeSub.plan_id;

    // Extract plan-specific features
    const planName = plan.name;
    const isPro = planName === 'Pro Agency';
    const isGrowth = planName === 'Growth';
    const isStarter = planName === 'Starter';

    const subscriptionDetails = {
      plan_name: planName,
      invitations_per_month: plan.invitations_per_month || 0,
      unlimited_profiles: true,
      unlimited_shortlists: true,
      messaging: isPro ? 'Advanced chat messaging' : '2-way chat messaging',
      filters: 'Advanced filters & search',
      support: isPro
        ? 'Dedicated account manager'
        : isGrowth
        ? 'Priority Email Support'
        : 'Email Support',
      ai_features: isPro ? 'AI match scoring (Beta)' : 'Not available',
      monthly_plan: activeSub.monthly_plan,
      price: activeSub.monthly_plan ? plan.price_month_monthly : plan.price_month_yearly,
      plan_starts_at: activeSub.plan_starts_at,
      plan_ends_at: activeSub.plan_ends_at
    };

    return res.status(200).json({ success: true, subscription: subscriptionDetails });

  } catch (error) {
    console.error('Error fetching subscription details:', error);
    return res.status(500).json({ success: false, message: 'Server error', error });
  }
});



// async function insertSubscription() {
//   try {

//     const monthly_plan = true;

//     const today = new Date();
//     const expiryDate = new Date(today);
//     expiryDate.setDate(today.getDate() + (monthly_plan ? 30 : 365));

//     const subscription = new PaidSubscriptions({
//       plan_id: '6858bab000fb05ad1b03ac4d',
//       employer: '6849b0120cce321155f93fb9',
//       monthly_plan: monthly_plan,
//       plan_ends_at: expiryDate,
//       updated_at: today
//     });

//     const saved = await subscription.save();
//     console.log('✅ Subscription record inserted:\n', saved);

//     await mongoose.disconnect();
//   } catch (err) {
//     console.error('❌ Error inserting subscription:', err);
//   }
// }

// insertSubscription();



// const planData = [
//   {
//     name: 'Starter',
//     invitations_per_month: 5,
//     price_month_monthly: 2970,
//     price_month_yearly: 2350,
//   },
//   {
//     name: 'Growth',
//     invitations_per_month: 50,
//     price_month_monthly: 14850,
//     price_month_yearly: 11880,
//   },
//   {
//     name: 'Pro Agency',
//     invitations_per_month: 200,
//     price_month_monthly: 49500,
//     price_month_yearly: 40600,
//   }
 
// ];



// async function insertPlans() {
//   try {
//     const insertedPlans = await PlanDetails.insertMany(planData);
//     console.log('Plans inserted:', insertedPlans);

//     await mongoose.disconnect();
//   } catch (error) {
//     console.error('Error inserting plans:', error);
//   }
// }


// insertPlans();



















export default router;
