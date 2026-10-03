/* global Swal */
/* global usernames*/

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
  
    document.getElementById('signUp').addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default form submission
    
      const username = document.getElementById('username').value;
      const number = document.getElementById("number").value;
      const email = document.getElementById("email").value;
      let isDuplicate = false; 
    
      // Check if the phone number is valid (example: 10 digits only)
      const phoneNumberRegex = /^\d{10}$/;
      if (!phoneNumberRegex.test(number)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Phone Number",
          text: "Please enter a valid 10-digit phone number."
        });
        return; // Stop further execution
      }
    
      // Check if the email address is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Email Address",
          text: "Please enter a valid email address."
        });
        return; // Stop further execution
      }
    
      // Check for duplicate username
      for (let i = 0; i < usernames.length; i++) {
        if (username === usernames[i].username) {
          isDuplicate = true;
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Duplicate username! Please try again."
          });
          break;
        }
      }
    
      if (!isDuplicate) {
        document.getElementById("signUpForm").submit();
      }
    });
  
  });