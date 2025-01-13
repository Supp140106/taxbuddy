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



document.getElementById("submit").addEventListener("click", function (e) {
  e.preventDefault(); // Prevent default form submission

  // Get the form data
  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const password = document.getElementById("password").value.trim();

  // Validate the form inputs (optional but recommended)
  if (!fullname || !email || !mobile || !password) {
    alert("Please fill in all fields.");
    return;
  }

  // Create the data object to send to the backend
  const signupData = {
    fullname: fullname,
    email: email,
    phonenumber: mobile,
    password: password,
  };

  let a = postFormData("/auth/signup",signupData)
  
  // Send the data to the server via Fetch API

});
