const accountMethods = require('../models/account');
const { generateToken, generateID } = require('../utils/generator');

const accountController = {
    // Thêm tài khoản mới
    addAccount: async (req, res) => {
        try {
            const { userName, password, email, phoneNumber } = req.body;

            // Kiểm tra đầu vào
            if (!userName || !password || !email || !phoneNumber) {
                return res.status(400).json({ status: 'error', message: 'Missing required fields.' });
            }

            // Kiểm tra email hoặc số điện thoại đã tồn tại chưa
            const existingEmail = await accountMethods.getAccountByEmail(email);
            const existingPhone = await accountMethods.getAccountByPhone(phoneNumber);

            if (existingEmail) {
                return res.status(400).json({ status: 'error', message: 'Email is already in use.' });
            }

            if (existingPhone) {
                return res.status(400).json({ status: 'error', message: 'Phone number is already in use.' });
            }

            // Tạo userID
            const userID = generateID();

            // Thêm tài khoản
            const newAccount = await accountMethods.addAccount(userID, userName, password, email, phoneNumber);

            return res.status(201).json({
                status: 'success',
                message: 'Account created successfully.',
                data: newAccount,
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    },

    // Đăng nhập tài khoản
    login: async (req, res) => {
        try {
            const { userName, password } = req.body;

            // Kiểm tra đầu vào
            if (!userName || !password) {
                return res.status(400).json({ status: 'error', message: 'Username and password are required.' });
            }

            // Kiểm tra mật khẩu
            const account = await accountMethods.validatepassword(userName, password);

            if (!account) {
                return res.status(401).json({ status: 'error', message: 'Invalid credentials.' });
            }

            // Tạo token
            const tokenPayload = { userID: account.userID, userName: account.userName }; // Limit payload data
            const token = await generateToken(tokenPayload); // Pass only necessary info
            account.token = token;

            // Update token in database
            await accountMethods.updateToken(account);

            return res.status(200).json({
                status: 'success',
                message: 'Login successful.',
                data: {account},
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message,
            });
        }
    },

    // Đăng ký tài khoản
    register: async (req, res) => {
        try {
            const { userName, password, email, phoneNumber, fullName } = req.body;
            // Kiểm tra đầu vào
            if (!userName || !password || !email || !phoneNumber) {
                return res.status(400).json({ status: 'error', message: 'Missing required fields.' });
            }

            // Kiểm tra email, số điện thoại và userName đã tồn tại chưa
            const existingEmail = await accountMethods.getAccountByEmail(email);
            const existingPhone = await accountMethods.getAccountByPhone(phoneNumber);
            const existingUserName = await accountMethods.getAccountByUserName(userName);

            if (existingUserName) {
                return res.status(400).json({ status: 'error', message: 'User name is already in use.' });
            }

            if (existingEmail) {
                return res.status(400).json({ status: 'error', message: 'Email is already in use.' });
            }

            if (existingPhone) {
                return res.status(400).json({ status: 'error', message: 'Phone number is already in use.' });
            }

            // Nếu fullName không có, gán mặc định là "Unknown"
            const fullNameToStore = fullName || "Unknown";

            // Tạo userID
            const userID = generateID();

            // Thêm tài khoản
            const newAccount = await accountMethods.addAccount(userID, userName, password, email, phoneNumber, fullNameToStore);

            return res.status(201).json({
                status: 'success',
                message: 'Account registered successfully.',
                data: {
                    accountID: newAccount.accountID,
                    userName,
                    email,
                    phoneNumber,
                    fullName: fullNameToStore,
                },
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: `Failed to register account: ${error.message}`,
            });
        }
    },

    // Lấy thông tin tài khoản
    getAccount: async (req, res) => {
        try {
            const { userName } = req.params;

            // Truy vấn thông tin tài khoản
            const account = await accountMethods.getAccountByUsername(userName);

            if (!account) {
                return res.status(404).json({ status: 'error', message: 'Account not found.' });
            }

            return res.status(200).json({
                status: 'success',
                data: {
                    accountID: account.accountID,
                    userName: account.userName,
                    email: account.email,
                    phoneNumber: account.phoneNumber,
                },
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
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
                status: 'success',
                data: accounts,
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: `Failed to fetch accounts: ${error.message}`,
            });
        }
    },
};

module.exports = accountController;
