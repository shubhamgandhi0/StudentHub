function vreg() {
    const fullName = document.getElementById("full-name").value.trim();
    const username = document.getElementById("uname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const course = document.getElementById("course").value;
    const year = document.getElementById("year").value;
    const password = document.getElementById("pass").value;
    const confirmPassword = document.getElementById("confirm-pass").value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const terms = document.getElementById("terms").checked;
    const error = document.getElementById("errmsg");

    const nameRegex = /^[A-Za-z ]{2,80}$/;
    const usernameRegex = /^[A-Za-z0-9_]{3,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phoneRegex = /^\d{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    if (!nameRegex.test(fullName)) {
        error.textContent = "Name must contain 2–80 letters and spaces only.";
        return false;
    }

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

    if (!course || !year || !gender) {
        error.textContent = "Select a course, year, and gender.";
        return false;
    }

    if (!passwordRegex.test(password)) {
        error.textContent =
            "Password must be at least 8 characters with uppercase, lowercase, number, and special character.";
        return false;
    }

    if (password !== confirmPassword) {
        error.textContent = "Passwords do not match.";
        return false;
    }

    if (!terms) {
        error.textContent = "You must accept the terms and conditions.";
        return false;
    }

    error.textContent = "";
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
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    document.querySelectorAll(".user-greet").forEach((greeting) => {
        fetch("current_user.php")
            .then((response) => response.ok ? response.json() : Promise.reject(new Error("User details unavailable")))
            .then((user) => {
                if (user.full_name) greeting.textContent = `Hello, ${user.full_name}`;
            })
            .catch(() => {});
    });
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

const eventSearch = document.getElementById("event-search");
if (eventSearch) {
    const eventState = { records: [], page: 1, pageSize: 6 };
    const eventFilter = document.getElementById("event-filter");
    const eventSort = document.getElementById("event-sort");
    const eventList = document.getElementById("events-list");
    const displayDate = (date) => new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

    const eventCard = (event) => {
        const card = document.createElement("article");
        card.className = "data-card";
        const title = document.createElement("h3");
        title.textContent = event.title;
        card.append(title);
        [["Category", event.category], ["Date", displayDate(event.date)], ["Location", event.location], ["Details", event.description]].forEach(([label, value]) => {
            const line = document.createElement("p");
            const strong = document.createElement("strong");
            strong.textContent = `${label}: `;
            line.append(strong, document.createTextNode(value));
            card.append(line);
        });
        return card;
    };

    const renderEvents = () => {
        const query = eventSearch.value.trim().toLowerCase();
        const filtered = eventState.records.filter((event) => Object.values(event).some((value) => String(value).toLowerCase().includes(query)) && (!eventFilter.value || event.category === eventFilter.value));
        filtered.sort((first, second) => {
            if (eventSort.value === "date-asc") return first.date.localeCompare(second.date);
            if (eventSort.value === "date-desc") return second.date.localeCompare(first.date);
            return eventSort.value === "title-asc" ? first.title.localeCompare(second.title) : second.title.localeCompare(first.title);
        });
        const pages = Math.max(1, Math.ceil(filtered.length / eventState.pageSize));
        eventState.page = Math.min(eventState.page, pages);
        const start = (eventState.page - 1) * eventState.pageSize;
        eventList.replaceChildren(...filtered.slice(start, start + eventState.pageSize).map(eventCard));
        document.getElementById("events-count").textContent = `${filtered.length} of ${eventState.records.length} events`;
        document.getElementById("events-page").textContent = `Page ${eventState.page} of ${pages}`;
        document.getElementById("events-status").textContent = filtered.length ? "Events loaded successfully." : "No events match your search.";
        document.getElementById("events-previous").disabled = eventState.page === 1;
        document.getElementById("events-next").disabled = eventState.page === pages;
    };

    fetch("events.json").then((response) => { if (!response.ok) throw new Error("Events could not be loaded"); return response.json(); }).then((events) => {
        eventState.records = events;
        const categories = [...new Set(events.map((event) => event.category))].sort();
        eventFilter.replaceChildren(new Option("All categories", ""), ...categories.map((category) => new Option(category, category)));
        renderEvents();
    }).catch((error) => { document.getElementById("events-status").textContent = "Unable to load events. Please start the site with a local server."; console.error(error); });

    [eventSearch, eventFilter, eventSort].forEach((control) => control.addEventListener("input", () => { eventState.page = 1; renderEvents(); }));
    document.getElementById("events-previous").addEventListener("click", () => { eventState.page -= 1; renderEvents(); });
    document.getElementById("events-next").addEventListener("click", () => { eventState.page += 1; renderEvents(); });
}

const faqList = document.getElementById("faq-list");
if (faqList) {
    const noticeTitle = document.getElementById("notice-title");
    const noticeMessage = document.getElementById("notice-message");
    const renderFaq = (faq) => {
        const item = document.createElement("div");
        item.className = "faq-item";
        const question = document.createElement("button");
        question.className = "faq-question";
        question.type = "button";
        question.setAttribute("aria-expanded", "false");
        question.append(document.createTextNode(faq.question));
        const indicator = document.createElement("span");
        indicator.textContent = "+";
        question.append(indicator);
        const answer = document.createElement("p");
        answer.className = "faq-answer";
        answer.textContent = faq.answer;
        question.addEventListener("click", () => {
            const expanded = question.getAttribute("aria-expanded") === "true";
            question.setAttribute("aria-expanded", String(!expanded));
            item.classList.toggle("is-open", !expanded);
        });
        item.append(question, answer);
        return item;
    };

    Promise.all([fetch("faqs.json"), fetch("notices.json")]).then(async ([faqResponse, noticeResponse]) => {
        if (!faqResponse.ok || !noticeResponse.ok) throw new Error("Home data could not be loaded");
        const [faqs, notices] = await Promise.all([faqResponse.json(), noticeResponse.json()]);
        faqList.replaceChildren(...faqs.slice(0, 5).map(renderFaq));
        noticeTitle.textContent = notices[0].title;
        noticeMessage.textContent = notices[0].message;
    }).catch((error) => {
        faqList.replaceChildren(Object.assign(document.createElement("p"), { className: "data-status", textContent: "FAQs are temporarily unavailable." }));
        noticeTitle.textContent = "Notices are temporarily unavailable.";
        console.error(error);
    });
}

const studentPrimary = document.getElementById("student-primary");
if (studentPrimary) {
    const profileFields = {
        "student-primary": [["Name", "name"], ["Roll No", "rollNo"], ["Date of Birth", "dob"], ["Class", "course"], ["Address", "address"], ["Blood Group", "bloodGroup"]],
        "student-secondary": [["Email", "email"], ["Phone", "phone"], ["Father's Name", "fatherName"], ["Father's Occupation", "fatherOccupation"], ["Mother's Name", "motherName"], ["Emergency Contact", "emergencyContact"], ["Extra-Curricular Activities", "activities"], ["Achievements", "achievements"], ["Hobbies", "hobbies"], ["Languages Known", "languages"]]
    };
    const renderProfileFields = (target, student, fields) => target.replaceChildren(...fields.map(([label, key]) => {
        const paragraph = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = `${label}: `;
        paragraph.append(strong, document.createTextNode(student[key]));
        return paragraph;
    }));

    fetch("students.json").then((response) => { if (!response.ok) throw new Error("Profile data could not be loaded"); return response.json(); }).then((students) => {
        const student = students[0];
        renderProfileFields(studentPrimary, student, profileFields["student-primary"]);
        renderProfileFields(document.getElementById("student-secondary"), student, profileFields["student-secondary"]);
        document.getElementById("student-academic").replaceChildren(...["Previous School: Parul University", "Year of Admission: 2026", "Current Year: 2nd Year", "Current Semester: 3rd Semester"].map((text) => {
            const paragraph = document.createElement("p");
            paragraph.textContent = text;
            return paragraph;
        }));
    }).catch((error) => { studentPrimary.textContent = "Unable to load profile data."; console.error(error); });
}
