const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

//Pre-save hook to hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 10);
    
});

const User = mongoose.model('User', userSchema);

module.exports = User;