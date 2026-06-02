document.getElementById("loginBtn").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        return alert("Enter username and password");
    }

    try {
        const res = await fetch("http://localhost:4000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
            return alert(data.message);
        }

        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";

    } catch (err) {
        alert("Server error");
    }
});