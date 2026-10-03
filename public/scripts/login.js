

document.addEventListener('DOMContentLoaded', ()=> {
  // JavaScript
  document.getElementById("toggleIcon").addEventListener("click", togglePasswordVisibility);

  function togglePasswordVisibility() {
    console.log('clicked');
    const passwordField = document.getElementById("password");
    const toggleIcon = document.getElementById("toggleIcon");
    
    if (passwordField.type === "password") {
      passwordField.type = "text";
      toggleIcon.textContent = "🙈"; // Change icon to indicate "Hide"
    } else {
      passwordField.type = "password";
      toggleIcon.textContent = "👁️"; // Change icon to indicate "Show"
    }
  }

});
    

