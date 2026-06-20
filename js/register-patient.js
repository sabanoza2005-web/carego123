// =============================================
// CAREGO - PATIENT REGISTRATION LOGIC
// =============================================

document.addEventListener("DOMContentLoaded", () => {
    
    const form = document.getElementById("patientRegisterForm");
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const togglePasswordIcon = document.getElementById("togglePassword");

    // 1. პაროლის ჩვენება / დამალვა (თვალის ხატულა)
    if (togglePasswordIcon && password) {
        togglePasswordIcon.addEventListener("click", () => {
            if (password.type === "password") {
                password.type = "text";
                togglePasswordIcon.classList.remove("fa-eye-slash");
                togglePasswordIcon.classList.add("fa-eye");
            } else {
                password.type = "password";
                togglePasswordIcon.classList.remove("fa-eye");
                togglePasswordIcon.classList.add("fa-eye-slash");
            }
        });
    }

    // 2. შეცდომის წითელი შეტყობინების გამოტანის უნივერსალური ფუნქცია
    function showErrorMessage(message) {
        let existingError = document.querySelector(".error-message");
        if (existingError) {
            existingError.remove();
        }

        const errorParagraph = document.createElement("p");
        errorParagraph.className = "error-message";
        errorParagraph.innerText = message;

        // ჩავსვამთ სათაურის (რეგისტრაცია) ქვემოთ, ფორმის წინ
        const pageTitle = document.querySelector(".page-title");
        if (pageTitle) {
            pageTitle.insertAdjacentElement("afterend", errorParagraph);
        }
    }

    // 3. ფორმის ვალიდაცია გაგზავნისას (Submit)
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // ა) ცარიელი ველების შემოწმება
            if (
                firstName.value.trim() === "" || 
                lastName.value.trim() === "" || 
                phone.value.trim() === "" || 
                email.value.trim() === "" || 
                password.value.trim() === ""
            ) {
                showErrorMessage("გთხოვთ შეავსოთ ყველა სავალდებულო ველი!");
                return;
            }

            // ბ) ელ-ფოსტის ფორმატის შემოწმება
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value.trim())) {
                showErrorMessage("გთხოვთ შეიყვანოთ ელ-ფოსტის სწორი ფორმატი!");
                return;
            }

            // გ) პაროლის სიმძლავრის შემოწმება (ჩვენი სტანდარტული შეცდომის ტექსტი)
            const passwordValue = password.value.trim();
            if (passwordValue.length < 8 || !/[A-Z]/.test(passwordValue) || !/[a-z]/.test(passwordValue) || !/\d/.test(passwordValue) || !/[@$!%*?&]/.test(passwordValue)) {
                showErrorMessage("ბოდიშს გიხდით, თქვენი პაროლი არასწორია. გთხოვთ ახლიდან სცადოთ.");
                return;
            }

            // თუ ყველაფერი სწორია, ვშლით ძველ შეცდომას
            let existingError = document.querySelector(".error-message");
            if (existingError) existingError.remove();

            alert("მომხმარებლის რეგისტრაცია წარმატებით დასრულდა!");
            
            // გადავიყვანოთ ავტორიზაციის (Login) გვერდზე
            window.location.href = "login.html";
        });
    }

});
