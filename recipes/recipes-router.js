const express = require("express")
const recipeModel = require("./recipes-model")
const restrict = require("../auth/restricted-middleware.js");
const {validateRecipeData, validateRecipeId, isUserRecipe, validateRecipeIngredData, isRecipeIngredUnique} = require("../middleware/recipe.js");

const router = express.Router()


// Get All Recipes
router.get("/", restrict(), async (req, res, next) => {
  
   try { 

         const recipes = await recipeModel.getRecipes()
         res.json(recipes)

   } catch(err) {
         next(err)
   }

})

// Get Recipe By ID
router.get("/:id", restrict(), validateRecipeId(), async (req, res, next) => {
  
   try { 
         const  id  = req.params.id
         const recipe = await recipeModel.findById(id)
         const recipe_ingredients  = await recipeModel.getRecipeIngredients(id)
         const recipe_instructions = await recipeModel.getRecipeInstrunctions(id)
         const recipe_obj = {...recipe, ingredients:recipe_ingredients,instructions:recipe_instructions}
         res.json(recipe_obj)

   } catch(err) {
         next(err)
   }

})


// Add New Recipe
router.post("/", restrict(), validateRecipeData(), async (req, res, next) => {
  
      try { 
            
            const {category_id, title, source, description, image_link, ingredients, instructions} = req.body
            const totIngred = ingredients.length
            const totInst = instructions.length

            const payload = {
               user_id: req.id,   //logged in user id
               category_id: category_id,
               title: title,
               source: source,
               description: description,
               image_link: image_link           
            }
           
            const recipe = await recipeModel.add(payload)             
            if(recipe) {

                  for(let i=0; i<totIngred; i++) {
                        const payload_ingred = {
                              recipe_id: recipe.recipe_id,
                              ingredient_id: ingredients[i].ingredient_id,
                              unit_id: ingredients[i].unit_id,
                              quantity: ingredients[i].quantity                   
                        }                        
                        await recipeModel.addRecipeIngredient(payload_ingred)                         
                  }
                  const recipe_ingredient = await recipeModel.getRecipeIngredients(recipe.recipe_id)            
                  
                  let instrunctions = []
                  for(let i=0; i<totInst; i++) {
                        const payload_inst = {
                              recipe_id :recipe.recipe_id,
                              step_no :instructions[i].step_no,
                              instruction :instructions[i].instruction,
                        }     
                        const recipesInstrunction = await recipeModel.addRecipeInstructions(payload_inst);                          
                        instrunctions[i] = recipesInstrunction                      
                  }
                  

                  const recipe_obj = {...recipe, ingredients:recipe_ingredient,instructions:instrunctions}
                  res.json(recipe_obj)
                  

            }
           
   
      } catch(err) {
            next(err)
      }
   
   })

// Add Recipe
// router.post("/", restrict(), validateRecipeData(), async (req, res, next) => {
  
//    try { 
         
//          const {category_id, title, source, description, image_link} = req.body
//          const payload = {
//             user_id: req.id,   //logged in user id
//             category_id: category_id,
//             title: title,
//             source: source,
//             description: description,
//             image_link: image_link           
//          }
        
//          const recipe = await recipeModel.add(payload) 
//          res.json(recipe)

//    } catch(err) {
//          next(err)
//    }

// })


// Update Recipe New Way
router.put("/:id", restrict(), validateRecipeData(), validateRecipeId(), isUserRecipe(), async (req, res, next) => {
  
   try { 
         const id = req.params.id
         const {category_id, title, source, description, image_link, ingredients, instructions} = req.body
         const totIngred = ingredients.length
         const totInst = instructions.length

         const payload = {
            user_id: req.id,   //logged in user id
            category_id: category_id,
            title: title,
            source: source,
            description: description,
            image_link: image_link           
         }
        
         const recipe = await recipeModel.update(payload,id)
                     
         if(recipe) {
               
               await recipeModel.removeRecipeIngredients(recipe.recipe_id) // remove all previous ingredients
               
               for(let i=0; i<totIngred; i++) {
                     const payload_ingred = {
                           recipe_id: recipe.recipe_id,
                           ingredient_id: ingredients[i].ingredient_id,
                           unit_id: ingredients[i].unit_id,
                           quantity: ingredients[i].quantity                   
                     }
                     
                     await recipeModel.addRecipeIngredient(payload_ingred)                         
               }
               const recipe_ingredient = await recipeModel.getRecipeIngredients(recipe.recipe_id)            
               
               await recipeModel.removeRecipeInstructions(recipe.recipe_id) // remove all previous instructions
               let instrunctions = []
               for(let i=0; i<totInst; i++) {
                     const payload_inst = {
                           recipe_id :recipe.recipe_id,
                           step_no :instructions[i].step_no,
                           instruction :instructions[i].instruction,
                     }     
                        
                     const recipesInstrunction = await recipeModel.addRecipeInstructions(payload_inst);                     
                     instrunctions[i] = recipesInstrunction                      
               }
             

               const recipe_obj = {...recipe, ingredients:recipe_ingredient,instructions:instrunctions}
               res.json(recipe_obj)
         }

       
        

   } catch(err) {
         next(err)
   }

})


