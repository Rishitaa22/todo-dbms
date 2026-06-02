const token = localStorage.getItem("token");

// Protect page
if (!token) {
    window.location.href = "login.html";
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});

// Load profile
async function loadProfile() {
    try {
        const res = await fetch("http://localhost:4000/user/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }

        const user = await res.json();

        document.getElementById("usernameField").textContent = user.username || "N/A";
        document.getElementById("nameField").textContent = user.fullName || "Not provided";
        document.getElementById("emailField").textContent = user.email || "Not provided";

        // Store current values for editing
        currentUserData = user;

    } catch (err) {
        console.error("Error loading profile:", err);
        document.getElementById("usernameField").textContent = "Error loading";
        document.getElementById("nameField").textContent = "Error loading";
        document.getElementById("emailField").textContent = "Error loading";
    }
}

let currentUserData = null;

loadProfile();

// Edit profile functionality
document.getElementById("editProfileBtn").addEventListener("click", () => {
    document.getElementById("profileView").style.display = "none";
    document.getElementById("profileEdit").style.display = "block";
    
    // Populate edit form with current data
    document.getElementById("editUsername").value = currentUserData?.username || "";
    document.getElementById("editName").value = currentUserData?.fullName || "";
    document.getElementById("editEmail").value = currentUserData?.email || "";
});

document.getElementById("cancelEditBtn").addEventListener("click", () => {
    document.getElementById("profileEdit").style.display = "none";
    document.getElementById("profileView").style.display = "block";
});

document.getElementById("saveProfileBtn").addEventListener("click", async () => {
    const username = document.getElementById("editUsername").value.trim();
    const fullName = document.getElementById("editName").value.trim();
    const email = document.getElementById("editEmail").value.trim();

    if (!username) {
        alert("Username is required");
        return;
    }

    try {
        const res = await fetch("http://localhost:4000/user/edit", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ username, fullName, email })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to update profile");
        }

        alert("Profile updated successfully!");
        document.getElementById("profileEdit").style.display = "none";
        document.getElementById("profileView").style.display = "block";
        loadProfile(); // Reload profile data

    } catch (err) {
        console.error("Error updating profile:", err);
        alert(`Failed to update profile: ${err.message}`);
    }
});