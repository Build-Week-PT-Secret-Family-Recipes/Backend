const db = require("../database/db-config.js");

// Get All Recipes
function getRecipes() {
    return db("recipes as r")
            .join("categories as c", "c.id", "r.category_id")
            .join("users as u", "u.id", "r.user_id")           
            .select("r.id as recipe_id", "u.name as user_name", "c.name as category_name", "r.title", "r.source", "r.description", "r.image_link")
            
}

// Get Recipe By ID
function findById(id) {
    return db("recipes as r")
            .join("categories as c", "c.id", "r.category_id")
            .join("users as u", "u.id", "r.user_id")
            .where("r.id",id)
            .select("r.id as recipe_id", "u.name as user_name", "c.name as category_name", "r.title", "r.source", "r.description", "r.image_link")
            .first()        
}

// Get Recipe
function findBy(filter) {
    return db("recipes as r")
            .join("categories as c", "c.id", "r.category_id")
            .join("users as u", "u.id", "r.user_id")
            .where(filter)
            .select("r.id as recipe_id", "u.name as user_name", "c.name as category_name", "r.title", "r.source", "r.description", "r.image_link")
                 
}

// Check Recipe beloge to user or not
function isUserRecipe(recipe_id,user_id) {
    return db("recipes")            
            .where("id",recipe_id)
            .where("user_id",user_id) 
            .first()          
}

// Add Recipe
function add(recipe) {

     return db("recipes")
            .insert(recipe)
            .then(([id]) => findById(id))
}

// Update Recipe
function update(recipe,id) {

    return db("recipes")
           .update(recipe)
           .where("id", id)
           .then(count => count > 0 ? findById(id) :  null)  
}

// Delete Recipe
function remove(id) {
    return db("recipes")
            .where("id",id)
            .del()   
}

// Add Recipe Ingredients
function addRecipeIngredient(ingredient) {
    return db("recipes_ingredients")
            .insert(ingredient)            
}

// Update Recipe Ingredients
function updateRecipeIngredient(ingredient,recipe_id,old_ingredient_id) {
    return db("recipes_ingredients")
           .update(ingredient)
           .where("recipe_id", recipe_id)
           .where("ingredient_id", old_ingredient_id)
}

// Get Recipe Ingredients
function getRecipeIngredients(recipe_id, ingredient_id = 0) { 
    let qry = db("recipes_ingredients as ri")
               .join("ingredients as i", "i.id", "ri.ingredient_id")
               .join("units as u", "u.id", "ri.unit_id")
               .select("ri.ingredient_id", "i.name as ingredient", "ri.unit_id", "u.name as unit", "ri.quantity")
               .where("ri.recipe_id", recipe_id) 
    
    if(ingredient_id !== 0)
       return qry.where("ri.ingredient_id", ingredient_id)
    else     
       return qry       
            
}

// Delete Recipe Ingredients
function removeRecipeIngredients(recipe_id, ingredient_id = 0) {
    let qry = db("recipes_ingredients")
               .where("recipe_id",recipe_id)               
               .del()  
    if(ingredient_id !== 0)
      return qry.where("ingredient_id",ingredient_id)
    else     
      return qry  
}


// Add Recipe Instructionsn
function addRecipeInstructions(recipesInstrunction) {
    return db("recipes_instructions")
            .insert(recipesInstrunction)
            .then( ([id]) => {return db("recipes_instructions").where("id",id).first()})    
}

// Delete Recipe Instructions
function removeRecipeInstructions(recipe_id, instruction_id = 0) {
    let qry = db("recipes_instructions")
               .where("recipe_id",recipe_id)               
               .del()  
    if(instruction_id !== 0)
      return qry.where("id",instruction_id)
    else     
      return qry  
}


// Get Recipe Instructionsn
function getRecipeInstrunctions(recipe_id) 
{
    return db("recipes_instructions")
            .where("recipe_id",recipe_id)
            .orderBy("step_no","ASC")
            .select("id", "recipe_id", "step_no", "instruction");
}


async function checkRecipeIngredUnique(payload) 
{
    const {recipe_id, ingredient_id, old_ingredient_id} = payload;

    const query = db("recipes_ingredients")
                   .where({recipe_id})                   
                   
    
    if(old_ingredient_id) { //for update
       
        if(ingredient_id === old_ingredient_id) { // if user dont change the ingredient                     
            return Promise.resolve(false);            
        }   
        else {
           query.where({ingredient_id})
           console.log(ingredient_id)   
           return await query.first();

        }    
          
    } else {
        query.where({ingredient_id}) //in case of add
        return await query.first();
    } 

   
}




module.exports = {
   getRecipes, 
   findById,
   findBy,
   isUserRecipe,
   add,
   update,
   remove,
   getRecipeIngredients,
   addRecipeIngredient,
   removeRecipeIngredients,
   updateRecipeIngredient,
   addRecipeInstructions,
   removeRecipeInstructions,
   getRecipeInstrunctions,
   checkRecipeIngredUnique  
}