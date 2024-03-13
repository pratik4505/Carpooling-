const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const foundUser = await User.findOne({ emailId }).exec();
    if (!foundUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
  const accessToken = jwt.sign(
    {
      UserInfo: { name: foundUser.name, emailId: foundUser.emailId },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "100s" }
  );
  const refreshToken = jwt.sign(
    { emailId: foundUser.emailID },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ accessToken });
};

const refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      try {
        if (err) throw new Error("Forbidden");

        const foundUser = await User.findOne({ emailId: decoded.emailId });
        if (!foundUser) throw new Error("Unauthorized");

        const accessToken = jwt.sign(
          {
            UserInfo: { name: foundUser.name, emailId: foundUser.emailId },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "100s" }
        );
        res.json({ accessToken });
      } catch (error) {
        if (error.message === "Forbidden") {
          return res.status(403).json({ message: "Forbidden" });
        } else if (error.message === "Unauthorized") {
          return res.status(401).json({ message: "Unauthorized" });
        } else {
          return res.status(500).json({ message: "Internal Server Error" });
        }
      }
    }
  );
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};
module.exports = { login, refresh, logout };
