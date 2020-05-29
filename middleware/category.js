const Categories = require("../categories/categories-model.js");

module.exports = {

    validateCategoryData(action) {

        return async (req, res, next) => {
     
            if(req.body.constructor === Object && Object.keys(req.body).length ===0) {
     
                res.status(404).json({message: "missing category data"});
     
            } else if(action === 'add' && (!req.body.name )) {
     
                res.status(404).json({message: "missing name field"});
     
            }
            else if(action === 'update' && !req.body.name) {
     
                res.status(404).json({message: "missing name field"});
     
            } else {
                next();
            }        
     
        }
    },

    validateCategoryId: () => { 
    
        return async (req, res, next) => {
           try {
              const category = await Categories.findById(req.params.id);
              if(!category) { 
                 res.status(404).json({message: "Record not exist"});
              } else {
                 req.category = category;            
                 next();
              }
     
           } catch(err) {
              next(err);
           }
        }
     },

     isCategoryUnique: (action) =>  {

        return async (req, res, next) => {
            
            try {  
                    
                const payload = {
                    id: req.params.id || '',
                    name: req.body.name
                }
                
                const category = await Categories.checkCategory(payload);

                if(category) {
                    return res.status(409).json({message: "Category is already exist."});    
                } else {
                    next();             
                }
     
            } catch (err) {
                  next(err)
            }
        }
     }
}