/* global Swal */
/* global all_usernames */

document.addEventListener('DOMContentLoaded', () => {
    const filtered_usernames = filterUsernames();
    const viewProfileModal = document.getElementById("viewProfile");
    const editProfileModal = document.getElementById("editProfile");
    const editModeButton = document.getElementById("editModeButton");
    const cancelEdit = document.getElementById("cancelEdit");
    const changePassword = document.getElementById('password');
    const deleteUserButton = document.getElementById('deleteUserBtn');

    function filterUsernames () {
        let usernames = [];
        const username = document.getElementById('username').value;

        for (let i = 0; i < all_usernames.length; i++){
            if (username !== all_usernames[i].username){
                usernames.push(all_usernames[i].username);
            }
        }

        return usernames;
    }

    editModeButton.addEventListener('click', () => {
        // Hide the viewProfile modal
        viewProfileModal.classList.add('hidden');
        
        // Show the editProfile modal by removing the hidden class
        editProfileModal.classList.remove('hidden');

        const userid = document.getElementById('editUserId').getAttribute('data-id');
        document.getElementById('editUserId').value = userid;
    });
    
    cancelEdit.addEventListener('click', (e) => {
         e.preventDefault();
        // Hide the viewProfile modal
        editProfileModal.classList.add('hidden');
        
        // Show the editProfile modal by removing the hidden class
        viewProfileModal.classList.remove('hidden');
    });

    changePassword.addEventListener('click', (e) => {
        e.preventDefault();        
        document.getElementById('editPasswordModal').classList.remove('hidden');
    });

    document.getElementById('closeEditPasswordModal').addEventListener('click', () => {
        document.getElementById('editPasswordModal').classList.add('hidden');
        document.getElementById('oldPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('newPasswordFinal').value = '';
    });

    document.getElementById('toggleIconOldPassword').addEventListener('click', () => togglePasswordVisibility('oldPassword'));
    document.getElementById('toggleIconNewPassword').addEventListener('click', () => togglePasswordVisibility('newPassword'));
    document.getElementById('toggleIconNewPasswordFinal').addEventListener('click', () => togglePasswordVisibility('newPasswordFinal'));

    function togglePasswordVisibility (variant) {
        let passwordField;
        let toggleIcon;

        switch (variant){
            case 'oldPassword': {
                passwordField = document.getElementById('oldPassword');
                toggleIcon = document.getElementById('toggleIconOldPassword');
                break;
            } 
            case 'newPassword': {
                passwordField = document.getElementById('newPassword');
                toggleIcon = document.getElementById('toggleIconNewPassword');
                break;
            } 
            case 'newPasswordFinal': {
                passwordField = document.getElementById('newPasswordFinal');
                toggleIcon = document.getElementById('toggleIconNewPasswordFinal');
                break;
            } 
        }

        if (passwordField.type === "password") {
            passwordField.type = "text";
            toggleIcon.textContent = "🙈"; // Change icon to indicate "Hide"
        } else {
            passwordField.type = "password";
            toggleIcon.textContent = "👁️"; // Change icon to indicate "Show"
        }
    }

    document.getElementById('changePasswordButton').addEventListener('click', () => {
        // Check if old password matches
        const oldPassword1 = document.getElementById('password').value;
        const oldPassword2 = document.getElementById('oldPassword').value;
        const regex1 = /^\s+$/;
        const regex2 = /^$/;

        if (oldPassword1 !== oldPassword2) {
            Swal.fire({
                icon: "error",
                title: "Old Password Does Not Match",
                text: "Please try again!"
            });
            return; // Exit the function
        }

        // Check if the new password matches with the re-entered password
        const newPassword = document.getElementById('newPassword').value;
        const newPasswordFinal = document.getElementById('newPasswordFinal').value;

        if (newPassword !== newPasswordFinal) {
            Swal.fire({
                icon: "error",
                title: "Passwords Do Not Match",
                text: "Please ensure the new password fields match!"
            });
            return; // Exit the function
        } 

        console.log(newPassword);

        if (regex1.test(newPassword) || regex2.test(newPassword)){
            Swal.fire({
                icon: "error",
                title: "Empty Password",
                text: "Try Again!"
            });
            return; // Exit the function
        }

        document.getElementById('password').value = newPasswordFinal;

        // Proceed with password change logic here
        Swal.fire({
            icon: "success",
            title: "Success!",
            text: "You may proceed."
        }).then(() => {
            document.getElementById('editPasswordModal').classList.add('hidden');
            document.getElementById('oldPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('newPasswordFinal').value = '';
        });
    });


    // submit edit form
    document.getElementById('submitEdit').addEventListener('click', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const firstname = document.getElementById('firstname').value;
        const lastname = document.getElementById('lastname').value;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const lettersRegex = /^[a-zA-Z\s]+$/;

        // Check for duplicate usernames
        for (let i = 0; i < filtered_usernames.length; i++) {
            if (username === filtered_usernames[i]) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Duplicate username! Please try again."
                });
                return;
            }
        }

        // Check email validity
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Invalid Email Format! Please try again."
            });
            return;
        }

        // Check firstname validity
        if (!lettersRegex.test(firstname)) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Invalid Firstname! Please try again."
            });
            return;
        }

        // Check lastname validity
        if (!lettersRegex.test(lastname)) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Invalid Lastname! Please try again."
            });
            return;
        }

        // If no issues, submit the form
        document.getElementById('editProfileForm').submit();
    });


    const profilePictureInput = document.getElementById('profilePicture');
    const label = document.querySelector('label[for="profilePicture"]');

    profilePictureInput.addEventListener('change', (event) => {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                // Create an <img> element and set it as the label's content
                label.innerHTML = `<img src="${e.target.result}" alt="Uploaded Profile Picture" class="w-[300px] h-[300px] rounded-full object-cover"/>`;
            };

            reader.readAsDataURL(file); // Read the file to generate a data URL
        } else {
            label.innerHTML = '<span class="pl-[2px] text-gray-500 text-xs">Upload Image</span>'; // Reset to default
        }
    });

    deleteUserButton.addEventListener('click', async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Delete Account',
            html: `
                <p>Type your username and password to confirm deletion:</p>
                <input id="deleteUsername" type="text" class="swal2-input" placeholder="Username">
                <input id="deletePassword" type="password" class="swal2-input" placeholder="Password" required>
            `,
            focusConfirm: false,
            preConfirm: () => {
                const username = document.getElementById('deleteUsername').value;
                const password = document.getElementById('deletePassword').value;
    
                // Ensure both fields are not empty
                if (!username || !password) {
                    Swal.showValidationMessage('Both fields are required');
                }
    
                return { username, password };
            },
        });
    
        if (formValues) {
            // Send DELETE request to the server
            const response = await fetch('/delete-user', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValues),
            });
    
            if (response.ok) {
                Swal.fire('Deleted!', 'Your account has been deleted.', 'success').then(() => {
                    window.location.href = '/logout'; // Redirect to logout or home
                });
            } else {
                const error = await response.json();
                Swal.fire('Error', error.message || 'Failed to delete account.', 'error');
            }
        }
    });
    
});