const Users = require("../users/users-model.js");
const jwt = require("jsonwebtoken");

function restrict()
{
    const authError = {
        message: "You shall not pass!"
    }

    return async (req, res, next) => {
        
        try {

            //const {token} = req.cookies; // for insomia and postman get values from cookies
            //const token = req.header('authorization') //for react client app
            const token = req.header('authorization') || req.cookies.token;

            if(!token)
            {
                return res.status(401).json(authError);
            }

            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                
                if(err)
                {
                   return  res.status(401).json(authError);
                }

                req.id = decoded.id; // Set user id in request.  
                next();
            }) 

        } catch(err) {
            next(err);
        }
    }
    
}

module.exports = restrict;