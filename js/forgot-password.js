// =============================================
// CAREGO - PASSWORD RECOVERY LOGIC
// =============================================

document.addEventListener("DOMContentLoaded", () => {
    
    const recoveryForm = document.getElementById("recoveryForm");
    const recoveryInput = document.getElementById("recoveryInput");

    // შეცდომის წითელი ტექსტის გამოჩენის უნივერსალური ფუნქცია
    function showErrorMessage(message) {
        // ჯერ ვშლით ძველ შეცდომას, თუ ის უკვე არსებობს ეკრანზე
        let existingError = document.querySelector(".error-message");
        if (existingError) {
            existingError.remove();
        }

        // ვქმნით ახალ <p> ელემენტს და ვადებთ CSS კლასს
        const errorParagraph = document.createElement("p");
        errorParagraph.className = "error-message";
        errorParagraph.innerText = message;

        // ჩავსვამთ დამხმარე ტექსტის (helper-text) შემდეგ, უშუალოდ ფორმის წინ
        const helperText = document.querySelector(".helper-text");
        if (helperText) {
            helperText.insertAdjacentElement("afterend", errorParagraph);
        }
    }

    // ფორმის გაგზავნის (Submit) ვალიდაცია
    if (recoveryForm) {
        recoveryForm.addEventListener("submit", (e) => {
            e.preventDefault(); // ვაჩერებთ გვერდის გადატვირთვას

            const inputValue = recoveryInput.value.trim();

            // ა) ვამოწმებთ, ცარიელი ხომ არ არის ველი
            if (inputValue === "") {
                showErrorMessage("გთხოვთ შეავსოთ ელ-ფოსტის ველი!");
                return;
            }

            // ბ) ელ-ფოსტის ფორმატის მარტივი შემოწმება (@ სიმბოლოს არსებობა)
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(inputValue)) {
                showErrorMessage("ბოდიშს გიხდით, ელ-ფოსტის ფორმატი არასწორია. გთხოვთ ახლიდან სცადოთ.");
                return;
            }

            // თუ ვალიდაცია წარმატებით გაიარა:
            // ვშლით წითელ შეცდომას, თუ არსებობდა
            let existingError = document.querySelector(".error-message");
            if (existingError) {
                existingError.remove();
            }

            alert(`აღდგენის ბმული წარმატებით გაიგზავნა მისამართზე: ${inputValue}`);
            window.location.href = "login.html"; // ვაბრუნებთ ლოგინის გვერდზე
        });
    }
});