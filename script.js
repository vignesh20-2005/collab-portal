const API = "http://localhost:5000";

/* SWITCH PAGE */
function switchPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");

    if (id === "dashboard") loadDashboard();
    if (id === "ngoDashboard") loadNGOPage();
    if (id === "volDashboard") loadVolunteerPage();
    if (id === "donorDashboard") loadDonorPage();
}

/* TOAST */
function toast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2000);
}

/* ----------------------------- NGO ----------------------------- */

let ngoWorkList = [];

function addNGOWork() {
    if (ngoWorkInput.value.trim() === "") return;
    ngoWorkList.push(ngoWorkInput.value);
    ngoWorkInput.value = "";
}

async function registerNGO() {
    const data = {
        name: ngoName.value,
        mission: ngoMission.value,
        contact: ngoContact.value,
        location: ngoLocation.value,
        category: ngoCategory.value,
        work: ngoWorkList
    };

    await fetch(`${API}/ngo`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    toast("NGO Registered!");

    ngoName.value = "";
    ngoMission.value = "";
    ngoContact.value = "";
    ngoLocation.value = "";
    ngoCategory.value = "";
    ngoWorkList = [];

    loadNGOPage();
    loadDashboard();
}

async function loadNGOPage() {
    const ngos = await fetch(`${API}/ngo`).then(r => r.json());
    const volunteers = await fetch(`${API}/volunteer`).then(r => r.json());
    const donors = await fetch(`${API}/donor`).then(r => r.json());

    ngoCards.innerHTML = "";

    ngos.forEach(ngo => {
        const volList = volunteers.filter(v => v.ngo === ngo._id);
        const donList = donors.filter(d => d.ngo === ngo._id);

        ngoCards.innerHTML += `
            <div class="list-card">
                <h3>${ngo.name}</h3>
                <p>${ngo.location} | ${ngo.category}</p>

                <p><b>Volunteers (${volList.length})</b></p>
                <ul>${volList.map(v => `<li>${v.name} (${v.skills})</li>`).join("")}</ul>

                <p><b>Donors (${donList.length})</b></p>
                <ul>${donList.map(d => `<li>${d.name} → ${d.donation}</li>`).join("")}</ul>

                <button class="delete-btn" onclick="deleteNGO('${ngo._id}')">Delete</button>
            </div>
        `;
    });
}

async function deleteNGO(id) {
    await fetch(`${API}/ngo/${id}`, { method: "DELETE" });
    toast("NGO Deleted");
    loadNGOPage();
    loadDashboard();
}

/* --------------------------- VOLUNTEER --------------------------- */

async function loadVolunteerPage() {
    const ngos = await fetch(`${API}/ngo`).then(r => r.json());
    const volunteers = await fetch(`${API}/volunteer`).then(r => r.json());

    ngoDropdown.innerHTML = "";
    volCards.innerHTML = "";
    volNGOCards.innerHTML = "";

    ngos.forEach(ngo => {
        ngoDropdown.innerHTML += `<option value="${ngo._id}">${ngo.name}</option>`;
        volNGOCards.innerHTML += `
            <div class="list-card">
                <h3>${ngo.name}</h3>
                <p>${ngo.location}</p>
            </div>`;
    });

    volunteers.forEach(v => {
        volCards.innerHTML += `
            <div class="list-card">
                <h3>${v.name}</h3>
                <p>${v.skills}</p>
                <button class="delete-btn" onclick="deleteVolunteer('${v._id}')">Delete</button>
            </div>`;
    });

    showVolunteerNGOInfo();
}

async function showVolunteerNGOInfo() {
    const ngos = await fetch(`${API}/ngo`).then(r => r.json());
    const selected = ngos.find(n => n._id === ngoDropdown.value);
    if (!selected) return;

    volNgoInfo.innerHTML = `
        <h3>${selected.name}</h3>
        <p>${selected.location}</p>
        <p>Contact: ${selected.contact}</p>
    `;
}

async function joinNGO() {
    const ngos = await fetch(`${API}/ngo`).then(r => r.json());
    const selected = ngos.find(n => n._id === ngoDropdown.value);

    await fetch(`${API}/volunteer`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: volName.value,
            skills: volSkills.value,
            phone: volPhone.value,
            location: volLocation.value,
            ngo: ngoDropdown.value
        })
    });

    toast(`Volunteer joined ${selected.name}!`);

    volName.value = "";
    volSkills.value = "";
    volPhone.value = "";
    volLocation.value = "";

    loadVolunteerPage();
    loadDashboard();
}

