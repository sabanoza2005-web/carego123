// ==========================================
// CAREGO - NURSES PAGE FUNCTIONALITY
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. უკან დაბრუნების ღილაკის (Back Button) ლოგიკა
    const backBtn = document.querySelector(".back-button a");
    if (backBtn) {
        backBtn.addEventListener("click", (e) => {
            // თუ ბრაუზერს აქვს ისტორია, აბრუნებს ზუსტად წინა გვერდზე
            if (document.referrer.includes(window.location.hostname)) {
                e.preventDefault();
                window.history.back();
            }
        });
    }

    // 2. Click interaction using event delegation for both static & dynamic cards
    const grid = document.querySelector(".nurses-grid");
    if (grid) {
        grid.addEventListener("click", (e) => {
            const card = e.target.closest(".nurse-card");
            if (card) {
                const nurseName = card.querySelector("h3").innerText;
                alert(`თქვენ აირჩიეთ ექთანი: ${nurseName}\n\nსისტემა ამოწმებს ექთნის აქტიურ სტატუსს...`);
            }
        });
    }

    // 3. Fetch all nurses from API and render them (appended to static cards)
    async function loadAllNurses() {
        const container = document.querySelector('.nurses-grid');
        if (!container) return;

        try {
            const response = await fetch('https://carego.onrender.com/api/nurses');
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
                const specializations = nurse.specialization.join(', ');

                return `
                    <div class="nurse-card">
                        <img src="${nurse.photoUrl}" alt="ექთანი">
                        <h3>${nurse.firstname} ${nurse.lastname}</h3>
                        <p><b>გამოცდილება:</b> ${years} წელი</p>
                        <p><b>სპეციალიზაცია:</b> ${specializations}</p>
                    </div>
                `;
            }).join('');

            container.insertAdjacentHTML('beforeend', cardsHTML);

        } catch (error) {
            console.error('ექთნების ჩატვირთვა ვერ მოხერხდა:', error);
        }
    }

    loadAllNurses();
});