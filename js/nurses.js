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

    // 2. ექთნების ბარათებზე Hover ეფექტის გაძლიერება
    const nurseCards = document.querySelectorAll(".nurse-page .nurse-card");
    
    nurseCards.forEach(card => {
        // მაუსის მიტანისას ბარათის ოდნავ გაზრდა
        card.addEventListener("mouseenter", () => {
            card.style.transform = "scale(1.04)";
            card.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.15)";
            card.style.borderColor = "#000b58";
            card.style.transition = "all 0.3s ease";
            card.style.cursor = "pointer";
        });

        // მაუსის მოშორებისას საწყის მდგომარეობაში დაბრუნება
        card.addEventListener("mouseleave", () => {
            card.style.transform = "scale(1)";
            card.style.boxShadow = "none";
            card.style.borderColor = "#bdbdbd";
        });

        // 3. ექთანზე დაწკაპუნების (Click) ლოგიკა
        card.addEventListener("click", () => {
            const nurseName = card.querySelector("h3").innerText;
            // დემო ვერსიისთვის გამოვაჩენთ ალერტს, შემდგომში აქ გაიხსნება ექთნის პროფილი ან ჯავშნის ფორმა
            alert(`თქვენ აირჩიეთ ექთანი: ${nurseName}\n\nსისტემა ამოწმებს ექთნის აქტიურ სტატუსს...`);
        });
    });
});