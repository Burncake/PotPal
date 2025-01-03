const accountMethods = require("../models/account");
const { generateToken } = require("../utils/generator");

const accountController = {
  // Thêm tài khoản mới
  addAccount: async (req, res) => {
    try {
      const { username, password, email } = req.body;

      // Kiểm tra đầu vào
      if (!username || !password || !email) {
        return res
          .status(401)
          .json({ status: "error", message: "Missing required fields." });
      }

      // Thêm tài khoản
      const newAccount = await accountMethods.addAccount(
        username,
        password,
        email
      );

      return res.status(201).json({
        status: "success",
        message: "Account created successfully.",
        data: newAccount,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  // Đăng nhập tài khoản
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log(username, password);
      // Kiểm tra đầu vào
      if (!username || !password) {
        return res
          .status(400)
          .json({
            status: "error",
            message: "Username and password are required.",
          });
      }
      // Kiểm tra mật khẩu
      const account = await accountMethods.validatePassword(username, password);
      account.token = await generateToken(account);
      accountMethods.updateToken(account);
      return res.status(200).json({
        status: "success",
        message: "Login successful.",
        data: {
          accountID: account.accountID,
          username: account.username,
          email: account.email,
          token: account.token,
        },
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },

  // Đăng ký tài khoản
  register: async (req, res) => {
    try {
      const { username, password, email, phone } = req.body;

      // Kiểm tra đầu vào
      if (!username || !password || !email || !phone) {
        return res
          .status(400)
          .json({ status: "error", message: "Missing required fields." });
      }

      // Kiểm tra email hoặc số điện thoại đã tồn tại chưa
      const existingEmail = await accountMethods.getAccountByEmail(email);
      const existingPhone = await accountMethods.getAccountByPhone(phone);

      if (existingEmail) {
        return res
          .status(400)
          .json({ status: "error", message: "Email is already in use." });
      }

      if (existingPhone) {
        return res
          .status(400)
          .json({
            status: "error",
            message: "Phone number is already in use.",
          });
      }

      // Thêm tài khoản mới vào database
      const newAccount = await accountMethods.addAccount(
        username,
        password,
        email,
        phone
      );

      return res.status(201).json({
        status: "success",
        message: "Account registered successfully.",
        data: { accountID: newAccount.accountID, username, email, phone },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: `Failed to register account: ${error.message}`,
      });
    }
  },

  // Lấy thông tin tài khoản
  getAccount: async (req, res) => {
    try {
      const { username } = req.params;

      // Truy vấn thông tin tài khoản
      const account = await accountMethods.getAccountByUsername(username);

      if (!account) {
        return res
          .status(404)
          .json({ status: "error", message: "Account not found." });
      }

      return res.status(200).json({
        status: "success",
        data: {
          accountID: account.accountID,
          username: account.username,
          email: account.email,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  // Lấy danh sách tất cả tài khoản
  getAllAccount: async (req, res) => {
    try {
      // Lấy tất cả tài khoản từ database
      const accounts = await accountMethods.getAllAccounts();

      return res.status(200).json({
        status: "success",
        data: accounts,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: `Failed to fetch accounts: ${error.message}`,
      });
    }
  },
};

module.exports = accountController;
