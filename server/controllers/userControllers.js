import User from "../models/User.js";

const fail = (res, status, message) =>
  res.status(status).json({ success: false, message });

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

// createUser-----------------------------------------------------------------
export const createUser = async (req, res) => {
  try {
    const user = await new User(req.body).save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue || {})[0] || "email";
      return fail(res, 409, `An account with this ${field} already exists`);
    }
    fail(res, 400, `Failed to create user: ${err.message}`);
  }
};

// login: the password is checked on the server, never in the browser----------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return fail(res, 400, "Email and password are required");
    }
    const user = await User.findOne({ email: normalizeEmail(email) });
    if (!user || !(await user.checkPassword(password))) {
      return fail(res, 401, "Email or password doesn't match");
    }
    res.status(200).json({ success: true, message: "Login successful", data: user });
  } catch (err) {
    fail(res, 500, err.message);
  }
};

// getSingleUser----------------------------------------------------------------
const sendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return fail(res, 404, "User not found");
    res.status(200).json({
      success: true,
      message: "get request process successfully",
      data: user,
    });
  } catch (err) {
    fail(res, 400, err.message);
  }
};

export const getSingleUserCurrentPoints = sendUser;
export const getPreviousPoints = sendUser;
export const getTotalPoints = sendUser;

// points updates----------------------------------------------------------------
const updatePoints = (field, bodyKey) => async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { [field]: req.body[bodyKey] },
      { new: true }
    );
    if (!user) return fail(res, 404, "User not found");
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    fail(res, 400, err.message);
  }
};

export const updateCurrentPoints = updatePoints("currentPoints", "currentPoints");
export const updatePrePoints = updatePoints("previousPoint", "prevPoint");
export const updateTotalPoints = updatePoints("totalPoints", "gkTotalPoints");

// put updateEditedUserData: the password only changes when a new one is sent---
export const updateUserData = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return fail(res, 404, "User not found");
    const { userImage, username, email, password, ph } = req.body;
    if (userImage) user.profileImage = userImage;
    if (username) user.username = username;
    if (email) user.email = email;
    if (ph) user.ph = ph;
    if (password) user.password = password; // hashed by the pre-save hook
    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    if (err.code === 11000) {
      return fail(res, 409, "That username or email is already taken");
    }
    fail(res, 400, `Failed to update user: ${err.message}`);
  }
};

// password reset: email + registered phone number must match------------------
const findForReset = async (email, ph) => {
  if (!email || !ph) return null;
  const user = await User.findOne({ email: normalizeEmail(email) });
  if (!user || String(user.ph) !== String(ph).trim()) return null;
  return user;
};

export const verifyReset = async (req, res) => {
  try {
    const user = await findForReset(req.body.email, req.body.ph);
    if (!user) return fail(res, 404, "No account matches that email and phone number");
    res.status(200).json({ success: true, message: "Account verified" });
  } catch (err) {
    fail(res, 500, err.message);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, ph, password } = req.body;
    if (!password || password.length < 6) {
      return fail(res, 400, "Password should have at least 6 characters");
    }
    const user = await findForReset(email, ph);
    if (!user) return fail(res, 404, "No account matches that email and phone number");
    user.password = password;
    await user.save();
    res.status(200).json({ success: true, message: "Password updated" });
  } catch (err) {
    fail(res, 400, err.message);
  }
};

// delete deleteUserAccount permanently-------------------------
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return fail(res, 404, "User not found");
    res.status(200).json({
      success: true,
      message: `account with the id ${req.params.id} deleted successfully`,
    });
  } catch (err) {
    fail(res, 400, err.message);
  }
};
