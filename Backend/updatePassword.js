// updatePassword.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./db');// adjust path if needed

const [,, email, plainPassword] = process.argv;

if (!email || !plainPassword) {
  console.error('Usage: node updatePassword.js user@example.com NewPassword123!');
  process.exit(1);
}

(async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainPassword, salt);
    const [result] = await pool.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [hash, email]
    );
    console.log('Rows affected:', result.affectedRows);
    console.log('New hash saved for', email);
    console.log("hash" ,hash);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
