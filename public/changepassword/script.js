async function postFormData(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.redirected) {
      window.location.href = response.url;
      return;
    }

    const responseText = await response.text();
    try {
      const jsonResponse = JSON.parse(responseText);
      return jsonResponse;
    } catch {
      console.error("Response is not valid JSON:", responseText);
      throw new Error("Invalid response format.");
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
}

function getOTP() {
  const otpInputs = document.querySelectorAll(".otp-group input");
  let otp = "";

  otpInputs.forEach((input) => {
    otp += input.value;
  });

  console.log("Entered OTP:", otp);
  return otp.toString();
}

async function sendOTP() {
  const email = document.getElementById("email").value.trim();
  if (!email) {
    alert("Please enter your email address.");
    return;
  }

  try {
    const result = await postFormData("/otp/send-otpchange", { email });
    alert(result.message);
  } catch (error) {
    alert("Failed to verify OTP. Please try again.");
  }
}

function moveToNext(current, nextFieldID) {
  if (current.value.length >= current.maxLength) {
    document.getElementById(nextFieldID).focus();
  }
}

let change = document.getElementById("change");
change.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const otp = getOTP();
  const password = document.getElementById("new-password").value.trim();
  const confirmPassword = document.getElementById("confirm-password").value.trim();

  if (!email || !otp || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const result = await postFormData("/otp/verify-changepassword", {
      email,
      otp,
      password,
    });
    console.log("Password change result:", result);
    if(result.message == "Invalid or expired OTP") {
      alert(result.message)
      return;
    }
    window.location.href = "/auth"

  } catch (error) {
    alert("Failed to change password. Please try again.");
  }
});
