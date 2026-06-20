document.addEventListener("DOMContentLoaded", () => {

    // 1. უკან დაბრუნების ღილაკის ინტერაქცია
    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
        backBtn.addEventListener("click", (e) => {
            // თუ გვინდა, რომ ბრაუზერის ისტორიითაც უკან დაბრუნდეს, თუ პირდაპირი ლინკით არ მოვიდა
            if (document.referrer.includes("profile-patient.html")) {
                e.preventDefault();
                window.history.back();
            }
        });
    }

    // 2. პარამეტრების თითოეულ ოფციაზე კლიკის დამუშავება
    const settingItems = document.querySelectorAll(".setting-item");

    settingItems.forEach(item => {
        item.addEventListener("click", (event) => {
            const pageName = item.querySelector("span").innerText;
            
            // "გასვლა" ღილაკზე დაჭერისას უსაფრთხოების დადასტურება
            if (item.classList.contains("logout-item")) {
                const confirmLogout = confirm("ნამდვილად გსურთ სისტემიდან გასვლა?");
                if (!confirmLogout) {
                    event.preventDefault(); // აჩერებს გადამისამართებას, თუ მომხმარებელმა უარყო
                    return;
                }
            }
            
            console.log(`მომხმარებელი გადადის სექციაში: ${pageName}`);
        });
    });
});