const submit = document.getElementById("login"); // Ensure this matches your HTML ID

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

submit.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Check if both fields are filled
  if (email === "" || password === "") {
    alert("Please fill in both email and password.");
  } else {
    // Create an object with the email and password
    const loginData = {
      emailormobile: email,
      password: password,
    };
    try {
      const response = await postFormData("/auth/login", loginData);
      console.log(response); // Handle response if not redirected
    } catch (error) {
      console.error("Login failed:", error);
    }
  }
});
