const supertest = require("supertest")
const server = require('../server.js')
const db = require("../database/db-config.js")

beforeAll( async () => {
    await db.seed.run()
})

// afterAll( async () => {
//     await db.destroy()
// })



describe("User Integration tests", () => {
  
    // beforeEach( async () => {
    //     await db.seed.run()
    // })

    // afterAll( async () => {
    //     await db.destroy()
    // })

    const payload = {
        name:"abc",
        email:"abc@gmail.com",
        password:"123"       
    }
  

    it("Register", async () => {

        const payload = {
            name:"nasir",
            email:"nasir@gmail.com",
            password:"123"       
        }
        const res = await supertest(server).post("/api/auth/register/").send(payload)
        expect(res.status).toBe(201)
        expect(res.type).toBe("application/json")
        expect(res.body.name).toBe("nasir")
   })

    it("Register Already Exist /api/auth/register", async () => {
        
        const res = await supertest(server).post("/api/auth/register/").send(payload)      
        expect(res.statusCode).toBe(409)        
 
     })

    it("login", async () => {
     
        const res = await supertest(server).post("/api/auth/login/").send(payload)
        expect(res.status).toBe(200)
        expect(res.type).toBe("application/json")
        expect(res.body.message).toBe("Welcome abc")
    })

    it("login Invalid Credentials", async () => {
        const payload = {
            email:"sohail@gmail.com",
            password:"123"       
        }
        const res = await supertest(server).post("/api/auth/login/").send(payload)
        expect(res.status).toBe(401)       
    })

})


describe("Category integration tests", () => {  

    let token;

    beforeAll((done) => {
    supertest(server)
        .post('/api/auth/login/')
        .send({
        name:"abc",
        email:"abc@gmail.com",
        password:"123"       
        })
        .end((err, response) => {
        token = response.body.token; // save the token!
        done();
        });
    });
    
    it("GET /api/categories" , async () => {
        const res = await supertest(server).get("/api/categories/").set('Authorization', `${token}`)
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe("application/json")
        expect(res.body).toHaveLength(9)
        expect(res.body[0]).not.toBe("")
    })

    it("POST /api/categories", async () => {
       const payload = {
           name: "Category A",
           description: "Testing category"
       }
       const res = await supertest(server).post("/api/categories/").send(payload).set('Authorization', `${token}`)
       expect(res.statusCode).toBe(201)
       expect(res.type).toBe("application/json")
       expect(res.body.name).toBe("Category A")

    })

    it("POST Already Exist /api/categories", async () => {
        const payload = {
            name: "Lunch",
            description: "For Your MidDay Meal"
        }
        const res = await supertest(server).post("/api/categories/").send(payload).set('Authorization', `${token}`)        
        expect(res.statusCode).toBe(409)        
 
     })

    it("Delete /categories/:id", async () => {
        
        const res = await supertest(server).delete("/api/categories/3").set('Authorization', `${token}`)
        expect(res.statusCode).toBe(204)        
 
     })

     it("Delete NotFound /api/categoies/:id", async () => {
        
        const res = await supertest(server).delete("/api/categories/20").set('Authorization', `${token}`)
        expect(res.statusCode).toBe(404)        
 
     })
})

describe("Ingredient integration tests", () => {

  
    let token;

    beforeAll((done) => {
    supertest(server)
        .post('/api/auth/login/')
        .send({
        name:"abc",
        email:"abc@gmail.com",
        password:"123"       
        })
        .end((err, response) => {
        token = response.body.token; // save the token!
        done();
        });
    });
    
    it("GET /api/ingredients" , async () => {
        const res = await supertest(server).get("/api/ingredients/").set('Authorization', `${token}`)
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe("application/json")
        expect(res.body).toHaveLength(16)
        expect(res.body[0]).not.toBe("")
    })

    it("POST /api/ingredients", async () => {
       const payload = {
           name: "Ingredient A"
        }
       const res = await supertest(server).post("/api/ingredients/").send(payload).set('Authorization', `${token}`)
       expect(res.statusCode).toBe(201)
       expect(res.type).toBe("application/json")
       expect(res.body.name).toBe("Ingredient A")

    })

    it("POST Already Exist /api/ingredients", async () => {
        const payload = {
            name: "Salt"
        }
        const res = await supertest(server).post("/api/ingredients").send(payload).set('Authorization', `${token}`)        
        expect(res.statusCode).toBe(409)        
 
     })

    it("Delete /ingredients/:id", async () => {
        
        const res = await supertest(server).delete("/api/ingredients/3").set('Authorization', `${token}`)
        expect(res.statusCode).toBe(204)        
 
     })

     it("Delete NotFound /api/ingredients/:id", async () => {
        
        const res = await supertest(server).delete("/api/ingredients/20").set('Authorization', `${token}`)
        expect(res.statusCode).toBe(404)        
 
     })
})



describe("Unit integration tests", () => {

   

    let token;

    beforeAll((done) => {
    supertest(server)
        .post('/api/auth/login/')
        .send({
        name:"abc",
        email:"abc@gmail.com",
        password:"123"       
        })
        .end((err, response) => {
        token = response.body.token; // save the token!
        done();
        });
    });
    
    it("GET /api/units" , async () => {
        const res = await supertest(server).get("/api/units/").set('Authorization', `${token}`)
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe("application/json")
        expect(res.body).toHaveLength(13)
        expect(res.body[0]).not.toBe("")
    })

    it("POST /api/units", async () => {
       const payload = {
           name: "Unit A"
        }
       const res = await supertest(server).post("/api/units/").send(payload).set('Authorization', `${token}`)
       expect(res.statusCode).toBe(201)
       expect(res.type).toBe("application/json")
       expect(res.body.name).toBe("Unit A")

    })

    it("POST Already Exist /api/ingredients", async () => {
        const payload = {
            name: "Count"
        }
        const res = await supertest(server).post("/api/units/").send(payload).set('Authorization', `${token}`)        
        expect(res.statusCode).toBe(409)        
 
     })

    it("Delete /units/:id", async () => {
        
        const res = await supertest(server).delete("/api/units/3").set('Authorization', `${token}`)
        expect(res.statusCode).toBe(204)        
 
     })

     it("Delete NotFound /api/units/:id", async () => {
        
        const res = await supertest(server).delete("/api/units/20").set('Authorization', `${token}`)
        expect(res.statusCode).toBe(404)        
 
     })
})



describe("Recipes Integration tests", () => {
  
    let token;

    beforeAll((done) => {
    supertest(server)
        .post('/api/auth/login/')
        .send({
        name:"abc",
        email:"abc@gmail.com",
        password:"123"       
        })
        .end((err, response) => {
        token = response.body.token; // save the token!
        done();
        });
    });

    //jest.setTimeout(30000);
  

    it("GET /api/recipes/" , async () => {       
        const res = await supertest(server).get("/api/recipes/").set('Authorization', `${token}`)
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe("application/json")
        expect(res.body).toHaveLength(4)
        expect(res.body[0]).not.toBe("")
    })  

})