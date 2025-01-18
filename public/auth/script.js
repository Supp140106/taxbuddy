const container = document.getElementById("container");
const registerbtn = document.getElementById("register");
const loginbtn = document.getElementById("login");


async function postFormData(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include", // Ensures cookies are included in the request
    });

    // Check if the response is a redirect
    if (response.redirected) {
      // Manually redirect the browser
      window.location.href = response.url;
      return;
    }

    // Parse the JSON response if not redirected
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
}





registerbtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginbtn.addEventListener("click", () => {
  container.classList.remove("active");
});

let sendotp = document.getElementById("send-otp");

sendotp.addEventListener("click", async (e) => {
  e.preventDefault();
  const emailInput = document.getElementById("email").value.trim();
  const nameValue = document.getElementById("sname").value.trim();
  const phoneValue = document.getElementById("sphone").value.trim();
  const passwordValue = document.getElementById("spassword").value.trim();

  const otpContainer = document.getElementById("otp-container");

  let playload = {
    email: emailInput,
    fullname: nameValue,
    password: passwordValue,
    mobile: phoneValue,
  };

  if (!nameValue || !phoneValue || !passwordValue) {
    alert("All fields are Not filled!");
    return;
  }

  if (!otpContainer.innerHTML) {
    otpContainer.innerHTML = `
      <input type="text" id="otp-input" placeholder="Enter OTP" />
      <button id="verify-otp">Verify OTP</button>
    `;
    otpContainer.style.display = "block";

    try {
      const response = await fetch("/otp/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playload),
      });

      

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json(); // Possible source of the error
      alert(`${responseData.message} go to Sign in`);
      

      
    } catch (error) {
      console.error("Detailed error:", error); // Logs detailed error for debugging
      alert(
        "An error occurred while sending the OTP. Please check the console."
      );
    }

    document.getElementById("verify-otp").addEventListener("click", (e) => {
      e.preventDefault();
    
      const emailInput = document.getElementById("email").value.trim();
      const nameValue = document.getElementById("sname").value.trim();
      const phoneValue = document.getElementById("sphone").value.trim();
      const passwordValue = document.getElementById("spassword").value.trim();
       
      let playload = {
        email: emailInput,
        fullname: nameValue,
        password: passwordValue,
        mobile: phoneValue, // Updated to `mobile`
      };
    
      let otpnumber = document.getElementById("otp-input").value.trim();
      if (!otpnumber) {
        alert("Enter the OTP");
      } else {
        playload.otp = otpnumber;
        fetch("/otp/verify-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(playload),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (response.redirected) {
              // Manually redirect the browser
              window.location.href = response.url;
              return;
            }
            return response.json();
          })
          .then((responseData) => {
            console.log(responseData);
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("OTP verification failed. Please try again.");
          });
      }
    });
    
  }
});


let signin = document.getElementById("signin")
signin.addEventListener("click",async (e)=>{
  e.preventDefault();
  let emailormobile = document.getElementById("lemail").value.trim();
  let password = document.getElementById("lpassword").value.trim();

  if(emailormobile == 0 || password == 0) alert("Please Enter the your email or password");
  else {
    const loginData = {
      emailormobile : emailormobile,
      password: password
    };
    try {
      const response = await postFormData("/auth/login", loginData);
      alert(response.msg); // Handle response if not redirected
    } catch (error) {
      console.error("Login failed:", error);
    }
  }
})
