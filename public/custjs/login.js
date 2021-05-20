function logSub(){
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#yourPassword").value;

    if(!email||!password){
        alert("فیلد ها را پر کنید - Fill the inpits");
        return false;
    }
    
    const user ={
        email,password
    }

    axios.post("http://localhost:3000/api/user/login",user)
    .then(({data,headers})=>{
        localStorage.setItem("token",headers['x-auth-token']);
        alert("Log in successfully - ورود  با موفقیت");
    }).catch((err)=>{
        alert(err.response.data.message);
    })
    return false;

}











function regSub(){
    const email = document.querySelector("#emailAddress").value;
    const name= document.querySelector("#fullName").value;
    const password = document.querySelector("#password1").value;
    const check = document.querySelector("#c1").checked;

    if(!email||!name||!password||!check){
        alert("فیلد ها را پر کنید - Fill the inputs");
        return false;
    }
    if(!check){
        alert("تیک را بزنید - Check the checkbox");
        return false;
    }
    if(password.length<8){
        alert("پسورد باید بیشتر از 8 کارکتر باشد");
        return false;
    }
    const user ={
        email,password,name
    }
    axios.post("http://localhost:3000/api/user/register",user)
    .then(({data,headers})=>{
        localStorage.setItem("token",headers['x-auth-token']);
        alert("Signed up successfully - ثبت نام با موفقیت");
    }).catch((err)=>{
        alert(err.response.data.message);
    });
    return false;

    
}

