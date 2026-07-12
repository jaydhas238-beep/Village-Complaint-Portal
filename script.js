const form = document.getElementById("complaintForm");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const mobile = document.getElementById("mobile").value;
        const category = document.getElementById("category").value;
        const description = document.getElementById("description").value;
        const photo = document.getElementById("photo").files[0];

        if (!photo) {
            alert("Please upload a photo.");
            return;
        }

        const reader = new FileReader();

        reader.onload = function () {

            let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

            const complaint = {
                id: "VC" + String(complaints.length + 1).padStart(3, "0"),
                name,
                mobile,
                category,
                description,
                photo: reader.result,
                status: "Pending"
            };

            complaints.push(complaint);

            localStorage.setItem("complaints", JSON.stringify(complaints));

            alert("Complaint Submitted Successfully!\nComplaint ID: " + complaint.id);

            form.reset();
        };

        reader.readAsDataURL(photo);

    });
}

const tableBody = document.querySelector("#complaintsTable tbody");

if (tableBody) {

    const complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    complaints.forEach((complaint) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${complaint.id}</td>
            <td>${complaint.name}</td>
            <td>${complaint.category}</td>
            <td>${complaint.description}</td>
            <td>
                <img src="${complaint.photo}" width="80">
            </td>
            <td>${complaint.status}</td>
        `;

        tableBody.appendChild(row);

    });

}


// ================= ADMIN DASHBOARD =================

const adminContainer = document.getElementById("adminContainer");

if (adminContainer) {

    const complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    complaints.forEach((complaint, index) => {

        const card = document.createElement("div");
        card.className = "admin-card";

        card.innerHTML = `
            <h2>${complaint.id}</h2>

            <p><strong>Name:</strong> ${complaint.name}</p>

            <p><strong>Category:</strong> ${complaint.category}</p>

            <p><strong>Description:</strong> ${complaint.description}</p>

            <h4>Before Photo</h4>

            <img src="${complaint.photo}" alt="Complaint Photo">

            <br><br>

            <label>Status</label>

            <select id="status-${index}">
                <option value="Pending" ${complaint.status=="Pending"?"selected":""}>Pending</option>
                <option value="In Progress" ${complaint.status=="In Progress"?"selected":""}>In Progress</option>
                <option value="Resolved" ${complaint.status=="Resolved"?"selected":""}>Resolved</option>
            </select>

            <br>

            <label>Upload Completed Work Photo</label>

            <input type="file" id="afterPhoto-${index}" accept="image/*">

            <br>

            <label>Remark</label>

            <textarea id="remark-${index}" rows="3">${complaint.remark || ""}</textarea>

            <br>

            <button class="updateBtn" onclick="updateComplaint(${index})">
                Update Complaint
            </button>
        `;

        adminContainer.appendChild(card);

    });

}

function updateComplaint(index) {

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    const status = document.getElementById(`status-${index}`).value;
    const remark = document.getElementById(`remark-${index}`).value;
    const afterPhoto = document.getElementById(`afterPhoto-${index}`).files[0];

    complaints[index].status = status;
    complaints[index].remark = remark;

    if(afterPhoto){

        const reader = new FileReader();

        reader.onload = function(){

            complaints[index].afterPhoto = reader.result;

            localStorage.setItem("complaints", JSON.stringify(complaints));

            alert("Complaint Updated Successfully!");

            location.reload();

        }

        reader.readAsDataURL(afterPhoto);

    }
    else{

        localStorage.setItem("complaints", JSON.stringify(complaints));

        alert("Complaint Updated Successfully!");

        location.reload();

    }

}


function trackComplaint(){

    const id=document.getElementById("trackId").value.trim().toUpperCase();

    const complaints=JSON.parse(localStorage.getItem("complaints")) || [];

    const complaint=complaints.find(c=>c.id===id);

    const result=document.getElementById("trackResult");

    if(!complaint){

        result.innerHTML="<h2>Complaint Not Found</h2>";

        return;

    }

    result.innerHTML=`

    <div class="result-card">

        <h2>${complaint.id}</h2>

        <p><strong>Name:</strong> ${complaint.name}</p>

        <p><strong>Category:</strong> ${complaint.category}</p>

        <p><strong>Status:</strong> ${complaint.status}</p>

        <p><strong>Remark:</strong> ${complaint.remark || "No remarks yet."}</p>

        <h3>Before Photo</h3>

        <img src="${complaint.photo}">

        ${
            complaint.afterPhoto
            ?
            `<h3>After Completion Photo</h3>
             <img src="${complaint.afterPhoto}">`
            :
            ""
        }

    </div>

    `;

}
