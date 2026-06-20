// =============================================
// CAREGO - CHANGE PASSWORD LOGIC & VALIDATION
// =============================================

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("changePasswordForm");
    const identifierInput = document.getElementById("identifier");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const errorText = document.getElementById("errorText");
    
    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

    // 1. პაროლის SVG ხილვადობის მართვა
    function setupPasswordToggle(inputEl, toggleWrapperEl) {
        if (toggleWrapperEl && inputEl) {
            const eyeOpen = toggleWrapperEl.querySelector(".eye-open");
            const eyeClosed = toggleWrapperEl.querySelector(".eye-closed");

            toggleWrapperEl.addEventListener("click", () => {
                if (inputEl.type === "password") {
                    inputEl.type = "text";
                    eyeOpen.style.display = "none";
                    eyeClosed.style.display = "block";
                } else {
                    inputEl.type = "password";
                    eyeOpen.style.display = "block";
                    eyeClosed.style.display = "none";
                }
            });
        }
    }

    setupPasswordToggle(passwordInput, togglePassword);
    setupPasswordToggle(confirmPasswordInput, toggleConfirmPassword);

    // 2. იმეილის და ტელეფონის ფორმატის ვალიდაცია (Regex)
    function validateIdentifier(value) {
        // იმეილის სტანდარტული ფორმატი
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // ტელეფონის ნომერი (მხოლოდ ციფრები, მინიმუმ 9 სიმბოლო)
        const phoneRegex = /^\+?[0-9]{9,15}$/;

        return emailRegex.test(value) || phoneRegex.test(value);
    }

    // 3. პაროლის უსაფრთხოების წესები (მინიმუმ 8 სიმბოლო, დიდი, პატარა და სპეციალური ნიშანი)
    function validatePasswordRules(pass) {
        return pass.length >= 8 &&                               
               /[A-Z]/.test(pass) &&                             
               /[a-z]/.test(pass) &&                             
               /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass); 
    }

    // 4. ფორმის გაგზავნა და ვალიდაცია
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            errorText.style.display = "none";
            errorText.innerText = "";

            const identifierValue = identifierInput.value.trim();
            const passwordValue = passwordInput.value;
            const confirmPasswordValue = confirmPasswordInput.value;

            // ა) ცარიელი ველების შემოწმება
            if (identifierValue === "" || passwordValue === "" || confirmPasswordValue === "") {
                errorText.innerText = "გთხოვთ შეავსოთ ყველა ველი!";
                errorText.style.display = "block";
                return;
            }

            // ბ) ახალი იმეილის / ტელეფონის ვალიდაცია
            if (!validateIdentifier(identifierValue)) {
                errorText.innerText = "გთხოვთ შეიყვანოთ სწორი ელ-ფოსტა ან ტელეფონის ნომერი!";
                errorText.style.display = "block";
                return;
            }

            // გ) პაროლის სირთულის შემოწმება
            if (!validatePasswordRules(passwordValue)) {
                errorText.innerText = "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს, დიდ ასოს, პატარა ასოს და სიმბოლოს (მაგ: !, ?, @)!";
                errorText.style.display = "block";
                return;
            }

            // დ) განმეორებითი პაროლის დამთხვევა
            if (passwordValue !== confirmPasswordValue) {
                errorText.innerText = "განმეორებითი პაროლი არ ემთხვევა პირველს!";
                errorText.style.display = "block";
                return;
            }

            // ე) წარმატებული დასრულება
            window.location.href = "login.html";
        });
    }
});