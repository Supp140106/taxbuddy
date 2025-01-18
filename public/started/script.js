// Function to create a star at the mouse position
let account = document.getElementById("account");
let login = document.getElementById("login");


let cook = document.cookie.split(";")
console.log(cook)
let username;

for (let index = 0; index < cook.length; index++) {
    const element = cook[index];
    
    let t = element.split("=");
    
    if (t[0].trim() == "name") {
        
        login.style.display = "none";
        account.style.display = "block"
        username = t[1]
        username = username.split("%20")

    }
}
let user = document.getElementById("nameofuser")
let t= "";
username.forEach((value)=>{
    t = t + `${value} `
})

user.innerText = "User";
if(username) user.innerText = t











