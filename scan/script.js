const pickemImages = document.getElementById("pickemImages");
const pickemLabel = document.getElementById("pickemLabel");
const pickemInput = document.getElementById("pickemInput");

pickemInput.addEventListener("change", function(event) {
    const files = [...event.target.files];
    if (files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const image = document.createElement("img");
            image.onclick = function() {
                pickemInput.click();
            };
            image.className = "scan__image";
            image.src = e.target.result;

            pickemImages.innerHTML = "";
            pickemImages.appendChild(image);
        };

        const file = files[0];
        reader.readAsDataURL(file);
        pickemLabel.textContent = file.name;
    } else {
        pickemImages.innerHTML = "";
        pickemLabel.textContent = "Choose file";
    }
});

function processPickem() {
    // Does nothing for now.
    console.log("Process the pickem");
}

function navigateHome() {
    window.location.assign("../index.html");
}
