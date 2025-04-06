(() => {
  document.querySelector('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault()
  
    const data = new FormData(e.target)
    const formData = Object.fromEntries(data.entries())
  
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
  
      const result = await response.json()
  
      if (response.ok) {
        alert('✅ Login successful!')
        window.location.href = 'index.html' // Redirect to home after login
      } else {
        alert('❌ Error: ' + (result.error || 'Login failed'))
      }
    } catch (error) {
      alert('❌ Network error')
    }
  })
})()