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


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("scheduleForm");
    const notification = document.getElementById("notification");
    const inviteSpeakerCheckbox = document.getElementById("inviteSpeaker");
    const eventDescriptionGroup = document.getElementById("eventDescriptionGroup");
    const eventDescriptionInput = document.getElementById("eventDescription");
    const emailSwitch = document.getElementById("emailSwitch");
    const receiveEmailsCheckbox = document.getElementById("receiveEmails");
    const meetCommunityButton = document.getElementById("meetCommunity");
    const communityModal = document.getElementById("communityModal");
    const closeModalButton = document.getElementById("closeModal");
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

      // Open Modal
  meetCommunityButton.addEventListener("click", () => {
    communityModal.classList.remove("d-none");
    communityModal.setAttribute("aria-hidden", "false");
    communityModal.querySelector("button").focus();
  });

  // Close Modal
  closeModalButton.addEventListener("click", () => {
    communityModal.classList.add("d-none");
    communityModal.setAttribute("aria-hidden", "true");
    meetCommunityButton.focus();
  });

  // Close Modal on Escape Key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !communityModal.classList.contains("d-none")) {
      communityModal.classList.add("d-none");
      communityModal.setAttribute("aria-hidden", "true");
      meetCommunityButton.focus();
    }
  });

    // Open modal
  function openModal() {
    communityModal.classList.remove("d-none");
    communityModal.setAttribute("aria-hidden", "false");
    meetCommunityButton.setAttribute("aria-expanded", "true");
    closeModalButton.focus();
    document.addEventListener("keydown", trapFocus);
  }

  // Close modal
  function closeModal() {
    communityModal.classList.add("d-none");
    communityModal.setAttribute("aria-hidden", "true");
    meetCommunityButton.setAttribute("aria-expanded", "false");
    meetCommunityButton.focus();
    document.removeEventListener("keydown", trapFocus);
  }

  // Trap focus inside the modal
  function trapFocus(event) {
    const focusableElements = communityModal.querySelectorAll(focusableSelectors);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === "Tab") {
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
  
    // Handle click event on "Meet the Empower Community"
    meetCommunityButton.addEventListener("click", openModal);
  
    // Make "Meet the Empower Community" accessible via keyboard
    meetCommunityButton.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault(); // Prevent default scroll behavior for Space
        openModal();
      }
    });
  
    // Close the modal when clicking the Close button
    closeModalButton.addEventListener("click", closeModal);
  
    // Close the modal on Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !communityModal.classList.contains("d-none")) {
        closeModal();
      }
    });
  
    // Show/hide event description based on checkbox
    inviteSpeakerCheckbox.addEventListener("change", () => {
      if (inviteSpeakerCheckbox.checked) {
        eventDescriptionGroup.classList.remove("d-none");
        eventDescriptionInput.setAttribute("required", "true");
      } else {
        eventDescriptionGroup.classList.add("d-none");
        eventDescriptionInput.removeAttribute("required");
      }
    });
  
    // Make the slider toggle accessible via keyboard
    emailSwitch.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        receiveEmailsCheckbox.checked = !receiveEmailsCheckbox.checked;
        emailSwitch.setAttribute("aria-checked", receiveEmailsCheckbox.checked);
      }
    });
  
    emailSwitch.addEventListener("click", () => {
      emailSwitch.setAttribute("aria-checked", receiveEmailsCheckbox.checked);
    });
  
    // Form submission handler
    form.addEventListener("submit", (event) => {
      event.preventDefault();
  
      // Check if "Invite a speaker" is selected and text box is empty
      if (inviteSpeakerCheckbox.checked && !eventDescriptionInput.value.trim()) {
        eventDescriptionInput.classList.add("is-invalid");
        eventDescriptionInput.nextElementSibling.innerText =
          "Please provide details about your event.";
        return;
      } else {
        eventDescriptionInput.classList.remove("is-invalid");
        eventDescriptionInput.nextElementSibling.innerText = "";
      }
  
      if (form.checkValidity()) {
        // Success: Show success message
        notification.className = "alert alert-success";
        notification.classList.remove("d-none");
        notification.innerText = "Thank you! Your request has been submitted successfully.";
  
        // Reset the form
        form.reset();
  
        // Remove all validation states
        const inputs = form.querySelectorAll("input, textarea");
        inputs.forEach((input) => {
          input.classList.remove("is-invalid", "is-valid"); // Clear validation classes
        });
  
        // Clear validation styling from the form itself
        form.classList.remove("was-validated");
      } else {
        // Errors: Show error styling for invalid fields
        notification.className = "alert alert-danger";
        notification.classList.remove("d-none");
        notification.innerText = "Error: Please ensure all required fields are filled out correctly.";
  
        // Add validation classes for inputs
        const inputs = form.querySelectorAll("input, textarea");
        inputs.forEach((input) => {
          if (!input.checkValidity()) {
            input.classList.add("is-invalid"); // Add red outline
            input.classList.remove("is-valid");
          } else {
            input.classList.add("is-valid"); // Add green outline
            input.classList.remove("is-invalid");
          }
        });
  
        // Add was-validated class to the form
        form.classList.add("was-validated");
      }
    });

  const inputs = form.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (input.checkValidity()) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
      } else {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
      }
    });
  });

  });
  