document.addEventListener("DOMContentLoaded", async () => {

    // 1. Smooth scroll for navigation & Auth/Profile routing
    document.querySelectorAll("nav a").forEach((link) => {
        link.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");

            // ვამოწმებთ, დააჭირა თუ არა მომხმარებელმა პროფილის ლინკს
            if (this.innerText.trim() === "პროფილი") {
                e.preventDefault(); // ვაჩერებთ სტანდარტულ გადასვლას

                // ვამოწმებთ, არის თუ არა მომხმარებელი უკვე სისტემაში შესული
                let user = null;
                try { user = JSON.parse(localStorage.getItem("user")); } catch(e) {}

                if (user && user.isLoggedIn) {
                    // თუ შესულია, გადაგვყავს პროფილის გვერდზე
                    alert("თქვენ უკვე ავტორიზებული ხართ. გადადიხართ პროფილის გვერდზე...");
                    if (user.role === "nurse") {
                        window.location.href = "profile-nurse.html";
                    } else if (user.role === "patient") {
                        window.location.href = "profile-patient.html";
                    } else {
                        window.location.href = "profile.html";
                    }
                } else {
                    // თუ არ არის შესული, გადაგვყავს ლოგინის გვერდზე
                    window.location.href = "login.html";
                }
                return;
            }

            // სქროლის ლოგიკა შიდა ID (#) ლინკებისთვის
            if (targetId && targetId.startsWith("#") && targetId !== "#") {
                e.preventDefault();

                document.querySelector(targetId)?.scrollIntoView({
                    behavior: "smooth",
                });
            }
        });
    });

    // 2. Feedback button interaction
    const feedbackBtn = document.querySelector(".feedback-section button");
    if (feedbackBtn) {
        feedbackBtn.addEventListener("click", () => {
            alert("მადლობა Feedback-ისთვის! ❤️");
        });
    }

    // 3. Nurse card click interaction (using event delegation for static & dynamic cards)
    const nursesContainer = document.querySelector(".nurses-container");
    if (nursesContainer) {
        nursesContainer.addEventListener("click", (e) => {
            const card = e.target.closest(".nurse-card");
            if (card) {
                const nurseName = card.querySelector("h3").innerText;
                alert(`ექთანთან (${nurseName}) დასაკავშირებლად საჭიროა სისტემაში შესვლა.`);
                window.location.href = "login.html";
            }
        });
    }

    //fetch-popular nurses form api and render
    async function loadNurses() {
        console.log("test")
        const container = document.querySelector('.nurses-container');

        try {
            const response = await fetch('https://carego.onrender.com/api/nurses/popular');
            const json = await response.json();

            if (!json.success || !json.data.length) return;

            // Calculate years of experience from workExperience array
            function calcExperience(workExperience) {
                if (!workExperience || workExperience.length === 0) return 0;

                let totalMonths = 0;
                workExperience.forEach(job => {
                    const start = new Date(job.startDate);
                    const end = job.endDate ? new Date(job.endDate) : new Date();
                    const months =
                        (end.getFullYear() - start.getFullYear()) * 12 +
                        (end.getMonth() - start.getMonth());
                    totalMonths += Math.max(0, months);
                });

                return Math.round(totalMonths / 12);
            }

            // Build cards HTML
            const cardsHTML = json.data.map(nurse => {
                const years = calcExperience(nurse.workExperience);
                const specializations = nurse.specialization.join(',\n');

                return `
        <div class="nurse-card">
          <img src="${nurse.photoUrl}" alt="ექთანი">
          <h3>${nurse.firstname} ${nurse.lastname}</h3>
          <p><strong>გამოცდილება:</strong> ${years} წელი</p>
          <p>
            <b>სპეციალიზაცია:</b>
            ${specializations}
          </p>
          <button>✓ ვერიფიცირებული</button>
        </div>
      `;
            }).join('');

            container.insertAdjacentHTML('beforeend', cardsHTML);

        } catch (error) {
            console.error('ექთნების ჩატვირთვა ვერ მოხერხდა:', error);
        }
    }

    // Call on page load
    loadNurses();



    // Read ?service=injection from the URL, default to 'injection'
    const params = new URLSearchParams(window.location.search);
    const serviceKey = params.get('service') || 'injection';

    if (typeof SERVICES !== 'undefined') {
        const service = SERVICES[serviceKey] || SERVICES['injection'];

        // Fill in both step-1 and step-2
        ['s1', 's2'].forEach(prefix => {
            const iconEl = document.getElementById(prefix + '-icon');
            if (iconEl) {
                iconEl.innerHTML = service.icon;
                document.getElementById(prefix + '-name').textContent = service.name;
                const procList = document.getElementById(prefix + '-procs');
                procList.innerHTML = service.procedures.map(p =>
                    `<div class="proc-btn"><span>${p}</span><span class="price">ფასი</span></div>`
                ).join('');
            }
        });
    }

    // 6. View Toggles (Nurses & Form Views)
    const searchNurseBtn = document.getElementById("search-nurse-btn");
    const toggleFormBtn = document.getElementById("toggle-form-btn");
    const nursesSection = document.getElementById("nurses-section");
    const formView = document.getElementById("form-view");

    if (searchNurseBtn && toggleFormBtn && nursesSection && formView) {
        searchNurseBtn.addEventListener("click", () => {
            nursesSection.classList.remove("hidden");
            formView.classList.add("hidden");
            searchNurseBtn.style.borderBottom = "2px solid #000c66";
            toggleFormBtn.style.borderBottom = "none";
        });

        toggleFormBtn.addEventListener("click", () => {
            formView.classList.remove("hidden");
            nursesSection.classList.add("hidden");
            toggleFormBtn.style.borderBottom = "2px solid #000c66";
            searchNurseBtn.style.borderBottom = "none";
        });
    }

    // 7. Fetch Services from API
    try {
        const res = await fetch("https://carego.onrender.com/api/services");
        const servicesData = await res.json();
        const servicesEl = document.querySelector(".services");
        console.log(servicesData)
        if (servicesEl) {
            servicesData.data.forEach((service) => {
                const serviceCard = document.createElement("a");
                serviceCard.classList.add("service-card");

                const key = service.service_id || "injection";
                serviceCard.href = `service.html?service=${key}`;

                const img = document.createElement("img");
                img.src = service.img;
                img.alt = service.name;

                const h3 = document.createElement("h3");
                h3.innerText = service.name;

                serviceCard.append(img, h3);

                // Apply the same logic as in // 4. Service cards click interaction
                serviceCard.style.cursor = "pointer";
                serviceCard.addEventListener("click", (e) => {
                    let currentUser = null;
                    try { currentUser = JSON.parse(localStorage.getItem("user")); } catch(err) {}
                    
                    if (!currentUser || !currentUser.isLoggedIn) {
                        e.preventDefault();
                        const title = h3.innerText;
                        alert(`სერვისის („${title}“) დასაჯავშნად გთხოვთ გაიაროთ ავტორიზაცია.`);
                        window.location.href = "login.html";
                    }
                    // If logged in, it will naturally navigate to serviceCard.href
                });

                servicesEl.append(serviceCard);
            });
        }
    } catch (err) {
        console.error("სერვისების წამოღების შეცდომა:", err);
    }

    // 8. Load Leaflet Map
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.onload = function () {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;

        const map = L.map('map').setView([41.6941, 44.8337], 13); // თბილისი

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        let marker = null;
        const locationInput = document.querySelector('.location-input input');

        map.on('click', function (e) {
            const { lat, lng } = e.latlng;

            if (marker) marker.setLatLng(e.latlng);
            else marker = L.marker(e.latlng).addTo(map);

            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
                .then(r => r.json())
                .then(data => {
                    if (locationInput) {
                        locationInput.value = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                    }
                })
                .catch(() => {
                    if (locationInput) locationInput.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                });
        });

        // Search location from text input
        if (locationInput) {
            let searchTimeout;
            locationInput.addEventListener('input', function () {
                clearTimeout(searchTimeout);
                const val = this.value.trim();
                if (val.length < 4) return;
                searchTimeout = setTimeout(() => {
                    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=1`)
                        .then(r => r.json())
                        .then(data => {
                            if (data.length > 0) {
                                const lat = parseFloat(data[0].lat);
                                const lng = parseFloat(data[0].lon);
                                map.setView([lat, lng], 15);
                                if (marker) marker.setLatLng([lat, lng]);
                                else marker = L.marker([lat, lng]).addTo(map);
                            }
                        });
                }, 600);
            });
        }

        // Re-render map size when view switches to step 2
        const goToStep2Btn = document.getElementById('goToStep2');
        if (goToStep2Btn) {
            goToStep2Btn.addEventListener('click', function () {
                setTimeout(() => map.invalidateSize(), 100);
            });
        }
    };
    document.head.appendChild(script);

    // 9. Multi-step navigation (Step 1 -> Step 2)
    const goToStep2Btn = document.getElementById('goToStep2');
    if (goToStep2Btn) {
        goToStep2Btn.addEventListener('click', function () {
            document.getElementById('step-1')?.classList.add('hidden');
            document.getElementById('step-2')?.classList.remove('hidden');
            window.scrollTo(0, 0);
        });
    }

    // 10. Allergy alerts
    const aYes = document.getElementById('allergy-yes');
    const aNo = document.getElementById('allergy-no');
    const box = document.getElementById('allergy-alert-text');

    if (aYes && aNo && box) {
        aYes.addEventListener('click', () => {
            aYes.classList.add('active');
            aNo.classList.remove('active');
            box.innerText = '⚠️ გთხოვთ, ექთანს მოსვლისთანავე წარუდგინოთ დეტალური ინფორმაცია ალერგიის შესახებ!';
            box.style.color = '#c0392b';
        });
        aNo.addEventListener('click', () => {
            aNo.classList.add('active');
            aYes.classList.remove('active');
            box.innerText = 'გთხოვთ მიუთითოთ გაქვთ თუ არა რომელიმე მედიკამენტზე ალერგია';
            box.style.color = '#555';
        });
    }

    const cYes = document.getElementById('chronic-yes');
    const cNo = document.getElementById('chronic-no');
    if (cYes && cNo) {
        cYes.addEventListener('click', () => { cYes.classList.add('active'); cNo.classList.remove('active'); });
        cNo.addEventListener('click', () => { cNo.classList.add('active'); cYes.classList.remove('active'); });
    }

    // 11. Calendar Logic
    const GEO_MONTHS = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];
    let calDate = new Date();
    let selectedDay = null;

    function renderCalendar() {
        const grid = document.getElementById('cal-grid');
        const label = document.getElementById('cal-month-label');
        if (!grid || !label) return;

        const year = calDate.getFullYear();
        const month = calDate.getMonth();
        label.textContent = GEO_MONTHS[month] + ' ' + year;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const firstDay = new Date(year, month, 1);
        let startOffset = firstDay.getDay() - 1;
        if (startOffset < 0) startOffset = 6;

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        grid.innerHTML = '';

        for (let i = 0; i < startOffset; i++) {
            const empty = document.createElement('div');
            empty.className = 'cday cempty';
            grid.appendChild(empty);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const cell = document.createElement('div');
            cell.className = 'cday';
            cell.textContent = d;

            const cellDate = new Date(year, month, d);
            cellDate.setHours(0, 0, 0, 0);

            if (cellDate < today) {
                cell.classList.add('cdisabled');
            } else {
                if (cellDate.getTime() === today.getTime()) cell.classList.add('ctoday');
                if (selectedDay && cellDate.getTime() === selectedDay.getTime()) cell.classList.add('cselected');

                cell.addEventListener('click', function () {
                    selectedDay = cellDate;
                    renderCalendar();
                });
            }
            grid.appendChild(cell);
        }
    }

    document.getElementById('cal-prev')?.addEventListener('click', () => {
        calDate.setMonth(calDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('cal-next')?.addEventListener('click', () => {
        calDate.setMonth(calDate.getMonth() + 1);
        renderCalendar();
    });

    if (goToStep2Btn) {
        goToStep2Btn.addEventListener('click', () => {
            setTimeout(renderCalendar, 50);
        });
    }

    renderCalendar();
});

document.getElementById('file-input').addEventListener('change', function () {
    const label = document.getElementById('file-label');
    if (this.files.length > 0) {
        label.textContent = this.files[0].name;
    } else {
        label.textContent = 'ფაილის ატვირთვა';
    }
});