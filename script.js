function vreg() {
    const username = document.getElementById("uname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("pass").value;
    const error = document.getElementById("errmsg");

    const usernameRegex = /^[A-Za-z0-9_]{3,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phoneRegex = /^\d{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    if (!usernameRegex.test(username)) {
        error.textContent = "Username must be 3–20 characters and contain only letters, numbers, or _.";
        return false;
    }

    if (!emailRegex.test(email)) {
        error.textContent = "Enter a valid email address.";
        return false;
    }

    if (!phoneRegex.test(phone)) {
        error.textContent = "Phone number must contain exactly 10 digits.";
        return false;
    }

    if (!passwordRegex.test(password)) {
        error.textContent =
            "Password must be at least 8 characters with uppercase, lowercase, number, and special character.";
        return false;
    }

    error.textContent = "";
     window.location.href = "dash.html";
    return true;
}

function vlogin() {
    const username = document.getElementById("loginUname").value.trim();
    const password = document.getElementById("loginPass").value;
    const error = document.getElementById("loginErrmsg");

    const usernameRegex = /^[A-Za-z0-9_]{3,20}$/;

    if (!usernameRegex.test(username)) {
        error.textContent = "Enter a valid username.";
        return false;
    }

    if (password.length === 0) {
        error.textContent = "Password is required.";
        return false;
    }

    error.textContent = "";
    window.location.href = "dash.html";
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const topbar = document.querySelector(".topbar");
    if (topbar && !topbar.querySelector(".theme-toggle")) {
        const actions = document.createElement("div");
        actions.className = "topbar-actions";
        actions.innerHTML = '<button class="icon-btn menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false">&#9776;</button><button class="icon-btn theme-toggle" type="button" aria-label="Switch to dark theme">&#9790;</button>';
        topbar.append(actions);
    }
    const sidebar = document.querySelector(".sidebar");
    const menuToggle = document.querySelector(".menu-toggle");
    const themeToggle = document.querySelector(".theme-toggle");

    const applyTheme = (theme) => {
        body.dataset.theme = theme;
        if (themeToggle) {
            themeToggle.textContent = theme === "dark" ? "☀" : "☾";
            themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
        }
    };

    applyTheme(localStorage.getItem("stackhub-theme") || "light");
    themeToggle?.addEventListener("click", () => {
        const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";
        localStorage.setItem("stackhub-theme", nextTheme);
        applyTheme(nextTheme);
    });

    menuToggle?.addEventListener("click", () => {
        const isOpen = sidebar.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    document.querySelectorAll(".faq-question").forEach((question) => {
        question.addEventListener("click", () => {
            const isExpanded = question.getAttribute("aria-expanded") === "true";
            question.setAttribute("aria-expanded", String(!isExpanded));
            question.parentElement.classList.toggle("is-open", !isExpanded);
        });
    });

    const slides = [
        { title: "Stay on schedule", copy: "Plan your week with a clear view of every class and study session.", image: "assets/timetable.png", alt: "Timetable icon" },
        { title: "Track your progress", copy: "Keep attendance information visible before it becomes a last-minute concern.", image: "assets/attendence.png", alt: "Attendance icon" },
        { title: "Finish with focus", copy: "See pending assignments and move from planning to action without extra clicks.", image: "assets/assignment.png", alt: "Assignment icon" }
    ];
    let currentSlide = 0;
    const updateSlide = (index) => {
        currentSlide = (index + slides.length) % slides.length;
        const slide = slides[currentSlide];
        document.getElementById("slide-title").textContent = slide.title;
        document.getElementById("slide-copy").textContent = slide.copy;
        const image = document.getElementById("slide-image");
        image.src = slide.image;
        image.alt = slide.alt;
        document.querySelectorAll(".slide-dot").forEach((dot, dotIndex) => {
            const active = dotIndex === currentSlide;
            dot.classList.toggle("is-active", active);
            dot.setAttribute("aria-selected", String(active));
        });
    };
    document.querySelector(".slide-prev")?.addEventListener("click", () => updateSlide(currentSlide - 1));
    document.querySelector(".slide-next")?.addEventListener("click", () => updateSlide(currentSlide + 1));
    document.querySelectorAll(".slide-dot").forEach((dot, index) => dot.addEventListener("click", () => updateSlide(index)));

    const modal = document.querySelector(".modal");
    const closeModal = () => {
        modal.hidden = true;
        body.classList.remove("modal-open");
    };
    document.querySelector(".modal-open")?.addEventListener("click", () => {
        modal.hidden = false;
        body.classList.add("modal-open");
        modal.querySelector(".modal-close").focus();
    });
    document.querySelector(".modal-close")?.addEventListener("click", closeModal);
    modal?.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && modal && !modal.hidden) closeModal(); });
    document.querySelector(".banner-close")?.addEventListener("click", (event) => event.currentTarget.closest(".notice-banner").remove());
});
