export const groupValidation=(name)=>{
    const err={
        check:false,
        type:''
    }
if(!name){
    err.type= 'name is required!'
    err.check=true;

}
else if(name.length>20||name.length<4){
    err.type='name must be between 4-16 symbols'
    err.check=true;
}
return err
}