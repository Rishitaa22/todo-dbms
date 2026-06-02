document.addEventListener("DOMContentLoaded", () => {

    console.log("Signup JS Loaded");

    document.getElementById("signupBtn").addEventListener("click", async () => {

        const username = document.getElementById("username").value.trim();
        const fullName = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        console.log("Button clicked"); // DEBUG

        try {
            const res = await fetch("http://localhost:4000/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    password,
                    fullName,
                    email
                })
            });

            const data = await res.json();

            console.log(data); // DEBUG

            if (!res.ok) {
                return alert(data.message);
            }

            alert("Signup successful!");
            window.location.href = "login.html";

        } catch (err) {
            console.error(err);
            alert("Server error");
        }

    });

});