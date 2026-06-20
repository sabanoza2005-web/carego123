// =============================================
// CAREGO - ROLE SELECTION LOGIC (REGISTER)
// =============================================

document.addEventListener("DOMContentLoaded", () => {
    
    const roleCards = document.querySelectorAll(".role-card");

    roleCards.forEach(card => {
        card.addEventListener("click", function() {
            // ვიღებთ არჩეულ როლს data-role ატრიბუტიდან ('nurse' ან 'patient')
            const selectedRole = this.getAttribute("data-role");

            // ვინახავთ ბრაუზერის მეხსიერებაში სამომავლოდ
            localStorage.setItem("userRole", selectedRole);

            // გადამისამართება ზუსტ გვერდებზე არჩევანის მიხედვით
            if (selectedRole === "nurse") {
                window.location.href = "register-nurse.html";
            } else if (selectedRole === "patient") {
                window.location.href = "register-patient.html";
            }
        });
    });

});