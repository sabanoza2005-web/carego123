document.addEventListener("DOMContentLoaded", () => {
    let currentUser = null;
    try { currentUser = JSON.parse(localStorage.getItem("user")); } catch(e) {}
    if (currentUser && currentUser.isLoggedIn) {
        // Find "პროფილი" link
        const navLinks = Array.from(document.querySelectorAll("nav a"));
        const profileLink = navLinks.find(a => a.innerText.trim() === "პროფილი" || a.getAttribute("href").includes("profile"));
        
        if (profileLink && !document.getElementById("logout-btn")) {
            const logoutA = document.createElement("a");
            logoutA.href = "#";
            logoutA.innerText = "გამოსვლა";
            logoutA.id = "logout-btn";
            logoutA.style.color = "#c0392b";
            logoutA.style.cursor = "pointer";
            logoutA.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("user");
                alert("თქვენ გამოხვედით სისტემიდან.");
                window.location.href = "index.html";
            });
            
            // If the parent is a list item, we insert a new list item
            if (profileLink.parentElement.tagName === "LI") {
                const logoutLi = document.createElement("li");
                logoutLi.appendChild(logoutA);
                profileLink.parentElement.insertAdjacentElement("afterend", logoutLi);
            } else {
                // If it's just an anchor next to anchors (like profile-nurse.html)
                logoutA.style.marginLeft = "15px";
                profileLink.insertAdjacentElement("afterend", logoutA);
            }
        }
    }
});
