const { db } = require('../config/db'); // Kết nối database
const bcrypt = require('bcrypt');

const accountMethods = {
    // 1. Thêm tài khoản mới
    addAccount: async (userID, userName, password, email, phoneNumber, fullName = "Unknown", role = "Customer") => {
        try {
            if (!password) {
                throw new Error('password is missing or invalid.');
            }
            const saltRounds = 10;
            const hashedpassword = await bcrypt.hash(password, saltRounds);

            const result = await db('users').insert({
                userID,
                userName,
                password: hashedpassword,
                email,
                phoneNumber,
                fullName,  // Including fullName
                role,      // Including role with default value of 'Customer'
            });

            return result[0];
        } catch (error) {
            throw new Error(`Failed to create account: ${error.message}`);
        }
    },
    // 2. Lấy thông tin tài khoản theo userID
    getAccountByID: async (userID) => {
        try {
            const account = await db('users').where({ userID }).first();
            if (!account) throw new Error('Account not found');
            return account;
        } catch (error) {
            throw new Error(`Failed to fetch account: ${error.message}`);
        }
    },

    getAccountByUserName: async (userName) => {
        return await db('users').where('userName', userName).first();
    },

    // 3. Lấy danh sách tất cả tài khoản
    getAllAccounts: async () => {
        try {
            return await db('users').select('*');
        } catch (error) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    },

    // 4. Cập nhật thông tin tài khoản
    updateAccountByID: async (userID, updateData) => {
        try {
            const updatedAccount = await db('users')
                .where({ userID })
                .update(updateData)
                .returning('*');
            if (!updatedAccount.length) throw new Error('Account not found');
            return updatedAccount[0];
        } catch (error) {
            throw new Error(`Failed to update account: ${error.message}`);
        }
    },

    // 5. Xóa tài khoản theo userID
    deleteAccountByID: async (userID) => {
        try {
            const deleted = await db('users').where({ userID }).del();
            if (!deleted) throw new Error('Account not found or already deleted');
            return `Account ${userID} deleted successfully.`;
        } catch (error) {
            throw new Error(`Failed to delete account: ${error.message}`);
        }
    },

    // 6. Kiểm tra đăng nhập (dựa vào userName và password đã hash)
    validatepassword: async (userName, inputpassword) => {
        try {
            // Lấy mật khẩu hash từ database dựa trên userName
            const account = await db('users').where('userName', userName).first();
            if (!account) throw new Error('Account not found');
            // So sánh mật khẩu nhập vào với mật khẩu đã hash
            const isMatch = await bcrypt.compare(inputpassword, account.password);
            if (!isMatch) throw new Error('Invalid password');

            return account;
        } catch (error) {
            throw new Error(`password validation failed: ${error.message}`);
        }
    },

    // Kiểm tra email tồn tại chưa
    getAccountByEmail: async (email) => {
        return await db('users').where('email', email).first();
    },

    // Kiểm tra phone tồn tại chưa
    getAccountByPhone: async (phoneNumber) => {
        return await db('users').where('phoneNumber', phoneNumber).first();
    },

    updateToken: async (account) => {
        try {
            // Ensure that the account object contains userID and token
            if (!account.userID || !account.token) {
                throw new Error('Missing userID or token');
            }

            // Update token in the database using userID
            const result = await db('users')
                .where('userID', account.userID) // Use userID for the condition
                .update('token', account.token);

            // Check if any rows were affected (meaning the update was successful)
            if (result === 0) {
                throw new Error('Failed to update token. Account not found.');
            }

        } catch (error) {
            throw new Error(`Failed to set token for user: ${error.message}`);
        }
    }
};

module.exports = accountMethods;