// Update Recipe
// router.put("/:id", restrict(), validateRecipeData(), isUserRecipe(), async (req, res, next) => {
  
//    try { 
//          const id = req.params.id
//          const {category_id, title, source, description, image_link} = req.body
//          const payload = {
//             user_id: req.id,   //logged in user id
//             category_id: category_id,
//             title: title,
//             source: source,
//             description: description,
//             image_link: image_link           
//          }
        
//          const recipe = await recipeModel.update(payload,id)

       
//          res.json(recipe)

//    } catch(err) {
//          next(err)
//    }

// })

// Delete Recipe
router.delete('/:id', restrict(), validateRecipeId(), isUserRecipe(), async (req, res, next) => {  
   
   try { 
         const id = req.params.id    
         await recipeModel.remove(id)   
         await recipeModel.removeRecipeIngredients(id)    
         await recipeModel.removeRecipeInstructions(id)
         res.status(204).end()

   } catch(err) {
         next(err)
   }
 
 })

////////////////////////////////// May be Not User in this Build ///////////////////////////////////////////
 
// Get Recipe Ingredients
router.get("/:id/ingredients", restrict(), isUserRecipe(), async (req, res, next) => {
  
      try { 
            const  {id:recipe_id}  = req.params
            const recipe_ingredients = await recipeModel.getRecipeIngredients(recipe_id)
            res.json(recipe_ingredients)
   
      } catch(err) {
            next(err)
      }
   
})


// Add Recipe Ingredients
router.post("/:id/ingredients", restrict(), validateRecipeIngredData(), isUserRecipe(), isRecipeIngredUnique(), async (req, res, next) => {

      try {             
            const {id:recipe_id} = req.params
            const {ingredient_id, unit_id, quantity} = req.body
            const payload = {
               recipe_id: recipe_id,
               ingredient_id: ingredient_id,
               unit_id: unit_id,
               quantity: quantity                   
            }
           
            await recipeModel.addRecipeIngredient(payload)  
            const recipe_ingredient = await recipeModel.getRecipeIngredients(recipe_id,ingredient_id)     
        
            res.json(recipe_ingredient)
   
      } catch(err) {
            next(err)
      }
   
})

// Update Recipe Ingredients
router.put("/:id/ingredients/:ingred_id", restrict(), validateRecipeIngredData(), isUserRecipe(), isRecipeIngredUnique(), async (req, res, next) => {

      try {             
            const {id:recipe_id,ingred_id:old_ingredient_id} = req.params
            const {ingredient_id, unit_id, quantity} = req.body
            const payload = {
               recipe_id: recipe_id,
               ingredient_id: ingredient_id,
               unit_id: unit_id,
               quantity: quantity                   
            }
           
            await recipeModel.updateRecipeIngredient(payload,recipe_id,old_ingredient_id)  
            const recipe_ingredient = await recipeModel.getRecipeIngredients(recipe_id,ingredient_id)     
        
            res.json(recipe_ingredient)
   
      } catch(err) {
            next(err)
      }
   
})

// Delete Recipe Ingredient By ID
router.delete('/:id/ingredients/:ingred_id', restrict(), isUserRecipe(), async (req, res, next) => {  
   
      try { 
            const {id:recipe_id, ingred_id:ingredient_id} = req.params   
            await recipeModel.removeRecipeIngredients(recipe_id,ingredient_id)      
            res.status(204).end()
   
      } catch(err) {
            next(err)
      }
    
 })
   


module.exports = router