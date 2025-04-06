(() => {
  document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault() // Stop the default form submission behavior

    // Get form data
    const formData = new FormData(e.target) // e.target is the form itself
    const data = Object.fromEntries(formData.entries()) // Convert form data to an object

    try {
      // Send POST request to the server to register the user
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json() // Get the JSON response from the server

      if (res.ok) {
        alert("✅ Registration successful!")
        window.location.href = "login.html" // Redirect to login page after success
      } else {
        alert("❌ Error: " + (result.error || "Registration failed"))
      }
    } catch (err) {
      alert("❌ Network error")
    }
  })
})()
