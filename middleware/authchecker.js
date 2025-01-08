const jwt = require("jsonwebtoken");

const authchecker = (req,res,next)=>{
    let token = req.headers.token;

    if (!token) {
        return res.status(401).json({msg : "Invalid Token "});
    }

    try {
        const decoded = jwt.verify(token, process.env.secretkey); 
        req.user = decoded; 
        next(); 
      } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
      }
}