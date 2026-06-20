document.addEventListener("DOMContentLoaded", () => {

    // 1. აქტივობის ჩართვა/გამორთვის ფუნქციონალი
    const statusToggleBtn = document.getElementById("statusToggleBtn");
    
    if (statusToggleBtn) {
        statusToggleBtn.addEventListener("click", () => {
            if (statusToggleBtn.classList.contains("active-status")) {
                statusToggleBtn.classList.remove("active-status");
                statusToggleBtn.classList.add("inactive-status");
                statusToggleBtn.innerText = "სტატუსი: პასიური";
            } else {
                statusToggleBtn.classList.remove("inactive-status");
                statusToggleBtn.classList.add("active-status");
                statusToggleBtn.innerText = "სტატუსი: აქტიური";
            }
        });
    }

    // 2. კალენდრის დღეების რეალური დროით გენერირება (ჩარჩოების გარეშე)
    function renderProfileCalendar() {
        const calendarGrid = document.getElementById("profileCalendarGrid");
        const calendarTitle = document.getElementById("calendarTitle");
        if (!calendarGrid || !calendarTitle) return;

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); 
        const today = now.getDate();

        const monthNamesGeo = [
            "იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი",
            "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"
        ];
        
        calendarTitle.innerText = `${monthNamesGeo[currentMonth]} ${currentYear}`;

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        let startDayIndex = firstDayOfMonth.getDay() - 1;
        if (startDayIndex === -1) startDayIndex = 6; 

        const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const totalDaysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

        let gridHTML = "";

        // ა) წინა თვის ბოლო დღეები
        for (let i = startDayIndex; i > 0; i--) {
            const prevDay = totalDaysInPrevMonth - i + 1;
            gridHTML += `<div class="calendar-day-item muted-day">${prevDay}</div>`;
        }

        // ბ) მიმდინარე თვის დღეები (მხოლოდ დღევანდელი დღის მონიშვნით)
        for (let day = 1; day <= totalDaysInMonth; day++) {
            let customClass = "calendar-day-item";

            // მხოლოდ დღევანდელ რეალურ რიცხვს ვუფერადებთ ფონს მუქ ლურჯად
            if (day === today) {
                customClass += " blue-highlight";
            }

            // ზედმეტი ჩარჩოების (if პირობა) აქედან სრულად ამოღებულია

            gridHTML += `<div class="${customClass}">${day}</div>`;
        }

        // გ) მომდევნო თვის დღეები
        const totalFilledCells = startDayIndex + totalDaysInMonth;
        const remainingCells = 35 - totalFilledCells;
        
        for (let day = 1; day <= remainingCells; day++) {
            gridHTML += `<div class="calendar-day-item muted-day">${day}</div>`;
        }

        calendarGrid.innerHTML = gridHTML;
    }

    renderProfileCalendar();
});