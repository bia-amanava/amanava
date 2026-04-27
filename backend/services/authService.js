const jwt = require('jsonwebtoken');

// Secret for JWT - in production this should be in .env
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_amanava_2026';

// Mock users
const users = [
    { id: 1, email: 'ricardo@amanava.com', name: 'Ricardo' },
    { id: 2, email: 'ana@amanava.com', name: 'Ana' }
];

const login = (email, password) => {
    // For now, any password works for the mock users
    const user = users.find(u => u.email === email);
    
    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Sign a real JWT
    const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '8h' }
    );

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name
        }
    };
};

module.exports = {
    login
};
