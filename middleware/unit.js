const Units = require("../units/units-model.js");

module.exports = {

    validateUnitData(action) {

        return async (req, res, next) => {
     
            if(req.body.constructor === Object && Object.keys(req.body).length ===0) {
     
                res.status(404).json({message: "missing unit data"});
     
            } else if(action === 'add' && (!req.body.name )) {
     
                res.status(404).json({message: "missing name field"});
     
            } 
            else if(action === 'update' && !req.body.name ) {
     
                res.status(404).json({message: "missing name field"});
     
            } else {
                next();
            }        
     
        }
    },

    validateUnitId: () => { 
    
        return async (req, res, next) => {
           try {
              const unit = await Units.findById(req.params.id);
              if(!unit) { 
                 res.status(404).json({message: "Record not exist"});
              } else {
                 req.unit = unit;            
                 next();
              }
     
           } catch(err) {
              next(err);
           }
        }
     },

     isUnitUnique: (action) =>  {

        return async (req, res, next) => {
            
            try {  
                    
                const payload = {
                    id: req.params.id || '',
                    name: req.body.name
                }
                
                const unit = await Units.checkUnit(payload);

                if(unit) {
                    return res.status(409).json({message: "Unit is already exist."});    
                } else {
                    next();             
                }
     
            } catch (err) {
                  next(err)
            }
        }
     }
}