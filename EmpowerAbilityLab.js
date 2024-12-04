document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".content-section");
  const links = document.querySelectorAll(".nav-link");
  const skipLink = document.querySelector(".skip-to-content-link");

  // Initialize sections with proper ARIA attributes
  sections.forEach(section => {
    section.setAttribute("aria-live", "polite");
    section.setAttribute("role", "region");
    const heading = section.querySelector("h1");
    if (heading) {
      const headingId = heading.id || `heading-${section.id}`;
      heading.id = headingId;
      section.setAttribute("aria-labelledby", headingId);
    }
  });

  // Function to activate the current section
  function showSection(sectionId) {
    sections.forEach((section) => {
      if (section.id === sectionId) {
        section.classList.add("active");
        section.classList.remove("d-none");
        section.setAttribute("aria-hidden", "false");
        section.setAttribute("aria-current", "page");

        const heading = section.querySelector("h1");
        if (heading) {
          heading.setAttribute("tabindex", "-1");

          // Create announcement for screen readers
          const announcement = document.createElement("div");
          announcement.setAttribute("role", "status");
          announcement.setAttribute("aria-live", "assertive");
          announcement.className = "sr-only";
          announcement.textContent = `${heading.textContent} page loaded`;

          document.body.appendChild(announcement);
          setTimeout(() => {
            heading.focus();
            announcement.remove();
          }, 100);
        }

        // Update navigation state
        links.forEach(link => {
          if (link.getAttribute("data-section") === sectionId) {
            link.setAttribute("aria-current", "page");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      } else {
        section.classList.remove("active");
        section.classList.add("d-none");
        section.setAttribute("aria-hidden", "true");
        section.removeAttribute("aria-current");
      }
    });

    skipLink.setAttribute("href", `#${sectionId}`);
    if (!history.state || history.state.section !== sectionId) {
      history.pushState({ section: sectionId }, document.title, `#${sectionId}`);
    }
  }

  // Navigation link event handlers
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const sectionId = link.getAttribute("data-section");
      const sectionName = link.textContent;

      // Create pre-navigation announcement
      const loadingAnnouncement = document.createElement("div");
      loadingAnnouncement.setAttribute("role", "status");
      loadingAnnouncement.setAttribute("aria-live", "assertive");
      loadingAnnouncement.className = "sr-only";
      loadingAnnouncement.textContent = `Loading ${sectionName} page`;
      document.body.appendChild(loadingAnnouncement);

      setTimeout(() => {
        showSection(sectionId);
        loadingAnnouncement.remove();
      }, 100);
    });
  });

  // Handle browser back/forward navigation
  window.addEventListener("popstate", (event) => {
    const newSectionId = event.state?.section || (location.hash ? location.hash.substring(1) : "home");
    showSection(newSectionId);
  });

  // Handle skip to main content link
  skipLink.addEventListener("click", (event) => {
    const activeSection = document.querySelector(".content-section.active");
    if (activeSection) {
      const heading = activeSection.querySelector("h1");
      if (heading) {
        event.preventDefault();
        heading.setAttribute("tabindex", "-1");
        heading.focus();
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

  // Get all focusable elements within modal
  const getFocusableElements = () => {
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const elements = communityModal.querySelectorAll(focusableSelectors);
    return Array.from(elements).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
  };

  // Open modal
  function openModal() {
    communityModal.classList.remove("d-none");
    communityModal.setAttribute("aria-hidden", "false");
    meetCommunityButton.setAttribute("aria-expanded", "true");

    // Set initial focus after a brief delay to ensure modal is visible
    setTimeout(() => {
      const modalTitle = communityModal.querySelector("#communityModalTitle");
      if (modalTitle) {
        modalTitle.focus();
      } else {
        const firstFocusable = getFocusableElements()[0];
        if (firstFocusable) firstFocusable.focus();
      }
    }, 50);

    document.addEventListener("keydown", trapFocus);
  }

  // Close modal
  function closeModal() {
    communityModal.classList.add("d-none");
    communityModal.setAttribute("aria-hidden", "true");
    meetCommunityButton.setAttribute("aria-expanded", "false");
    meetCommunityButton.focus(); // Return focus to the trigger button
    document.removeEventListener("keydown", trapFocus);
  }

  // Trap focus inside the modal
  function trapFocus(event) {
    if (event.key === "Tab") {
      const focusableElements = getFocusableElements();
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      // Going backwards from first element
      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      }
      // Going forwards from last element
      else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
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

  // Optional: Close when clicking outside the modal
  communityModal.addEventListener("click", (event) => {
    if (event.target === communityModal) {
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
    let value = phoneInput.value.replace(/\D/g, "");
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

    // Remove any existing validation styles
    form.querySelectorAll(".is-invalid").forEach(element => {
      element.classList.remove("is-invalid");
    });

    // Perform validation on all required fields
    const requiredFields = form.querySelectorAll("[required]");
    let firstInvalidField = null;

    requiredFields.forEach(field => {
      if (!field.checkValidity()) {
        field.classList.add("is-invalid");
        if (!firstInvalidField) {
          firstInvalidField = field;
        }
      }
    });

    // Additional custom validation for phone and email
    if (phoneInput.value && !phoneInput.value.match(/^\d{3}-\d{3}-\d{4}$/)) {
      phoneInput.classList.add("is-invalid");
      if (!firstInvalidField) {
        firstInvalidField = phoneInput;
      }
    }

    if (emailInput.value && !emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      emailInput.classList.add("is-invalid");
      if (!firstInvalidField) {
        firstInvalidField = emailInput;
      }
    }

    // If there's an invalid field, focus it and show error message
    if (firstInvalidField) {
      firstInvalidField.focus();
      notification.className = "alert alert-danger";
      notification.classList.remove("d-none");
      notification.innerText = "Error: Please ensure all required fields are filled out correctly.";
      return;
    }

    // If we get here, the form is valid
    notification.className = "alert alert-success";
    notification.classList.remove("d-none");
    notification.innerText = "Thank you! Your request has been submitted successfully.";

    // Clear the form and validation classes
    form.reset();
    form.querySelectorAll(".is-valid, .is-invalid").forEach(element => {
      element.classList.remove("is-valid", "is-invalid");
    });

    // Reset event description if needed
    if (eventDescriptionGroup) {
      eventDescriptionGroup.classList.add("d-none");
      eventDescriptionInput.removeAttribute("required");
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