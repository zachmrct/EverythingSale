/* global Swal */

document.addEventListener('DOMContentLoaded', function(){
    //add buttons
    const addButton = document.getElementById('openModalBtn');
    const addModal = document.getElementById('collectionModal');
    const closeAddModal = document.getElementById('closeModalBtn');

    //edit buttons
    const editButtons = document.querySelectorAll('.edit-button');
    const editModal = document.getElementById('editModal');
    const editCollectionId = document.getElementById('editCollectionId');
    const editCollectionName = document.getElementById('editCollectionName');
    const editCollectionCategory = document.getElementById('editCollectionCategory');
    const cancelEditBtn = document.getElementById('closeModalButton');

    //delete buttons
    const deleteButtons = document.querySelectorAll('.delete-button');
    const deleteConfirmationModal = document.getElementById('deleteConfirmationModal');
    const deleteItemName = document.getElementById('deleteItemName');
    const deletePicture = document.getElementById('delete-picture');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

    //category filter buttons
    const categoryItems = document.querySelectorAll('.category-item');
    const collectionItems = document.querySelectorAll('.collection-item');

    //new collection values
    const newCollectionName = document.getElementById('newCollectionName');
    const newCollectionCategory = document.getElementById('newCollectionCategory');
    
    //collection card values
    const stopPropagationButtons = document.querySelectorAll('.edit-button, .delete-button');
    collectionItems.forEach(item => {
        item.addEventListener('click', function () {
            // Log the clicked item and its data-id
            console.log("Collection item clicked:", item);
            console.log("Collection ID:", item.getAttribute('data-id'));

            // Redirect to the collection page
            window.location.href = "/products/" + item.getAttribute('data-id');
        });
    });

    stopPropagationButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.stopPropagation();  // Prevents the collection item click from firing
        });
    });

    // Add click event listeners to add button
    addButton.addEventListener('click', () => {
        // Show the add modal
        addModal.classList.remove('hidden');
    });

    // Close the addModal when the user clicks 'X'
    closeAddModal.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default anchor behavior
        // Hide the add modal
        addModal.classList.add('hidden');
    });

    // Close the addModal when the user clicks outside the container
    window.addEventListener('click', (event) => {
        // Check if the click was outside the modal content
        if (event.target === addModal) {
            addModal.classList.add('hidden'); // Hide the modal
        }
    });

    // Submitting new Collection
    document.getElementById('addModalSubmitBtn').addEventListener('click', () => {
        //event.preventDefault(); // Prevent the default form submission

        // Get values from input fields
        const collectionCategory = newCollectionCategory.value;
        const collectionName = newCollectionName.value;
        // Basic validation
        if (!collectionName || !collectionCategory) {
            alert("Please fill out all fields.");
            return;
        }

        // Hide the modal
        addModal.classList.add('hidden');

        alert("Collection Added.");

    });



    // Add click event listener for the cancel button
    cancelEditBtn.addEventListener('click', () => {
        // Hide the edit confirmation modal
        editModal.classList.add('hidden');
    });

    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Show the edit modal
            editModal.classList.remove('hidden');
            event.preventDefault();
            // Populate the modal with relevant data (if needed)
            const collectionId = button.getAttribute('data-id');
            const collectionName = button.getAttribute('data-name');
            const collectionCategory = button.getAttribute('data-category');

            // Update the modal with the collection name
            editCollectionId.value = collectionId;
            editCollectionName.value = collectionName;
            editCollectionCategory.value = collectionCategory;
        });
    });
    // Add click event listener for the confirm edit button
    
    document.getElementById('editCollectionPicture').addEventListener('change', function(event) {
        const file = event.target.files[0];
        const placeholder = document.getElementById('editCollectionImagePlaceholder');
        
        if (file) {
            const reader = new FileReader();
            
            // When file is loaded, set the image as the label background
            reader.onload = function(e) {
                placeholder.innerHTML = `<img src="${e.target.result}" class="h-full w-auto object-contain rounded-xl" alt="Uploaded Image">`;
            };
            reader.readAsDataURL(file); // Read the image file as DataURL
        } else {
            // If no file is selected, reset to the placeholder text
            placeholder.textContent = "Click to Upload Image";
        }
    });

    document.getElementById('imageInput').addEventListener('change', function(event) {
        const file = event.target.files[0];
        const placeholder = document.getElementById('addCollectionImagePlaceholder');
        
        if (file) {
            const reader = new FileReader();
            
            // When file is loaded, set the image as the label background
            reader.onload = function(e) {
                placeholder.innerHTML = `<img src="${e.target.result}" class="h-full w-auto object-contain rounded-xl" alt="Uploaded Image">`;
            };
            reader.readAsDataURL(file); // Read the image file as DataURL
        } else {
            // If no file is selected, reset to the placeholder text
            placeholder.textContent = "Click to Upload Image";
        }
    });

    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();  // Prevent the default anchor behavior

            // Use 'event.currentTarget' to refer to the clicked delete button
            const collectionName = event.currentTarget.getAttribute('data-name');
            const collectionPicture = event.currentTarget.getAttribute('data-picture');

            // Update the modal with the collection name and picture
            deleteItemName.textContent = collectionName;
            deletePicture.src = "/uploads/collections/" + collectionPicture;

            // Show the delete confirmation modal
            deleteConfirmationModal.classList.remove('hidden');
        });
    });

    // Add click event listener for the cancel button
    cancelDeleteBtn.addEventListener('click', () => {
        // Hide the delete confirmation modal
        deleteConfirmationModal.classList.add('hidden');
    });

