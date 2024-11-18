document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".content-section");
    const links = document.querySelectorAll(".nav-link");

    // Function to show the specified section and hide others
    function showSection(sectionId) {
        sections.forEach((section) => {
            if (section.id === sectionId) {
                section.classList.add("active");
                section.classList.remove("d-none"); // Show active section
            } else {
                section.classList.remove("active");
                section.classList.add("d-none"); // Hide non-active sections
            }
        });

        // Update the document title
        document.title = `${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} - Empower Ability Labs`;

        // Update the URL hash
        history.pushState({ section: sectionId }, document.title, `#${sectionId}`);
    }

    // Add event listeners to navigation links
    links.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const sectionId = link.getAttribute("data-section");
            if (sectionId) {
                showSection(sectionId);
            }
        });
    });

    // Handle browser back/forward navigation
    window.addEventListener("popstate", (event) => {
        if (event.state && event.state.section) {
            showSection(event.state.section);
        }
    });

    // Show the default section or the one specified in the URL hash
    const defaultSection = location.hash ? location.hash.substring(1) : "home";
    showSection(defaultSection);
});
