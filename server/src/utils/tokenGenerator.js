const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for a user.
 * @param {Object} user - The user object or selected data.
 * @param {string} expiresIn - Token expiration (default '7d').
 */
function generateToken(user, expiresIn = '7d') {
  const payload = {
    userId: user.id,
    phone: user.phone,
    referralCode: user.referralCode,
    createdAt: user.createdAt,
    // Add other non-sensitive info if needed
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

module.exports = generateToken;
