/* global Swal */
document.addEventListener('DOMContentLoaded', function(){

        //add buttons
        const addButton = document.getElementById('openModalBtn');
        const addModal = document.getElementById('productModal');
        const closeAddModal = document.getElementById('closeModalBtn');
        const newProductName = document.getElementById('newProductName');
        const newProductCost = document.getElementById('newProductCost');
        const newProductStock = document.getElementById('newProductStock');
        const newProductMaterial = document.getElementById('newProductMaterial');
        const newProductColor = document.getElementById('newProductColor');
        const newProductCollection = document.getElementById('newProductCollection');
        const newProductCategory = document.getElementById('newProductCategory');
        const newProductStatus = document.getElementById('newProductStatus');


        //edit buttons
        const editButtons = document.querySelectorAll('.edit-button');
        const editModal = document.getElementById('editProductModal');
        const closeEditModal = document.getElementById('closeEditModalBtn');
        const editProductName = document.getElementById('editProductName');
        const editProductCost = document.getElementById('editProductCost');
        const editProductStock = document.getElementById('editProductStock');
        const editProductMaterial = document.getElementById('editProductMaterial');
        const editProductColor = document.getElementById('editProductColor');
        const editProductCategory = document.getElementById('editProductCategory');
        const editProductStatus = document.getElementById("editProductStatus");
        const editId = document.getElementById('editId');
        const editProductCollection = document.getElementById("editProductCollection");
        const editModalSubmitBtn = document.getElementById("editModalSubmitBtn");
        //delete buttons
        const deleteButtons = document.querySelectorAll('.delete-button');
        const deleteConfirmationModal = document.getElementById('deleteConfirmationModal');
        const deleteId = document.getElementById('deleteId');
        const deleteName = document.getElementById('deleteName');
        const deletePicture = document.getElementById('deletePicture');
        const deletePrice = document.getElementById('deletePrice');
        const deleteStock = document.getElementById('deleteStock');
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

        //category filters
        const categoryItems = document.querySelectorAll("#categoryMenu .category-item");
        const productCards = document.querySelectorAll("#productContainer .container");
        const searchBar = document.getElementById("searchBar");

        // filter Modal Toggle
        const filterButton = document.getElementById("filterButton");
        const filterModal = document.getElementById("filterModal");
        const closeModalButton = document.getElementById("closeModalButton");

        //price filter
        const minPriceSlider = document.getElementById('minPrice');
        const maxPriceSlider = document.getElementById('maxPrice');
        const minPriceValueDisplay = document.getElementById('minPriceValue');
        const maxPriceValueDisplay = document.getElementById('maxPriceValue');

        // Add click event listeners to add button
        addButton.addEventListener('click', () => {
            // Show the add modal
            addModal.classList.remove('hidden');
        });

        // Close the addModal when the user clicks 'X'
        closeAddModal.addEventListener('click', () => {
            event.preventDefault(); // Prevent the default anchor behavior
            const form = document.getElementById('productModal');
            // Reset all input fields
            form.reset();
            // Hide the add modal
            addModal.classList.add('hidden');
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

        document.getElementById('addModalSubmitBtn').addEventListener('click', () => {
            //event.preventDefault(); // Prevent the default form submission
            const form = document.getElementById('productModal');
            // Get values from input fields
            
            // Basic validation
            if (!newProductName.value || !newProductCost.value || !newProductStock.value || !newProductMaterial.value
                || !newProductColor.value || !newProductCollection.value || !newProductCategory.value || !newProductStatus.value) {
                alert("Please fill out all fields.");
                
                // Reset all input fields
                form.reset();
                return;
            }
            
            if (!newProductCost.value || isNaN(newProductCost.value) || !newProductStock.value || isNaN(newProductStock.value) || newProductStock.value < 0 || newProductCost.value < 0) {
                alert("Product Cost and Stock should be a valid number.");
                form.reset();
                return;
            }

            if (!newProductName.value || newProductName.value.length > 100) {
                alert("Product Name should not include more than 100 characters.");
                form.reset();
                return;
            }

            // Hide the modal
            addModal.classList.add('hidden');
    
            alert("Product Added.");
    
        });

        editModalSubmitBtn.addEventListener('click', (e) => {
            
            // Get values from input fields
            
            // Basic validation
            if (!editProductName.value || !editProductCost.value || !editProductStock.value || !editProductMaterial.value
                || !editProductColor.value || !editProductCollection.value || !editProductCategory.value || !editProductStatus.value) {
                alert("Please fill out all fields.");
                e.preventDefault();
                editModal.classList.add('hidden');
                return;
            }
            
            if (!editProductCost.value || isNaN(editProductCost.value) || !editProductStock.value || isNaN(editProductStock.value) || editProductStock.value < 0 || editProductCost.value < 0) {
                alert("Product Cost and Stock should be a valid number.");
                e.preventDefault();
                editModal.classList.add('hidden'); 
                return;
            }

            if (!editProductName.value || editProductName.value.length > 100) {
                alert("Product Name should not include more than 100 characters.");
                e.preventDefault();
                editModal.classList.add('hidden');
                return;
            }

            // Hide the modal
            editModal.classList.add('hidden');
    
            alert("Product Added.");
    
        });

        document.getElementById('imageInput').addEventListener('change', function(event) {
            const file = event.target.files[0];
            const placeholder = document.getElementById('addProductImagePlaceholder');
            
            if (file) {
                const reader = new FileReader();
                
                // When file is loaded, set the image as the label background
                reader.onload = function(e) {
                    placeholder.innerHTML = `<img src="${e.target.result}" class="h-[250px] w-[250px] object-contain rounded-xl" alt="Uploaded Image">`;
                };
                reader.readAsDataURL(file); // Read the image file as DataURL
            } else {
                // If no file is selected, reset to the placeholder text
                placeholder.textContent = "Click to Upload Image";
            }
        });

        // Add click event listener for the cancel button
        closeEditModal.addEventListener('click', (e) => {
            // Hide the edit confirmation modal
            e.preventDefault();
            editModal.classList.add('hidden');
        });

        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Show the edit modal
                editModal.classList.remove('hidden');
                editProductName.value = button.getAttribute('data-name');
                editProductCost.value = button.getAttribute("data-price");
                editProductStock.value = button.getAttribute("data-stock");
                editProductMaterial.value = button.getAttribute("data-materials");
                editProductCategory.value = button.getAttribute("data-category");
                editProductCollection.value = button.getAttribute("data-collection-id");

                editProductStatus.value = button.getAttribute("data-status");
                editProductColor.value = button.getAttribute("data-color");
                editId.value = button.getAttribute("data-id");
                const placeholder = document.getElementById('editProductImagePlaceholder');
                placeholder.innerHTML = `<img src="${button.getAttribute("data-picture")}" class="h-[250px] w-[250px] object-contain rounded-xl" alt="Uploaded Image">`;


                let sizes = button.getAttribute("data-size");

                // Assuming sizes is a comma-separated string, split it into an array
                sizes = sizes.split(',');

                for (let i = 0; i < sizes.length; i++) {
                    const size = sizes[i].trim(); // Trim whitespace
                    if (size === 'XS') {
                        document.getElementById('edit-extra-small').checked = true;
                    } else if (size === 'S') {
                        document.getElementById('edit-small').checked = true;
                    } else if (size === 'M') {
                        document.getElementById('edit-medium').checked = true;
                    } else if (size === 'L') {
                        document.getElementById('edit-large').checked = true;
                    } else if (size === 'XL') {
                        document.getElementById('edit-extra-large').checked = true;
                    }
                }

            });
        });


        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Show the edit modal
                deleteConfirmationModal.classList.remove('hidden');
                deletePicture.src = button.getAttribute('data-picture');
                deleteName.textContent = button.getAttribute('data-name');
                deletePrice.textContent = "₱" + button.getAttribute('data-price');
                deleteStock.textContent = button.getAttribute('data-stock') + " in stock";
                deleteId.value = button.getAttribute('data-id');
            });
        });

        //delete products
    confirmDeleteBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Show SweetAlert confirmation dialog
        Swal.fire({
            title: 'Are you sure?',
            text: "This action will delete the product!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Proceed with delete if confirmed
                const deleteIdValue = deleteId.value; // ID of the product to delete

                fetch(`/delete-product?deleteId=${deleteIdValue}&deleteAssociations=true`, {
                    method: 'DELETE',
                })
                .then(response => {
                    if (response.ok) {
                        return response.text(); // handle response from backend
                    } else {
                        throw new Error('Delete operation failed');
                    }
                })
                .then(message => {
                    Swal.fire(
                        'Deleted!',
                        message,
                        'success'
                    );
                    deleteConfirmationModal.classList.add('hidden');
                    document.querySelector(`[data-id="${deleteIdValue}"]`).remove(); // Remove deleted item from DOM
                })
                .catch(error => {
                    Swal.fire(
                        'Error!',
                        'There was an error deleting the product.',
                        'error'
                    );
                    console.error('Error:', error);
                });
            }
        });
        deleteConfirmationModal.classList.add('hidden');
    });


        // Add click event listener for the cancel button
        cancelDeleteBtn.addEventListener('click', (e) => {
            // Hide the edit confirmation modal
            e.preventDefault();
            deleteConfirmationModal.classList.add('hidden');
        });
        //image placeholder for edit modal
        document.getElementById('imageEditInput').addEventListener('change', function(event) {
            const file = event.target.files[0];
            const placeholder = document.getElementById('editProductImagePlaceholder');
            
            if (file) {
                const reader = new FileReader();
                
                // When file is loaded, set the image as the label background
                reader.onload = function(e) {
                    placeholder.innerHTML = `<img src="${e.target.result}" class="h-full w-full object-contain rounded-xl" alt="Uploaded Image">`;

                };
                reader.readAsDataURL(file); // Read the image file as DataURL
            } else {
                // If no file is selected, reset to the placeholder text
                placeholder.textContent = "Click to Upload Image";
            }
        });

        // Close the modals when the user clicks outside the container
        window.addEventListener('click', (event) => {
            // Check if the click was outside the modal content
            if (event.target === addModal) {
                addModal.classList.add('hidden'); // Hide the modal
            }
            if (event.target === editModal) {
                editModal.classList.add('hidden'); // Hide the modal
            }
            if (event.target === deleteConfirmationModal) {
                deleteConfirmationModal.classList.add('hidden'); // Hide the modal
            }
        });

    function filterProducts() {
        const selectedCategory = document.querySelector('.category-item.active').getAttribute('data-category');
        const searchTerm = searchBar.value.toLowerCase();
        const sortOrder = document.getElementById('sortByName').value;

        const minPrice = parseFloat(document.getElementById('minPrice').value) || 0; // Default to 0 if NaN
        const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity; // Default to Infinity if NaN
        const minStock = parseInt(document.getElementById('minStock').value) || 0; // Default to 0 if NaN
        const maxStock = parseInt(document.getElementById('maxStock').value) || Infinity; // Default to Infinity if NaN
        // Filter products by category and search term
        let filteredCards = Array.from(productCards).filter(card => {
            const cardCategory = card.getAttribute('data-category');
            const productName = card.getAttribute('data-name').toLowerCase();
            const productPrice = parseFloat(card.getAttribute('data-price')); // Get the price of the product
            const productStock = parseFloat(card.getAttribute('data-stock')); // Get the price of the product

            const matchesCategory = selectedCategory === "All" || cardCategory === selectedCategory;
            const matchesSearch = productName.includes(searchTerm);
            const matchesPriceRange = productPrice >= minPrice && productPrice <= maxPrice;
            const matchesStockRange = productStock >= minStock && productStock <= maxStock;
            return matchesCategory && matchesSearch  && matchesPriceRange && matchesStockRange;
        });

        // Sort products by name if a sort order is selected
        if (sortOrder) {
            filteredCards.sort((a, b) => {
                const nameA = a.getAttribute('data-name').toLowerCase();
                const nameB = b.getAttribute('data-name').toLowerCase();
                if (sortOrder === "asc") {
                    return nameA.localeCompare(nameB);
                } else {
                    return nameB.localeCompare(nameA);
                }
            });
        }

        // Update the display based on filters and sorting
        productCards.forEach(card => card.style.display = 'none'); // Hide all
        filteredCards.forEach(card => card.style.display = 'block'); // Show filtered
        const productContainer = document.getElementById('productContainer');
        productContainer.innerHTML = ""; // Clear the current grid

        // Loop through filtered and sorted cards and re-render each
        filteredCards.forEach(card => {
            productContainer.appendChild(card);
        });
    }

    // Event listeners to update the displayed values when the sliders are moved
    minPriceSlider.addEventListener('input', () => {
        minPriceValueDisplay.value = minPriceSlider.value;
        maxPriceSlider.min = minPriceSlider.value;
        filterProducts(); // Call the filter function when the slider value changes
    });

    maxPriceSlider.addEventListener('input', () => {
        maxPriceValueDisplay.value = maxPriceSlider.value;
        minPriceSlider.max = maxPriceSlider.value;
        filterProducts(); // Call the filter function when the slider value changes
    });
    document.getElementById('minStock').addEventListener('input', filterProducts);
    document.getElementById('maxStock').addEventListener('input', filterProducts);
    // Event listener for sort selection
    document.getElementById('sortByName').addEventListener('change', filterProducts);

    // Existing event listeners
    categoryItems.forEach(item => {
        item.addEventListener("click", () => {
            categoryItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            filterProducts();
        });
    });

    searchBar.addEventListener('input', filterProducts);
    filterButton.addEventListener("click", () => filterModal.classList.toggle("hidden"));
    closeModalButton.addEventListener("click", () => filterModal.classList.add("hidden"));

    filterModal.addEventListener("click", (event) => {
        if (event.target === filterModal) filterModal.classList.add("hidden");
    });

    // Set initial values for the display fields
    minPriceValueDisplay.value = minPriceSlider.value;
    maxPriceValueDisplay.value = maxPriceSlider.value;
});