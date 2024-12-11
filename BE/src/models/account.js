const db = require('../utils/db');
const bcrypt = require("bcrypt");

exports.findUserByUserName = (username) => {
    return db('users').where('UserName', username).first();
}

exports.findUserById = (userId) => {
    return db('users').where('UserId',userId).first()
}

exports.createUser = async (data) => {
    try{
        let {username, password} = data;
        const isNewUser = await this.inThisEmailInUse(username);
        if (!isNewUser) throw new Error('User already registered');
        password=await bcrypt.hash(password, 8);
        return await db('users').insert({username, password});
    }catch (e) {
        console.log(e)
        return null
    }
}

exports.comparePassword = async (password,passwordCheck) => {
    if (!password) throw new Error('Password is required');
    try {
        console.log(password, passwordCheck)
        return await bcrypt.compare(password, passwordCheck);
    } catch (e) {
        console.log(e);
        return false;
    }
}

exports.inThisEmailInUse= async function (username) {
    if(!username) throw new Error('Username is required');
    try{
        const user = await this.findUserByUserName(username);
        return !user
    }catch (e) {
        console.log(e);
        return false;
    }
}

exports.findByIdAndUpdate = (id, data) => {
    return db('users').where('id', id).update(data);
}

exports.findByIdAndUpdateToken = (id, data) => {
    return db('users').where('UserId', id).update({
        tokens:data
    });
}
