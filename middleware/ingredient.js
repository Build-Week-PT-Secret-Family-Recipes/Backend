const Ingredients = require("../ingredients/ingredients-model.js");

module.exports = {

    validateIngredientData(action) {

        return async (req, res, next) => {
     
            if(req.body.constructor === Object && Object.keys(req.body).length ===0) {
     
                res.status(404).json({message: "missing ingredient data"});
     
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

    validateIngredientId: () => { 
    
        return async (req, res, next) => {
           try {
              const ingredient = await Ingredients.findById(req.params.id);
              if(!ingredient) { 
                 res.status(404).json({message: "Record not exist"});
              } else {
                 req.ingredient = ingredient;            
                 next();
              }
     
           } catch(err) {
              next(err);
           }
        }
     },

     isIngredientUnique: (action) =>  {

        return async (req, res, next) => {
            
            try {  
                    
                const payload = {
                    id: req.params.id || '',
                    name: req.body.name
                }
                
                const ingredient = await Ingredients.checkIngredient(payload);

                if(ingredient) {
                    return res.status(409).json({message: "Ingredient is already exist."});    
                } else {
                    next();             
                }
     
            } catch (err) {
                  next(err)
            }
        }
     }
}