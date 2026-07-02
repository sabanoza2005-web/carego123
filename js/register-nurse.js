document.addEventListener("DOMContentLoaded", () => {

    const monthsGeo = ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"];

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    // ==========================================
    // 📅 1. ძირითადი კალენდარი (დაბადების თარიღი)
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

    if (dobInput) {
        dobInput.addEventListener("click", (e) => {
            e.stopPropagation();
            viewMode = "years";
            calendarModal.classList.remove("hidden");
            buildCalendar();
        });
    }

    function buildCalendar() {
        if (!calendarBody) return;
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

    if (prevCalBtn) {
        prevCalBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (viewMode === "years") yearPageStart -= 12;
            if (viewMode === "months") activeDate.setFullYear(activeDate.getFullYear() - 1);
            if (viewMode === "days") activeDate.setMonth(activeDate.getMonth() - 1);
            buildCalendar();
        });
    }

    if (nextCalBtn) {
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
    }

    function trackAge(bDate) {
        if (!calculatedAgeSpan) return;
        let age = now.getFullYear() - bDate.getFullYear();
        if (now.getMonth() < bDate.getMonth() || (now.getMonth() === bDate.getMonth() && now.getDate() < bDate.getDate())) age--;
        calculatedAgeSpan.textContent = `(${age} წლის)`;
    }

    // ==========================================
    // 💼 2. სპეციალიზაციების მართვა (ტეგები)
    // ==========================================
    const specInput = document.getElementById("specInput");
    const addSpecBtn = document.getElementById("addSpecBtn");
    const specializationsContainer = document.getElementById("specializationsContainer");
    let specializationsList = [];

    if (addSpecBtn && specInput) {
        addSpecBtn.onclick = function () {
            const val = specInput.value.trim();
            if (val && !specializationsList.includes(val)) {
                specializationsList.push(val);
                renderSpecTags();
                specInput.value = "";
            }
        };
    }

    function renderSpecTags() {
        specializationsContainer.innerHTML = "";
        specializationsList.forEach(spec => {
            const tag = document.createElement("div");
            tag.className = "tag-box";
            tag.innerHTML = `${spec} <span class="remove-btn">&times;</span>`;
            tag.querySelector(".remove-btn").onclick = () => {
                specializationsList = specializationsList.filter(s => s !== spec);
                renderSpecTags();
            };
            specializationsContainer.appendChild(tag);
        });
    }

    // ==========================================
    // 💉 3. მანიპულაციების მართვა (ტეგები)
    // ==========================================
    const manipulationSelect = document.getElementById("manipulationSelect");
    const addManipulationBtn = document.getElementById("addManipulationBtn");
    const manipulationsContainer = document.getElementById("manipulationsContainer");
    let manipulationsList = [];

    if (manipulationSelect) {
        fetch("https://carego.onrender.com/api/services/names")
            .then(res => res.json())
            .then(data => {
                if (data && data.success && Array.isArray(data.data)) {
                    data.data.forEach(serviceName => {
                        const exists = Array.from(manipulationSelect.options).some(
                            option => option.value.trim() === serviceName.trim()
                        );
                        if (!exists) {
                            const option = document.createElement("option");
                            option.value = serviceName;
                            option.textContent = serviceName;
                            manipulationSelect.appendChild(option);
                        }
                    });
                }
            })
            .catch(error => {
                console.error("სერვისების ჩატვირთვა ვერ მოხერხდა:", error);
            });
    }

    if (addManipulationBtn && manipulationSelect) {
        addManipulationBtn.onclick = function () {
            const val = manipulationSelect.value;
            if (val && !manipulationsList.includes(val)) {
                manipulationsList.push(val);
                renderManipulationTags();
            }
        };
    }

    function renderManipulationTags() {
        manipulationsContainer.innerHTML = "";
        manipulationsList.forEach(man => {
            const tag = document.createElement("div");
            tag.className = "tag-box";
            tag.innerHTML = `${man} <span class="remove-btn">&times;</span>`;
            tag.querySelector(".remove-btn").onclick = () => {
                manipulationsList = manipulationsList.filter(m => m !== man);
                renderManipulationTags();
            };
            manipulationsContainer.appendChild(tag);
        });
    }

    // ==========================================
    // ⏳ 4. სამუშაო გამოცდილება და შიდა კალენდრები
    // ==========================================
    const expStartInput = document.getElementById("expStartInput");
    const expEndInput = document.getElementById("expEndInput");
    const currentJobToggle = document.getElementById("currentJobToggle");
    const expEndWrapper = document.getElementById("expEndWrapper");
    const addExperienceBtn = document.getElementById("addExperienceBtn");
    const experienceContainer = document.getElementById("experienceContainer");
    const expEmployer = document.getElementById("expEmployer");
    const expPosition = document.getElementById("expPosition");

    const startCalendarModal = document.getElementById("startCalendarModal");
    const startCalLabel = document.getElementById("startCalLabel");
    const startCalBody = document.getElementById("startCalBody");
    const prevStartCalBtn = document.getElementById("prevStartCalBtn");
    const nextStartCalBtn = document.getElementById("nextStartCalBtn");

    const endCalendarModal = document.getElementById("endCalendarModal");
    const endCalLabel = document.getElementById("endCalLabel");
    const endCalBody = document.getElementById("endCalBody");
    const prevEndCalBtn = document.getElementById("prevEndCalBtn");
    const nextEndCalBtn = document.getElementById("nextEndCalBtn");

    let expStartYear = currentYear;
    let expEndYear = currentYear;
    let selectedStartMonth = null;
    let selectedEndMonth = null;
    let experienceList = [];

    if (currentJobToggle) {
        currentJobToggle.addEventListener("change", () => {
            if (currentJobToggle.checked) {
                expEndWrapper.style.opacity = "0.4";
                expEndInput.value = "დღემდე";
                expEndInput.style.pointerEvents = "none";
                selectedEndMonth = null;
            } else {
                expEndWrapper.style.opacity = "1";
                expEndInput.value = "";
                expEndInput.style.pointerEvents = "auto";
            }
        });
    }

    if (expStartInput) {
        expStartInput.onclick = (e) => { e.stopPropagation(); startCalendarModal.classList.remove("hidden"); buildExpCalendar("start"); };
    }
    if (expEndInput) {
        expEndInput.onclick = (e) => { e.stopPropagation(); startCalendarModal.classList.add("hidden"); endCalendarModal.classList.remove("hidden"); buildExpCalendar("end"); };
    }

    function buildExpCalendar(type) {
        const body = type === "start" ? startCalBody : endCalBody;
        const label = type === "start" ? startCalLabel : endCalLabel;
        const year = type === "start" ? expStartYear : expEndYear;

        body.innerHTML = "";
        label.textContent = year;

        monthsGeo.forEach((m, idx) => {
            const item = document.createElement("div");
            item.className = "cal-item";
            item.textContent = m;

            if (year === currentYear && idx > currentMonth) {
                item.style.color = "#ccc"; item.style.cursor = "not-allowed";
            } else {
                item.onclick = (e) => {
                    e.stopPropagation();
                    if (type === "start") {
                        selectedStartMonth = { month: idx, year: year };
                        expStartInput.value = `${m}, ${year}`;
                        startCalendarModal.classList.add("hidden");
                    } else {
                        selectedEndMonth = { month: idx, year: year };
                        expEndInput.value = `${m}, ${year}`;
                        endCalendarModal.classList.add("hidden");
                    }
                };
            }
            body.appendChild(item);
        });
    }

    if (prevStartCalBtn) prevStartCalBtn.onclick = (e) => { e.stopPropagation(); expStartYear--; buildExpCalendar("start"); };
    if (nextStartCalBtn) nextStartCalBtn.onclick = (e) => { e.stopPropagation(); if (expStartYear < currentYear) { expStartYear++; buildExpCalendar("start"); } };
    if (prevEndCalBtn) prevEndCalBtn.onclick = (e) => { e.stopPropagation(); expEndYear--; buildExpCalendar("end"); };
    if (nextEndCalBtn) nextEndCalBtn.onclick = (e) => { e.stopPropagation(); if (expEndYear < currentYear) { expEndYear++; buildExpCalendar("end"); } };

    if (addExperienceBtn) {
        addExperienceBtn.onclick = function () {
            const emp = expEmployer.value.trim();
            const pos = expPosition.value.trim();
            const startVal = expStartInput.value;
            const endVal = expEndInput.value;

            if (!emp || !pos || !startVal || !endVal) {
                document.getElementById("experienceError").textContent = "გთხოვთ შეავსოთ გამოცდილების ყველა ველი!";
                return;
            }
            document.getElementById("experienceError").textContent = "";

            let durationText = "";
            if (currentJobToggle.checked) {
                durationText = "ამჟამად მუშაობს";
            } else if (selectedStartMonth && selectedEndMonth) {
                let mos = (selectedEndMonth.year - selectedStartMonth.year) * 12 + (selectedEndMonth.month - selectedStartMonth.month);
                if (mos < 0) {
                    document.getElementById("experienceError").textContent = "დასრულების თარიღი წინ უსწრებს დაწყებას!";
                    return;
                }
                let yrs = Math.floor(mos / 12);
                let remMos = mos % 12;
                durationText = `${yrs > 0 ? yrs + ' წელი ' : ''}${remMos > 0 ? remMos + ' თვე' : ''}`;
                if (mos === 0) durationText = "1 თვეზე ნაკლები";
            }

            experienceList.push({ employer: emp, position: pos, period: `${startVal} - ${endVal}`, duration: durationText });
            renderExperienceCards();

            expEmployer.value = ""; expPosition.value = ""; expStartInput.value = ""; expEndInput.value = "";
            if (currentJobToggle.checked) {
                currentJobToggle.checked = false;
                expEndWrapper.style.opacity = "1";
                expEndInput.style.pointerEvents = "auto";
            }
        };
    }

    function renderExperienceCards() {
        experienceContainer.innerHTML = "";
        experienceList.forEach((exp, idx) => {
            const card = document.createElement("div");
            card.className = "exp-card";
            card.innerHTML = `
                <div class="exp-info">
                    <h4>${exp.position} - ${exp.employer}</h4>
                    <p>${exp.period}</p>
                </div>
                <div style="display:flex; align-items:center; gap:15px;">
                    <span class="duration-badge">${exp.duration}</span>
                    <span class="remove-btn" data-idx="${idx}"><i class="fas fa-trash-alt"></i></span>
                </div>
            `;
            card.querySelector(".remove-btn").onclick = () => {
                experienceList.splice(idx, 1);
                renderExperienceCards();
            };
            experienceContainer.appendChild(card);
        });
    }

    // ==========================================
    // 📁 5. გაყოფილი ორმაგი Drag & Drop ატვირთვა
    // ==========================================
    let avatarFile = null;
    let documentsList = [];

    function initDropzone(zoneId, inputId, isMultiple, onFilesAdded) {
        const zone = document.getElementById(zoneId);
        const input = document.getElementById(inputId);
        if (!zone || !input) return;

        zone.onclick = () => input.click();
        zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("dragover"); });
        zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
        zone.addEventListener("drop", (e) => {
            e.preventDefault();
            zone.classList.remove("dragover");
            onFilesAdded(e.dataTransfer.files);
        });
        input.onchange = (e) => onFilesAdded(e.target.files);
    }

    // ზონა 1: პროფილის ფოტო
    initDropzone("avatarDropzone", "avatarInput", false, (files) => {
        if (files.length > 0) {
            avatarFile = files[0];
            renderAvatar();
        }
    });

    function renderAvatar() {
        const list = document.getElementById("avatarFileList");
        list.innerHTML = "";
        if (!avatarFile) return;

        const item = document.createElement("div");
        item.className = "file-item";
        item.innerHTML = `<span><i class="fas fa-image"></i> ${avatarFile.name}</span> <span class="remove-file">&times;</span>`;
        item.querySelector(".remove-file").onclick = () => {
            avatarFile = null;
            renderAvatar();
        };
        list.appendChild(item);
    }

    // ზონა 2: დოკუმენტები და სერტიფიკატები
    initDropzone("docsDropzone", "docsInput", true, (files) => {
        for (let i = 0; i < files.length; i++) {
            if (!documentsList.some(f => f.name === files[i].name)) {
                documentsList.push(files[i]);
            }
        }
        renderDocuments();
    });

    function renderDocuments() {
        const list = document.getElementById("docsFilesList");
        list.innerHTML = "";
        documentsList.forEach((file, idx) => {
            const item = document.createElement("div");
            item.className = "file-item";
            item.innerHTML = `<span><i class="far fa-file-alt"></i> ${file.name}</span> <span class="remove-file">&times;</span>`;
            item.querySelector(".remove-file").onclick = () => {
                documentsList.splice(idx, 1);
                renderDocuments();
            };
            list.appendChild(item);
        });
    }

    // ==========================================
    // 🔒 6. ინპუტების ფილტრაცია და თვალები
    // ==========================================
    const nameInput = document.getElementById("nurseName");
    const surnameInput = document.getElementById("nurseSurname");
    const phoneInput = document.getElementById("nursePhone");
    const idInput = document.getElementById("nurseId");
    const emailInput = document.getElementById("nurseEmail");
    const passwordInput = document.getElementById("nursePassword");
    const confirmPasswordInput = document.getElementById("nurseConfirmPassword");
    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

    if (phoneInput) phoneInput.addEventListener("input", () => phoneInput.value = phoneInput.value.replace(/\D/g, ''));
    if (idInput) idInput.addEventListener("input", () => idInput.value = idInput.value.replace(/\D/g, ''));

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
    // 📝 7. ფორმის საბოლოო ვალიდაცია
    // ==========================================
    const nurseForm = document.getElementById("nurseRegisterForm");

    if (nurseForm) {
        nurseForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let isValid = true;

            if (!nameInput.value.trim()) { document.getElementById("nameError").textContent = "სახელის შეყვანა აუცილებელია!"; isValid = false; } else document.getElementById("nameError").textContent = "";
            if (!surnameInput.value.trim()) { document.getElementById("surnameError").textContent = "გვარის შეყვანა აუცილებელია!"; isValid = false; } else document.getElementById("surnameError").textContent = "";
            if (!birthDate) { document.getElementById("dobInput").nextElementSibling.textContent = "მიუთითეთ დაბადების თარიღი!"; isValid = false; }
            if (phoneInput.value.length < 9) { document.getElementById("phoneError").textContent = "არასწორი ნომერი (მინ. 9 ციფრი)"; isValid = false; } else document.getElementById("phoneError").textContent = "";
            if (idInput.value.length !== 11) { document.getElementById("idError").textContent = "პირადი ნომერი უნდა შედგებოდეს 11 ციფრისგან!"; isValid = false; } else document.getElementById("idError").textContent = "";

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) { document.getElementById("emailError").textContent = "გთხოვთ შეიყვანოთ ვალიდური ელფოსტა!"; isValid = false; } else document.getElementById("emailError").textContent = "";

            const pass = passwordInput.value;
            const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            if (!passRegex.test(pass)) { document.getElementById("passwordError").textContent = "მინიმუმ 8 სიმბოლო, დიდი ასო, პატარა ასო, ციფრი და უცხო სიმბოლო!"; isValid = false; } else document.getElementById("passwordError").textContent = "";
            if (confirmPasswordInput.value !== pass) { document.getElementById("confirmPasswordError").textContent = "პაროლები არ ემთხვევა ერთმანეთს!"; isValid = false; } else document.getElementById("confirmPasswordError").textContent = "";

            // ფაილების აუცილებლობის ვალიდაცია
            if (!avatarFile) { document.getElementById("avatarError").textContent = "პროფილის ფოტოს ატვირთვა აუცილებელია!"; isValid = false; } else document.getElementById("avatarError").textContent = "";
            if (documentsList.length === 0) { document.getElementById("docsError").textContent = "დიპლომის ან სერტიფიკატის ატვირთვა აუცილებელია!"; isValid = false; } else document.getElementById("docsError").textContent = "";

            if (isValid) {
                document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
                console.log("ექთნის რეგისტრაცია წარმატებულია!", {
                    personal: { name: nameInput.value, surname: surnameInput.value, dob: dobInput.value, phone: phoneInput.value, id: idInput.value, email: emailInput.value },
                    avatar: avatarFile,
                    documents: documentsList,
                    specializations: specializationsList,
                    manipulations: manipulationsList,
                    experience: experienceList
                });
            }
        });
    }

    document.addEventListener("click", () => {
        if (calendarModal) calendarModal.classList.add("hidden");
        if (startCalendarModal) startCalendarModal.classList.add("hidden");
        if (endCalendarModal) endCalendarModal.classList.add("hidden");
    });
});