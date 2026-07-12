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
