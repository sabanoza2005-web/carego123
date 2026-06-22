
document.addEventListener("DOMContentLoaded", () => {

    // 1. Smooth scroll for navigation & Auth/Profile routing
    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");

            // ვამოწმებთ, დააჭირა თუ არა მომხმარებელმა პროფილის ლინკს
            if (this.innerText.trim() === "პროფილი") {
                e.preventDefault(); // ვაჩერებთ სტანდარტულ გადასვლას
                
                // ვამოწმებთ, არის თუ არა მომხმარებელი უკვე სისტემაში შესული
                const isLoggedIn = localStorage.getItem("isLoggedIn");

                if (isLoggedIn === "true") {
                    // თუ შესულია, გადაგვყავს პროფილის გვერდზე (მაგ. profile.html)
                    alert("თქვენ უკვე ავტორიზებული ხართ. გადადიხართ პროფილის გვერდზე...");
                    window.location.href = "profile.html"; 
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
                    behavior: "smooth"
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


    // 3. Nurse card hover & click enhancement
    const nurseCards = document.querySelectorAll(".nurses .nurse-card");
    nurseCards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            card.style.transform = "scale(1.03)";
            card.style.transition = "all 0.2s ease";
            card.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.1)";
            card.style.cursor = "pointer";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "scale(1)";
            card.style.boxShadow = "none";
        });

        card.addEventListener("click", () => {
            const nurseName = card.querySelector("h3").innerText;
            alert(`ექთანთან (${nurseName}) დასაკავშირებლად საჭიროა სისტემაში შესვლა.`);
            window.location.href = "login.html";
        });
    });


    // 4. Service cards click interaction
    const serviceCards = document.querySelectorAll(".services .service-card");
    serviceCards.forEach(card => {
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
            const title = card.querySelector("h3").innerText;
            alert(`სერვისის („${title}“) დასაჯავშნად გთხოვთ გაიაროთ ავტორიზაცია.`);
            window.location.href = "login.html";
        });
    });

});

document.querySelectorAll('.service-card button').forEach(button => {
    button.addEventListener('click', (e) => {
        const buttonText = e.target.textContent.trim();
        
        if (buttonText === 'ინექცია') {
            window.location.href = 'injection.html'; // Opens your new page
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
   
    const searchNurseBtn = document.getElementById('search-nurse-btn');
    const toggleFormBtn = document.getElementById('toggle-form-btn');

   
    const nursesSection = document.getElementById('nurses-section');
    const formView = document.getElementById('form-view');


    searchNurseBtn.addEventListener('click', () => {
    
        nursesSection.classList.remove('hidden');
        formView.classList.add('hidden');

   
        searchNurseBtn.style.borderBottom = "2px solid #000c66";
        toggleFormBtn.style.borderBottom = "none";
    });

    
    toggleFormBtn.addEventListener('click', () => {
     
        formView.classList.remove('hidden');
        nursesSection.classList.add('hidden');

        toggleFormBtn.style.borderBottom = "2px solid #000c66";
        searchNurseBtn.style.borderBottom = "none";
    });
});

const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.onload = function() {
        const map = L.map('map').setView([41.6941, 44.8337], 13); // Tbilisi

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        let marker = null;
        const locationInput = document.querySelector('.location-input input');

        map.on('click', function(e) {
            const { lat, lng } = e.latlng;

            if (marker) marker.setLatLng(e.latlng);
            else marker = L.marker(e.latlng).addTo(map);

            // Reverse geocode with Nominatim (free, no key needed)
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
                .then(r => r.json())
                .then(data => {
                    locationInput.value = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                })
                .catch(() => {
                    locationInput.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                });
        });

        // When user types an address, search and pan map
        let searchTimeout;
        locationInput.addEventListener('input', function() {
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

        // Re-render map when step 2 becomes visible
        document.getElementById('goToStep2').addEventListener('click', function() {
            setTimeout(() => map.invalidateSize(), 100);
        });
    };
    document.head.appendChild(script);

    document.getElementById('goToStep2').addEventListener('click', function() {
        document.getElementById('step-1').classList.add('hidden');
        document.getElementById('step-2').classList.remove('hidden');
        window.scrollTo(0,0);
    });

    const aYes = document.getElementById('allergy-yes');
    const aNo  = document.getElementById('allergy-no');
    const box  = document.getElementById('allergy-alert-text');

    aYes.addEventListener('click', () => {
        aYes.classList.add('active'); aNo.classList.remove('active');
        box.innerText = '⚠️ გთხოვთ, ექთანს მოსვლისთანავე წარუდგინოთ დეტალური ინფორმაცია ალერგიის შესახებ!';
        box.style.color = '#c0392b';
    });
    aNo.addEventListener('click', () => {
        aNo.classList.add('active'); aYes.classList.remove('active');
        box.innerText = 'გთხოვთ მიუთითოთ გაქვთ თუ არა რომელიმე მედიკამენტზე ალერგია';
        box.style.color = '#555';
    });

    const cYes = document.getElementById('chronic-yes');
    const cNo  = document.getElementById('chronic-no');
    cYes.addEventListener('click', () => { cYes.classList.add('active'); cNo.classList.remove('active'); });
    cNo.addEventListener('click',  () => { cNo.classList.add('active'); cYes.classList.remove('active'); });

    // ── Calendar ──
    const GEO_MONTHS = ['იანვარი','თებერვალი','მარტი','აპრილი','მაისი','ივნისი','ივლისი','აგვისტო','სექტემბერი','ოქტომბერი','ნოემბერი','დეკემბერი'];

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
        today.setHours(0,0,0,0);

        // Day of week of 1st (convert Sun=0 to Mon=0)
        const firstDay = new Date(year, month, 1);
        let startOffset = firstDay.getDay() - 1;
        if (startOffset < 0) startOffset = 6;

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        grid.innerHTML = '';

        // Empty cells before first day
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
            cellDate.setHours(0,0,0,0);

            if (cellDate < today) {
                cell.classList.add('cdisabled');
            } else {
                if (cellDate.getTime() === today.getTime()) cell.classList.add('ctoday');
                if (selectedDay && cellDate.getTime() === selectedDay.getTime()) cell.classList.add('cselected');

                cell.addEventListener('click', function() {
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

    // Render when step 2 opens
    document.getElementById('goToStep2').addEventListener('click', () => {
        setTimeout(renderCalendar, 50);
    });

    renderCalendar();