// Add click event listener for the confirm delete button
    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    // Show a confirmation prompt with SweetAlert2
    Swal.fire({
        title: 'Are you sure?',
        text: 'This will also delete all products associated with this collection. Please type DELETE to confirm.',
        icon: 'warning',
        input: 'text',  // Ask the user to type DELETE
        inputPlaceholder: 'Type DELETE to confirm',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        preConfirm: (inputValue) => {
            // Ensure that the user typed 'DELETE'
            if (inputValue !== 'DELETE') {
                Swal.showValidationMessage('You need to type DELETE to confirm deletion');
                return false;
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // User confirmed, proceed with deletion
            const idToDelete = document.querySelector('.delete-button[data-name="' + deleteItemName.textContent + '"]').getAttribute('data-id');
            
            console.log("Deleting collection with ID:", idToDelete);  // Log the ID for debugging

            // Send a POST request to delete the collection and products
            fetch('/delete-collection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ collectionId: idToDelete })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Collection and products deleted successfully.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.value) {
                            window.location.reload();  // Reload the page to update the view
                        }
                    });
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to delete collection.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'An error occurred while deleting the collection.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });

            deleteConfirmationModal.classList.add('hidden');
        }
    });
});

    // Dropdown functionality
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the event from bubbling up to the document
            const dropdownMenu = this.nextElementSibling;
            dropdownMenu.classList.toggle('hidden'); // Toggle the dropdown menu visibility
        });
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.add('hidden'); // Hide all dropdown menus
        });
    });

    // Function to filter collections by category
    function filterCollections(category) {
        collectionItems.forEach(collection => {
            const collectionCategory = collection.getAttribute('data-category');
            
            if (category === 'All' || collectionCategory === category) {
                collection.style.display = 'block';  // Show collection
            } else {
                collection.style.display = 'none';   // Hide collection
            }
        });
    }

    // Add event listeners to each category item
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const selectedCategory = this.getAttribute('data-category');

            // Remove 'active' class from all category items
            categoryItems.forEach(cat => cat.classList.remove('active'));
            
            // Add 'active' class to the clicked category
            this.classList.add('active');

            // Filter the collections based on the selected category
            filterCollections(selectedCategory);
        });
    });

    // Initial filtering (show all collections)
    filterCollections('All');
    
});
    