const authService = require("../services/authServices");

const authController = {
  register: async (req, res) => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },


  login: async (req, res) => {
    try {
      const result = await authService.login(req.body);
      res.json({
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]; // Bearer token
      const result = await authService.logout(token);
      res.json({
        message: 'Logout successful',
        data: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      res.json({
        message: result.message
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      const result = await authService.resetPassword({ token, newPassword });
      res.json({
        message: 'Password reset successful',
        data: result
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Optional: Verify token endpoint
  verifyToken: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const result = await authService.verifyToken(token);

      if (result.valid) {
        res.json({
          valid: true,
          user: result.user
        });
      } else {
        res.status(401).json({
          valid: false,
          error: result.error
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = authController;