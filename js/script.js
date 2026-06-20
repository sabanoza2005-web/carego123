
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