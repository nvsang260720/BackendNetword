const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

cloudinary.config({ 
  cloud_name: 'drqaocsli', 
  api_key: '327234974388462', 
  api_secret: 'hhWLBIGkcf7hdtU01xZOnIVA3eY',
  secure: true
});

module.exports = cloudinary