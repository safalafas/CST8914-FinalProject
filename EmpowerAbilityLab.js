document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".content-section");
  const links = document.querySelectorAll(".nav-link");
  const skipLink = document.querySelector(".skip-to-content-link");

  // Function to activate the current section
  function showSection(sectionId) {
    sections.forEach((section) => {
      if (section.id === sectionId) {
        section.classList.add("active");
        section.classList.remove("d-none");
        const heading = section.querySelector("h1");
        if (heading) {
          heading.setAttribute("tabindex", "-1"); // Make it focusable
          heading.focus(); // Focus on the heading of the active section
        }
      } else {
        section.classList.remove("active");
        section.classList.add("d-none");
      }
    });

    // Dynamically update the skip link target
    skipLink.setAttribute("href", `#${sectionId}`);
    history.pushState({ section: sectionId }, document.title, `#${sectionId}`);
  }

  // Navigation link event handlers
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const sectionId = link.getAttribute("data-section");
      showSection(sectionId);
    });
  });

  // Handle browser back/forward navigation
  window.addEventListener("popstate", (event) => {
    if (event.state && event.state.section) {
      showSection(event.state.section);
    } else {
      showSection("home");
    }
  });

  // Handle skip to main content link
  skipLink.addEventListener("click", (event) => {
    const activeSection = document.querySelector(".content-section.active");
    if (activeSection) {
      const heading = activeSection.querySelector("h1");
      if (heading) {
        event.preventDefault();
        heading.setAttribute("tabindex", "-1"); // Ensure it's focusable
        heading.focus(); // Focus the heading
      }
    }
  });

  // Initialize the correct section on page load
  const defaultSection = location.hash ? location.hash.substring(1) : "home";
  showSection(defaultSection);


  /* ---------------------------
     Modal Handling
  ----------------------------- */
  const meetCommunityButton = document.getElementById("meetCommunity");
  const communityModal = document.getElementById("communityModal");
  const closeModalButton = document.getElementById("closeModal");
  const focusableSelectors =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  // Open modal
  function openModal() {
    communityModal.classList.remove("d-none");
    communityModal.setAttribute("aria-hidden", "false");
    meetCommunityButton.setAttribute("aria-expanded", "true");
    const modalTitle = communityModal.querySelector("#communityModalTitle");
    modalTitle.focus(); // Focus the modal title first
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

  // Modal event listeners
  meetCommunityButton.addEventListener("click", openModal);
  closeModalButton.addEventListener("click", closeModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !communityModal.classList.contains("d-none")) {
      closeModal();
    }
  });

  /* ---------------------------
     Schedule a Call Form Handling
  ----------------------------- */
  const form = document.getElementById("scheduleForm");
  const notification = document.getElementById("notification");
  const inviteSpeakerCheckbox = document.getElementById("inviteSpeaker");
  const eventDescriptionGroup = document.getElementById("eventDescriptionGroup");
  const eventDescriptionInput = document.getElementById("eventDescription");
  const phoneInput = document.getElementById("phoneNumber");
  const emailInput = document.getElementById("email");

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

  // Automatically format phone number
  phoneInput.addEventListener("input", () => {
    let value = phoneInput.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length > 3 && value.length <= 6) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 6) {
      value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
    }
    phoneInput.value = value;

    // Validate phone number
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (phoneRegex.test(value)) {
      phoneInput.classList.add("is-valid");
      phoneInput.classList.remove("is-invalid");
    } else {
      phoneInput.classList.add("is-invalid");
      phoneInput.classList.remove("is-valid");
    }
  });

  // Validate email input
  emailInput.addEventListener("input", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(emailInput.value)) {
      emailInput.classList.add("is-valid");
      emailInput.classList.remove("is-invalid");
    } else {
      emailInput.classList.add("is-invalid");
      emailInput.classList.remove("is-valid");
    }
  });

  // Form submission handler
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Focus on the first invalid field
    const firstInvalidField = form.querySelector(".is-invalid");
    if (!form.checkValidity() && firstInvalidField) {
      firstInvalidField.focus();
      return;
    }

    if (form.checkValidity()) {
      // Success: Show success message
      notification.className = "alert alert-success";
      notification.classList.remove("d-none");
      notification.innerText = "Thank you! Your request has been submitted successfully.";
      form.reset();

      // Clear validation classes
      const inputs = form.querySelectorAll("input, textarea");
      inputs.forEach((input) => {
        input.classList.remove("is-valid", "is-invalid");
      });
    } else {
      // Errors: Show error styling
      notification.className = "alert alert-danger";
      notification.classList.remove("d-none");
      notification.innerText = "Error: Please ensure all required fields are filled out correctly.";
    }
  });

  /* ---------------------------
     Accessible Toggle Switch
  ----------------------------- */
  const emailSwitchLabel = document.getElementById("emailSwitch");
  const receiveEmailsCheckbox = document.getElementById("receiveEmails");

  // Synchronize `aria-checked` on state change
  function updateSwitchState() {
    const isChecked = receiveEmailsCheckbox.checked;
    emailSwitchLabel.setAttribute("aria-checked", isChecked.toString());
    emailSwitchLabel.setAttribute(
      "aria-label",
      `Receive emails about updates and services is ${isChecked ? "on" : "off"}`
    );
  }

  // Toggle switch functionality
  emailSwitchLabel.addEventListener("click", () => {
    receiveEmailsCheckbox.checked = !receiveEmailsCheckbox.checked;
    updateSwitchState();
  });

  emailSwitchLabel.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      receiveEmailsCheckbox.checked = !receiveEmailsCheckbox.checked;
      updateSwitchState();
    }
  });

  // Initialize aria-checked on page load
  updateSwitchState();

  /* ---------------------------
     Navbar Toggle Accessibility
  ----------------------------- */
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  navbarToggler.addEventListener("click", () => {
    const isExpanded = navbarCollapse.classList.contains("show");
    navbarToggler.setAttribute("aria-expanded", !isExpanded);
    navbarCollapse.classList.toggle("show");
  });

  /* ---------------------------
     Keyboard Navigation for Checkboxes
  ----------------------------- */
  const checkboxes = document.querySelectorAll(".form-check-input");
  checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = checkboxes[index + 1] || checkboxes[0];
        next.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = checkboxes[index - 1] || checkboxes[checkboxes.length - 1];
        prev.focus();
      }
    });
  });
});
