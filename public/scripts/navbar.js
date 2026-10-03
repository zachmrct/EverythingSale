/* global Swal */

document.addEventListener('DOMContentLoaded', () => {
    // Utility function to apply the effect on both div and label
    function applyClickEffect(container, label) {
        resetSections(); // Reset all sections first
        container.classList.remove('bg-transparent');
        container.classList.remove('hover:bg-white');
        label.classList.remove('group-hover:text-[#E98484]');
        label.classList.remove('text-white');

        container.classList.add('drop-shadow-md');
        container.classList.add('bg-white');
        label.classList.add('text-[#E98484]');
    }

    // Utility function to reset the styles for all sections
    function resetSections() {
        const sections = document.querySelectorAll('.group'); // Select all sections with class 'group'
        const labels = document.querySelectorAll('.group a'); // Select all labels within sections

        sections.forEach((section) => {
            section.classList.remove('bg-white', 'drop-shadow-md');
            section.classList.add('bg-transparent', 'hover:bg-white');
        });

        labels.forEach((label) => {
            label.classList.remove('text-[#E98484]');
            label.classList.add('text-white', 'group-hover:text-[#E98484]');
        });
    }

    // Function to add click event to both div and a tag
    function addDivClickHandler(divId, labelId) {
        const div = document.getElementById(divId);
        const label = document.getElementById(labelId);

        div.addEventListener('click', () => {
            applyClickEffect(div, label);
            label.click();  // Trigger the <a> click event
        });

        label.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the click from bubbling to the div
            applyClickEffect(div, label);
        });
    }

    // Apply to all sections
    addDivClickHandler('dashboard', 'dashboardLabel');
    addDivClickHandler('products', 'productsLabel');
    addDivClickHandler('collections', 'collectionsLabel');
    addDivClickHandler('users', 'usersLabel');
    addDivClickHandler('orders', 'ordersLabel')

    //closing and opening navbar
    const sidebar = document.getElementById("sidebar");
    const closeBtn = document.getElementById("closeBtn");
    const showSidebarBtn = document.getElementById("showSidebarBtn");

    // Function to hide the sidebar and show the pop-up button
    closeBtn.addEventListener("click", () => {
        sidebar.classList.add("hidden");
        showSidebarBtn.classList.remove("hidden");
    });

    // Function to show the sidebar and hide the pop-up button
    showSidebarBtn.addEventListener("click", () => {
        sidebar.classList.remove("hidden");
        showSidebarBtn.classList.add("hidden");
    });

    // swal notif log out
    document.getElementById('logoutLabel').addEventListener('click', (e) => {
        e.preventDefault();

        Swal.fire({
            icon: "success",
            title: "Logged Out",
            text: "Successfully Logged Out"
        }).then((result) => {
            if (result.isConfirmed){
                document.getElementById('logout').submit();
            }
        });
    });

});