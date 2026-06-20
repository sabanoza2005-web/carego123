document.addEventListener("DOMContentLoaded", () => {
    const cardForm = document.getElementById("addCardForm");
    const cardNumberInput = document.getElementById("cardNumber");
    const cardExpiryInput = document.getElementById("cardExpiry");

    // ბარათის ნომრის ავტომატური დაშორება (XXXX XXXX XXXX XXXX)
    cardNumberInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        let formattedValue = "";
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += " ";
            }
            formattedValue += value[i];
        }
        e.target.value = formattedValue;
    });

    // ვადის დაფორმატება ავტომატური სლეშით (MM/YY)
    cardExpiryInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\//g, "").replace(/[^0-9]/gi, "");
        if (value.length >= 2) {
            e.target.value = value.substring(0, 2) + "/" + value.substring(2, 4);
        } else {
            e.target.value = value;
        }
    });

    // ფორმის გაგზავნის დადასტურება
    cardForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const number = cardNumberInput.value.replace(/\s/g, "");
        const expiry = cardExpiryInput.value;

        if (number.length < 16) {
            alert("გთხოვთ შეიყვანოთ ბარათის სრული ნომერი.");
            return;
        }

        
        // წარმატებით დასრულების შემდეგ მომხმარებელი ბრუნდება პროფილზე
        window.location.href = "profile-patient.html";
    });
});