import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
  },
  logo: {
    type: String,
    required: [true, 'Skill logo is required'],
    trim: true,
  }
}, {
  timestamps: true
});

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
