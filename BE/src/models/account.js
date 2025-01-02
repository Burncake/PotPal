const {db} = require('../config/db'); // Kết nối database
const bcrypt = require('bcrypt');


const accountMethods = {
    // 1. Thêm tài khoản mới
    addAccount: async (username, password, email) => {
        try {
            const saltRounds = 10; // Số vòng lặp để tạo salt
            const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash mật khẩu

            // Lưu vào database
            const [newAccount] = await db('users').insert({
                username,
                password: hashedPassword,
                email,
            }).returning('*');

            return newAccount;
        } catch (error) {
            throw new Error(`Failed to create account: ${error.message}`);
        }
    },

    // 2. Lấy thông tin tài khoản theo ID
    getAccountByID: async (accountID) => {
        try {
            const account = await db('users').where({ accountID }).first();
            if (!account) throw new Error('Account not found');
            return account;
        } catch (error) {
            throw new Error(`Failed to fetch account: ${error.message}`);
        }
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
    updateAccountByID: async (accountID, updateData) => {
        try {
            const updatedAccount = await db('users')
                .where({ accountID })
                .update(updateData)
                .returning('*');
            if (!updatedAccount.length) throw new Error('Account not found');
            return updatedAccount[0];
        } catch (error) {
            throw new Error(`Failed to update account: ${error.message}`);
        }
    },

    // 5. Xóa tài khoản theo ID
    deleteAccountByID: async (accountID) => {
        try {
            const deleted = await db('users').where({ accountID }).del();
            if (!deleted) throw new Error('Account not found or already deleted');
            return `Account ${accountID} deleted successfully.`;
        } catch (error) {
            throw new Error(`Failed to delete account: ${error.message}`);
        }
    },

    // 6. Kiểm tra đăng nhập (dựa vào username và password đã hash)
    validatePassword: async (username, inputPassword) => {
        try {
            // Lấy mật khẩu hash từ database dựa trên username
            const account = await db('users').where('username', username).first();
            if (!account) throw new Error('Account not found');
            // So sánh mật khẩu nhập vào với mật khẩu đã hash
            const isMatch = (inputPassword===account.password)
            // const isMatch = await bcrypt.compare(inputPassword, account.password);
            if (!isMatch) throw new Error('Invalid password');

            return account;
        } catch (error) {
            throw new Error(`Password validation failed: ${error.message}`);
        }
    },
    // Kiểm tra email tồn tại chưa
    getAccountByEmail: async (email) => {
        return await db('users').where('email', email).first();
    },

    // Kiểm tra phone tồn tại chưa
    getAccountByPhone: async (phone) => {
        return await db('users').where('phoneNumber', phone).first();
    },

    updateToken: async (account) => {
        try {
            db('users').where('userID', account.accountID).update('tokens', account.token);
        }
        catch (error){
            throw new Error(`Cant set token for user: ${error.message}`);
        }
    }
};

module.exports = accountMethods;
