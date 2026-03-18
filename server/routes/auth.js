const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, updateProfile, changePassword, deleteAccount } = require('../controllers/authController.js');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.put('/profile', updateProfile);
router.put('/password', changePassword);
router.delete('/delete', deleteAccount);
router.get('/me', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.json({ user: null });
    }
});

module.exports = router;