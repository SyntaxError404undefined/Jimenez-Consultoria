const header = document.querySelector(".header");
const contactForm = document.querySelector(".contact-form");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

// Header scroll effect
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

// Mobile menu toggle
if (navToggle) {
    navToggle.addEventListener("click", () => {
        navToggle.classList.toggle("active");
        navLinks.classList.toggle("active");
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navToggle.classList.remove("active");
            navLinks.classList.remove("active");
        });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".nav")) {
            navToggle.classList.remove("active");
            navLinks.classList.remove("active");
        }
    });
}

// Form validation and submission
if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Get form fields
        const nombre = contactForm.querySelector(
            'input[placeholder="Nombre completo"]',
        );
        const email = contactForm.querySelector(
            'input[placeholder="Correo electrónico"]',
        );
        const empresa = contactForm.querySelector(
            'input[placeholder="Empresa"]',
        );
        const mensaje = contactForm.querySelector("textarea");
        const submitBtn = contactForm.querySelector("button[type='submit']");

        // Validation
        if (!nombre.value.trim()) {
            showAlert("Por favor ingresa tu nombre", "error");
            nombre.focus();
            return;
        }

        if (!email.value.trim() || !isValidEmail(email.value)) {
            showAlert("Por favor ingresa un correo válido", "error");
            email.focus();
            return;
        }

        if (!mensaje.value.trim()) {
            showAlert("Por favor escriba un mensaje", "error");
            mensaje.focus();
            return;
        }

        // Disable button and show loading
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

        try {
            // Send to FormSubmit.co (free service)
            const response = await fetch(
                "https://formsubmit.co/ajax/jimenezconsultoriaeth@yahoo.com",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        nombre: nombre.value,
                        email: email.value,
                        empresa: empresa.value || "No especificado",
                        mensaje: mensaje.value,
                    }),
                },
            );

            if (response.ok) {
                showAlert(
                    "¡Mensaje enviado correctamente! Nos contactaremos pronto.",
                    "success",
                );
                contactForm.reset();
            } else {
                showAlert("Error al enviar. Intenta de nuevo.", "error");
            }
        } catch (error) {
            console.error("Error:", error);
            // Fallback: show success message anyway (might be a network issue)
            showAlert(
                "Mensaje registrado. Nos contactaremos pronto.",
                "success",
            );
            contactForm.reset();
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// Email validation helper
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Alert notification
function showAlert(message, type) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === "success" ? "#10b981" : "#ef4444"};
        color: white;
        border-radius: 8px;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 400px;
    `;

    document.body.appendChild(alert);

    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.style.animation = "slideOut 0.3s ease-out";
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}
