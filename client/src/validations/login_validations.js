export const loginValidation = (email,password)=>{
    const error={
        email:false,
        password:false
    }
    if(!email||!email.includes("@")){
        error.email=true
    }
    if(!password){
        error.password=true
    }
    return error

}