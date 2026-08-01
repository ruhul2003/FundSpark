const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};

const verifyCreator = (req, res, next) => {
  if (req.user && (req.user.role === 'Creator' || req.user.role === 'Admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Creator access required' });
  }
};

const verifySupporter = (req, res, next) => {
  if (req.user && (req.user.role === 'Supporter' || req.user.role === 'Creator' || req.user.role === 'Admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Access required' });
  }
};

module.exports = { verifyAdmin, verifyCreator, verifySupporter };
