document.addEventListener("DOMContentLoaded", () => {
    
    const monthsGeo = ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"];
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    // ==========================================
    // 📅 1. კალენდრის ფუნქციონალი და ასაკის თრექინგი
    // ==========================================
    const dobInput = document.getElementById("dobInput");
    const calendarModal = document.getElementById("calendarModal");
    const calendarViewLabel = document.getElementById("calendarViewLabel");
    const calendarBody = document.getElementById("calendarBody");
    const prevCalBtn = document.getElementById("prevCalBtn");
    const nextCalBtn = document.getElementById("nextCalBtn");
    const calculatedAgeSpan = document.getElementById("calculatedAge");

    let activeDate = new Date();
    let birthDate = null;
    let viewMode = "years"; 
    let yearPageStart = 1970;

    dobInput.addEventListener("click", (e) => {
        e.stopPropagation();
        viewMode = "years"; 
        calendarModal.classList.remove("hidden");
        buildCalendar();
    });

    function buildCalendar() {
        calendarBody.innerHTML = "";
        
        if (viewMode === "years") {
            calendarBody.className = "calendar-body grid-3";
            calendarViewLabel.textContent = `${yearPageStart} - ${yearPageStart + 11}`;
            
            for (let y = yearPageStart; y < yearPageStart + 12; y++) {
                const item = document.createElement("div");
                item.className = "cal-item";
                item.textContent = y;

                if (y > currentYear) {
                    item.style.color = "#ccc"; item.style.cursor = "not-allowed";
                } else {
                    item.addEventListener("click", (e) => {
                        e.stopPropagation();
                        activeDate.setFullYear(y); viewMode = "months"; buildCalendar();
                    });
                }
                calendarBody.appendChild(item);
            }
        } 
        else if (viewMode === "months") {
            calendarBody.className = "calendar-body grid-3";
            calendarViewLabel.textContent = activeDate.getFullYear();
            
            monthsGeo.forEach((m, idx) => {
                const item = document.createElement("div");
                item.className = "cal-item";
                item.textContent = m;

                if (activeDate.getFullYear() === currentYear && idx > currentMonth) {
                    item.style.color = "#ccc"; item.style.cursor = "not-allowed";
                } else {
                    item.addEventListener("click", (e) => {
                        e.stopPropagation();
                        activeDate.setMonth(idx); viewMode = "days"; buildCalendar();
                    });
                }
                calendarBody.appendChild(item);
            });
        } 
        else if (viewMode === "days") {
            calendarBody.className = "calendar-body grid-7";
            const y = activeDate.getFullYear();
            const m = activeDate.getMonth();
            calendarViewLabel.textContent = `${monthsGeo[m]} ${y}`;
            
            const firstDay = (new Date(y, m, 1).getDay() + 6) % 7;
            const daysCount = new Date(y, m + 1, 0).getDate();
            
            for (let i = 0; i < firstDay; i++) calendarBody.appendChild(document.createElement("div"));
            
            for (let d = 1; d <= daysCount; d++) {
                const item = document.createElement("div");
                item.className = "cal-item";
                item.textContent = d;

                if (y === currentYear && m === currentMonth && d > currentDay) {
                    item.style.color = "#ccc"; item.style.cursor = "not-allowed";
                } else {
                    item.addEventListener("click", (e) => {
                        e.stopPropagation();
                        birthDate = new Date(y, m, d);
                        dobInput.value = `${d} ${monthsGeo[m]}, ${y}`;
                        trackAge(birthDate);
                        calendarModal.classList.add("hidden");
                    });
                }
                calendarBody.appendChild(item);
            }
        }
    }

    prevCalBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (viewMode === "years") yearPageStart -= 12;
        if (viewMode === "months") activeDate.setFullYear(activeDate.getFullYear() - 1);
        if (viewMode === "days") activeDate.setMonth(activeDate.getMonth() - 1);
        buildCalendar();
    });

    nextCalBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (viewMode === "years" && yearPageStart + 12 > currentYear) return;
        if (viewMode === "months" && activeDate.getFullYear() >= currentYear) return;
        if (viewMode === "days" && activeDate.getFullYear() >= currentYear && activeDate.getMonth() >= currentMonth) return;

        if (viewMode === "years") yearPageStart += 12;
        if (viewMode === "months") activeDate.setFullYear(activeDate.getFullYear() + 1);
        if (viewMode === "days") activeDate.setMonth(activeDate.getMonth() + 1);
        buildCalendar();
    });

    function trackAge(bDate) {
        let age = now.getFullYear() - bDate.getFullYear();
        if (now.getMonth() < bDate.getMonth() || (now.getMonth() === bDate.getMonth() && now.getDate() < bDate.getDate())) age--;
        calculatedAgeSpan.textContent = `(${age} წლის)`;
    }

    // ==========================================
    // 🔒 2. ინპუტების ფილტრაცია და თვალების ფუნქციონალი
    // ==========================================
    const nameInput = document.getElementById("patientName");
    const surnameInput = document.getElementById("patientSurname");
    const phoneInput = document.getElementById("patientPhone");
    const idInput = document.getElementById("patientId");
    const addressInput = document.getElementById("patientAddress");
    const emailInput = document.getElementById("patientEmail");
    const passwordInput = document.getElementById("patientPassword");
    const confirmPasswordInput = document.getElementById("patientConfirmPassword");
    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

    // მხოლოდ ციფრები ტელეფონსა და პირად ნომერში
    phoneInput.addEventListener("input", () => phoneInput.value = phoneInput.value.replace(/\D/g, ''));
    idInput.addEventListener("input", () => idInput.value = idInput.value.replace(/\D/g, ''));

    function setupPasswordToggle(iconElement, inputElement) {
        if (iconElement && inputElement) {
            iconElement.addEventListener("click", () => {
                const type = inputElement.getAttribute("type") === "password" ? "text" : "password";
                inputElement.setAttribute("type", type);
                iconElement.classList.toggle("fa-eye");
                iconElement.classList.toggle("fa-eye-slash");
            });
        }
    }
    setupPasswordToggle(togglePassword, passwordInput);
    setupPasswordToggle(toggleConfirmPassword, confirmPasswordInput);

    // ==========================================
    // 📝 3. მკაცრი ფორმის ვალიდაცია (გასწორებული სელექტორით)
    // ==========================================
    const patientForm = document.getElementById("patientRegisterForm");
    
    if (patientForm) {
        patientForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let isValid = true;

            // სახელის ვალიდაცია
            if (!nameInput.value.trim()) {
                document.getElementById("nameError").textContent = "სახელის შეყვანა აუცილებელია!"; isValid = false;
            } else document.getElementById("nameError").textContent = "";

            // გვარის ვალიდაცია
            if (!surnameInput.value.trim()) {
                document.getElementById("surnameError").textContent = "გვარის შეყვანა აუცილებელია!"; isValid = false;
            } else document.getElementById("surnameError").textContent = "";

            // დაბადების თარიღის ვალიდაცია
            if (!dobInput.value) {
                document.getElementById("dobError").textContent = "გთხოვთ აირჩიოთ დაბადების თარიღი!"; isValid = false;
            } else document.getElementById("dobError").textContent = "";

            // ტელეფონის ვალიდაცია
            if (phoneInput.value.length < 9) {
                document.getElementById("phoneError").textContent = "არასწორი ნომერი (მინ. 9 ციფრი)"; isValid = false;
            } else document.getElementById("phoneError").textContent = "";

            // პირადი ნომრის ვალიდაცია
            if (idInput.value.length !== 11) {
                document.getElementById("idError").textContent = "პირადი ნომერი უნდა შედგებოდეს 11 ციფრისგან!"; isValid = false;
            } else document.getElementById("idError").textContent = "";

            // მისამართის ვალიდაცია
            if (!addressInput.value.trim()) {
                document.getElementById("addressError").textContent = "მისამართის შეყვანა აუცილებელია!"; isValid = false;
            } else document.getElementById("addressError").textContent = "";

            // ელფოსტის ვალიდაცია
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                document.getElementById("emailError").textContent = "გთხოვთ შეიყვანოთ ვალიდური ელფოსტა!"; isValid = false;
            } else document.getElementById("emailError").textContent = "";

            // პაროლის კომპლექსურობა
            const pass = passwordInput.value;
            const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            if (!passRegex.test(pass)) {
                document.getElementById("passwordError").textContent = "მინიმუმ 8 სიმბოლო, დიდი ასო, პატარა ასო, ციფრი და უცხო სიმბოლო!"; isValid = false;
            } else document.getElementById("passwordError").textContent = "";

            // პაროლების დამთხვევა
            if (confirmPasswordInput.value !== pass) {
                document.getElementById("confirmPasswordError").textContent = "პაროლები არ ემთხვევა ერთმანეთს!"; isValid = false;
            } else document.getElementById("confirmPasswordError").textContent = "";

            if (isValid) {
                document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
                console.log("პაციენტის რეგისტრაცია წარმატებულია!");
                // აქ განთავსდება ბექენდზე (API ან LocalStorage) გაგზავნის ლოგიკა
            }
        });
    }

    // კალენდრის დახურვა გარე კლიკზე
    document.addEventListener("click", () => {
        if (calendarModal) calendarModal.classList.add("hidden");
    });
});