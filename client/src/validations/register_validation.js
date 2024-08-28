export const registerValidations =(name,email,password)=>{
    const error={
        email:false,
        password:false,
        name:false
    }
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
        error.email = true;
    }
    if(!password ||password.length<6){
        error.password=true
    }
    if(!name ||name.length<4){
        error.name=true
    }
    return error
}