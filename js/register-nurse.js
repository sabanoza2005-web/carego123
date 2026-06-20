// =============================================
// CAREGO - NURSE REGISTRATION LOGIC WITH VALIDATION
// =============================================

document.addEventListener("DOMContentLoaded", () => {
    
    const form = document.getElementById("nurseRegisterForm");
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const specialization = document.getElementById("specialization");
    const experience = document.getElementById("experience");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const togglePasswordIcon = document.getElementById("togglePassword");
    const diplomaUpload = document.getElementById("diplomaUpload");
    const fileNameDisplay = document.getElementById("fileNameDisplay");

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

    // 2. ატვირთული ფაილის სახელის დინამიური ასახვა
    if (diplomaUpload && fileNameDisplay) {
        diplomaUpload.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                // თუ ფაილი აირჩია, გამოვაჩინოთ მისი სახელი
                fileNameDisplay.innerText = e.target.files[0].name;
                fileNameDisplay.style.color = "#000000"; // ტექსტის ფერი გავამუქოთ
            } else {
                fileNameDisplay.innerText = "ფოტო/დიპლომი";
                fileNameDisplay.style.color = "#757575";
            }
        });
    }

    // 3. შეცდომის წითელი შეტყობინების გამოტანის ფუნქცია
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

    // 4. ფორმის ვალიდაცია გაგზავნისას
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // ა) ცარიელი ველების შემოწმება
            if (
                firstName.value.trim() === "" || 
                lastName.value.trim() === "" || 
                specialization.value.trim() === "" || 
                experience.value.trim() === "" || 
                phone.value.trim() === "" || 
                email.value.trim() === "" || 
                password.value.trim() === ""
            ) {
                showErrorMessage("გთხოვთ შეავსოთ ყველა სავალდებულო ველი!");
                return;
            }

            // ბ) ფაილის (დიპლომის) ატვირთვის შემოწმება
            if (diplomaUpload.files.length === 0) {
                showErrorMessage("გთხოვთ ატვირთოთ თქვენი ფოტო ან დიპლომი ვერიფიკაციისთვის!");
                return;
            }

            // გ) ელ-ფოსტის ფორმატის შემოწმება
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value.trim())) {
                showErrorMessage("გთხოვთ შეიყვანოთ ელ-ფოსტის სწორი ფორმატი!");
                return;
            }

            // დ) პაროლის სიმძლავრის შემოწმება
            const passwordValue = password.value.trim();
            if (passwordValue.length < 8 || !/[A-Z]/.test(passwordValue) || !/[a-z]/.test(passwordValue) || !/\d/.test(passwordValue) || !/[@$!%*?&]/.test(passwordValue)) {
                showErrorMessage("ბოდიშს გიხდით, თქვენი პაროლი არასწორია. გთხოვთ ახლიდან სცადოთ.");
                return;
            }

            // თუ ყველაფერი სწორია, ვშლით ძველ შეცდომას და ვარეგისტრირებთ
            let existingError = document.querySelector(".error-message");
            if (existingError) existingError.remove();

            alert("ექთნის რეგისტრაციის მოთხოვნა წარმატებით გაიგზავნა! ადმინისტრაცია მალე დაგიკავშირდებათ.");
            
            // გადავიყვანოთ ავტორიზაციის გვერდზე
            window.location.href = "login.html";
        });
    }

});