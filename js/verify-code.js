// =============================================
// CAREGO - 2FA VERIFICATION CODE LOGIC
// =============================================

document.addEventListener("DOMContentLoaded", () => {
    
    const form = document.getElementById("verifyCodeForm");
    const inputs = document.querySelectorAll(".code-digit");
    const btnResend = document.getElementById("btnResend");
    const errorText = document.getElementById("errorText");

    // პირობითი სწორი კოდი ტესტირებისთვის
    const CORRECT_CODE = "12345";

    // =========================================================
    // დინამიური ელემენტების მართვა წინა გვერდის მიხედვით (Referrer)
    // =========================================================
    const referrer = document.referrer.toLowerCase();
    const dividerWrapper = document.querySelector(".divider-wrapper");
    const registerRedirect = document.querySelector(".register-redirect");

    // თუ მომხმარებელი გადმოვიდა რეგისტრაციის პირობებიდან (nurse ან patient)
    if (referrer.includes("nurse-terms") || referrer.includes("patient-terms")) {
        if (dividerWrapper) dividerWrapper.style.setProperty("display", "none", "important");
        if (registerRedirect) registerRedirect.style.setProperty("display", "none", "important");
    } else {
        // სხვა შემთხვევაში (მაგალითად forgot-password) – ელემენტები იბრუნებენ თავდაპირველ CSS ცენტრირებას
        if (dividerWrapper) dividerWrapper.style.display = "";
        if (registerRedirect) registerRedirect.style.display = "";
    }

    // 1. ავტომატური გადასვლა უჯრიდან უჯრაზე (Auto-Focus)
    inputs.forEach((input, index) => {
        
        input.addEventListener("input", (e) => {
            const value = e.target.value;
            
            // ტექსტის ფერის დაბრუნება დეფოლტზე და დამალვა ახალი შეყვანისას
            errorText.style.color = "#ff0000";
            errorText.style.display = "none";

            if (!/^\d*$/.test(value)) {
                e.target.value = "";
                return;
            }

            if (value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && e.target.value.length === 0 && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });

    // 2. კოდის ხელახლა გაგზავნა
    if (btnResend) {
        btnResend.addEventListener("click", (e) => {
            e.preventDefault();
            
            errorText.style.color = "#ff0000";
            errorText.innerText = "ახალი კოდი წარმატებით გამოიგზავნა თქვენს მობილურზე!";
            errorText.style.display = "block";
            
            inputs.forEach(input => input.value = "");
            inputs[0].focus();
        });
    }

    // 3. ფორმის გაგზავნა (Submit) და შემოწმება
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            errorText.style.color = "#ff0000";
            errorText.style.display = "none";
            errorText.innerText = "";

            let fullCode = "";
            let isComplete = true;

            inputs.forEach(input => {
                if (input.value.trim() === "") {
                    isComplete = false;
                }
                fullCode += input.value.trim();
            });

            // ა) ცარიელი ველების შემოწმება
            if (!isComplete) {
                errorText.innerText = "გთხოვთ შეიყვანოთ კოდის ყველა ციფრი!";
                errorText.style.display = "block";
                return;
            }

            // ბ) კოდის სისწორის შემოწმება
            if (fullCode === CORRECT_CODE) {
                // წარმატებისას პირდაპირ გადადის მომდევნო გვერდზე
                window.location.href = "change-password.html"; 
            } else {
                // არასწორი კოდის წითელი გაფრთხილება
                errorText.innerText = "შეყვანილი კოდი არასწორია! გთხოვთ სცადოთ ხელახლა.";
                errorText.style.display = "block";
                
                inputs.forEach(input => input.value = "");
                inputs[0].focus();
            }
        });
    }
});