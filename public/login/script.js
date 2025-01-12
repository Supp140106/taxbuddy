const submit = document.getElementById("login"); // Make sure the ID matches your HTML


async function postFormData(url, data) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      // Check if the response is ok (status 200-299)
      if (!response.ok) {
        const errorDetails = await response.text(); // Log error details
        throw new Error(`Network response was not ok: ${errorDetails}`);
      }
  
      // Parse the JSON response
      const jsonResponse = await response.json();
      return jsonResponse;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    }
  }

submit.addEventListener("click", async (e) => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Check if both fields are filled
  if (email === "" || password === "") {
    // Prevent form submission
    e.preventDefault(); // Use the correct event object name
    alert("Please fill in both email and password.");
  } else {
    // Create an object with the email and password
    const loginData = {
      emailormobile: email,
      password: password,
    };

    


  }
});
