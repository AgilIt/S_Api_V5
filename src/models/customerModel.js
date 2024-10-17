const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  birthdate: Date,
  address: String,
  address_number: String,
  postal_code: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{5}$/.test(v);
      },
      message: props => `${props.value} is not a valid French postal code!`
    }
  },
  department: { 
    type: String, 
    required: true
  },
  city: String,
  country: String,
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String, default: 'default.jpg' },
  creation_date: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  reputation: { type: Number, default: 0 }
});

customerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  
  // Set department based on postal code
  this.department = this.postal_code.substring(0, 2);
  
  next();
});

customerSchema.pre('findOneAndUpdate', function(next) {
  if (this._update.postal_code) {
    this._update.department = this._update.postal_code.substring(0, 2);
  }
  next();
});

customerSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Customer', customerSchema);