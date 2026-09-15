import { Router } from "express";
import { userRegisterSchema } from "./user.schema";
import { USER_SERVICE } from "./user.service";

export const userRouter = Router();

//registrar usário
userRouter.post("/users/", async (req, res, next) => {
  try {
    const { email, password } = userRegisterSchema.parse(req.query);
    const user = await USER_SERVICE.registerUser(email, password);

    return res.status(201).json({user});
  } catch (err) {
    if(!(err instanceof Error)){ //TODO: buscar implicação de retornar erros não tipados dessa forma
      return res.status(500) 
    }
    if(err.message.includes("email")){
     return res.status(409).json({message:"Email já cadastrado"})
    }
    next(err);
  }
});

//logar o usuário (criar sessão)
userRouter.post("/sessions/",async(req,res,next)=>{
  try{
    const { email, password } = userRegisterSchema.parse(req.query);
    const sessionId = USER_SERVICE.loginUser(email,password)
    return res.cookie("session_id",sessionId,{httpOnly:true,sameSite:"lax",secure:true}).status(201)
  }catch(err){
    next(err)
  }
})