async function deleteVolunteer(id) {
    await fetch(`${API}/volunteer/${id}`, { method: "DELETE" });
    toast("Volunteer Deleted");
    loadVolunteerPage();
    loadDashboard();
}

/* ----------------------------- DONOR ----------------------------- */

function updateDonationFields() {
    const type = donationType.value;

    const fields = {
        Money: `<input id="donDetail" placeholder="Amount ₹">`,
        Food: `<input id="donDetail" placeholder="Food Details">`,
        Clothes: `<input id="donDetail" placeholder="Clothes Details">`,
        Books: `<input id="donDetail" placeholder="Books">`,
        Medicine: `<input id="donDetail" placeholder="Medicine Details">`,
        Other: `<input id="donDetail" placeholder="Donation Info">`
    };

    donationFields.innerHTML = fields[type] || "";
}

async function loadDonorPage() {
    const ngos = await fetch(`${API}/ngo`).then(r => r.json());
    const donors = await fetch(`${API}/donor`).then(r => r.json());

    donorNgoDropdown.innerHTML = "";
    donorCards.innerHTML = "";
    donorNGOCards.innerHTML = "";

    ngos.forEach(ngo => {
        donorNgoDropdown.innerHTML += `<option value="${ngo._id}">${ngo.name}</option>`;
        donorNGOCards.innerHTML += `
            <div class="list-card">
                <h3>${ngo.name}</h3>
                <p>${ngo.location}</p>
            </div>`;
    });

    donors.forEach(d => {
        donorCards.innerHTML += `
            <div class="list-card">
                <h3>${d.name}</h3>
                <p>${d.donation}: ${d.message}</p>
                <button class="delete-btn" onclick="deleteDonor('${d._id}')">Delete</button>
            </div>`;
    });

    showDonorNGOInfo();
}

async function showDonorNGOInfo() {
    const ngos = await fetch(`${API}/ngo`).then(r => r.json());
    const selected = ngos.find(n => n._id === donorNgoDropdown.value);
    if (!selected) return;

    donorNgoInfo.innerHTML = `
        <h3>${selected.name}</h3>
        <p>${selected.location}</p>
        <p>Contact: ${selected.contact}</p>
    `;
}

async function donate() {
    const ngos = await fetch(`${API}/ngo`).then(r => r.json());
    const selected = ngos.find(n => n._id === donorNgoDropdown.value);
    const detail = document.querySelector("#donDetail")?.value || "";

    await fetch(`${API}/donor`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: donorName.value,
            phone: donorPhone.value,
            donation: donationType.value,
            message: detail,
            ngo: donorNgoDropdown.value
        })
    });

    toast(`Donation made to ${selected.name}!`);

    donorName.value = "";
    donorPhone.value = "";
    donationType.value = "";
    donationFields.innerHTML = "";

    loadDonorPage();
    loadDashboard();
}

async function deleteDonor(id) {
    await fetch(`${API}/donor/${id}`, { method: "DELETE" });
    toast("Donor Deleted");
    loadDonorPage();
    loadDashboard();
}

/* --------------------------- DASHBOARD --------------------------- */

async function loadDashboard() {
    const ngos = await fetch(`${API}/ngo`).then(r => r.json());
    const volunteers = await fetch(`${API}/volunteer`).then(r => r.json());
    const donors = await fetch(`${API}/donor`).then(r => r.json());

    ngoCount.innerText = ngos.length;
    volCount.innerText = volunteers.length;
    donorCount.innerText = donors.length;

    featuredNGOs.innerHTML = ngos
        .map(n => `<div class="scroll-card"><h3>${n.name}</h3><p>${n.location}</p></div>`)
        .join("");

    featuredVolunteers.innerHTML = volunteers
        .map(v => `<div class="scroll-card"><h3>${v.name}</h3><p>${v.skills}</p></div>`)
        .join("");

    featuredDonors.innerHTML = donors
        .map(d => `<div class="scroll-card"><h3>${d.name}</h3><p>${d.donation}</p></div>`)
        .join("");

    dashboardNGOs.innerHTML = ngos
        .map(n => `
            <div class="list-card">
                <h3>${n.name}</h3>
                <p>${n.location}</p>
            </div>
        `)
        .join("");

    dashboardVolunteers.innerHTML = volunteers
        .map(v => `
            <div class="list-card">
                <h3>${v.name}</h3>
                <p>${v.skills}</p>
            </div>
        `)
        .join("");

    dashboardDonors.innerHTML = donors
        .map(d => `
            <div class="list-card">
                <h3>${d.name}</h3>
                <p>${d.donation}: ${d.message}</p>
            </div>
        `)
        .join("");
}

/* INITIAL */
loadDashboard();
switchPage("dashboard");
