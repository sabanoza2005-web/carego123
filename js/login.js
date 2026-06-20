// =============================================
// CAREGO - LOGIN & AUTHENTICATION LOGIC
// =============================================

document.addEventListener("DOMContentLoaded", () => {
    
    const authForm = document.getElementById("authForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePasswordIcon = document.getElementById("togglePassword");
    const btnRegister = document.getElementById("btnRegister");

    // 1. პაროლის ჩვენება / დამალვა (თვალის ხატულის ლოგიკა)
    if (togglePasswordIcon && passwordInput) {
        togglePasswordIcon.addEventListener("click", () => {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                togglePasswordIcon.classList.remove("fa-eye-slash");
                togglePasswordIcon.classList.add("fa-eye");
            } else {
                passwordInput.type = "password";
                togglePasswordIcon.classList.remove("fa-eye");
                togglePasswordIcon.classList.add("fa-eye-slash");
            }
        });
    }

    // 2. შეცდომის ტექსტის დინამიურად გამოჩენის უნივერსალური ფუნქცია
    function showErrorMessage(message) {
        // ჯერ ვშლით ძველ შეცდომას, თუ ის უკვე არსებობს
        let existingError = document.querySelector(".error-message");
        if (existingError) {
            existingError.remove();
        }

        // ვქმნით ახალ <p> ელემენტს და ვადებთ CSS კლასს
        const errorParagraph = document.createElement("p");
        errorParagraph.className = "error-message";
        errorParagraph.innerText = message;

        // ჩავსვათ სათაურის (შესვლა) შემდეგ, ფორმის დაწყებამდე
        const pageTitle = document.querySelector(".page-title");
        if (pageTitle) {
            pageTitle.insertAdjacentElement("afterend", errorParagraph);
        }
    }

    // 3. ფორმის ვალიდაცია გაგზავნისას (Login Submission)
    if (authForm) {
        authForm.addEventListener("submit", (e) => {
            e.preventDefault(); 

            const emailValue = emailInput.value.trim();
            const passwordValue = passwordInput.value.trim();

            // ა) ცარიელი ველების შემოწმება
            if (emailValue === "" || passwordValue === "") {
                showErrorMessage("გთხოვთ შეავსოთ ყველა სავალდებულო ველი!");
                return;
            }

            // ბ) ელ-ფოსტის ფორმატის შემოწმება
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailValue)) {
                showErrorMessage("გთხოვთ შეიყვანოთ ელ-ფოსტის სწორი ფორმატი!");
                return;
            }

            // გ) პაროლის სიმძლავრის შემოწმება (მაკეტის შეცდომის ტექსტი)
            if (passwordValue.length < 8 || !/[A-Z]/.test(passwordValue) || !/[a-z]/.test(passwordValue) || !/\d/.test(passwordValue) || !/[@$!%*?&]/.test(passwordValue)) {
                showErrorMessage("ბოდიშს გიხდით, თქვენი პაროლი არასწორია. გთხოვთ ახლიდან სცადოთ.");
                return;
            }

            // თუ ყველაფერი სწორია, ვშლით შეცდომის ტექსტს და შევდივართ საიტზე
            let existingError = document.querySelector(".error-message");
            if (existingError) existingError.remove();

            alert(`ავტორიზაცია წარმატებულია!\nმომხმარებელი: ${emailValue}`);
            localStorage.setItem("isLoggedIn", "true"); 
            window.location.href = "index.html"; 
        });
    }

    // 4. რეგისტრაციის ღილაკზე გადასვლა
    if (btnRegister) {
        btnRegister.addEventListener("click", () => {
            window.location.href = "register.html";
        });
    }

    // 5. მესამე მხარის (Social) სისტემები
    const socialButtons = document.querySelectorAll(".btn-social");
    socialButtons.forEach(button => {
        button.addEventListener("click", function() {
            const provider = this.innerText.trim();
            alert(`მიმდინარეობს კავშირი გარე პროვაიდერთან: ${provider}`);
        });
    });

});