export async function setUpPage () {
    const pickemImages = document.getElementById("pickemImages");
    const pickemBody = document.getElementById("pickemBody");

    const responseBody = JSON.parse(localStorage.getItem("responseBody"));
    const imageUrl = localStorage.getItem("imageUrl");
    const omrImageUrl = base64ToDataURL(responseBody["image_base64"]);

    const image = document.createElement("img");
    image.className = "response__image";
    image.src = imageUrl;
    const omrImage = document.createElement("img");
    omrImage.className = "response__image";
    omrImage.src = omrImageUrl;
    pickemImages.innerHTML = "";
    pickemImages.appendChild(image);
    pickemImages.appendChild(omrImage);

    pickemBody.innerHTML = jsonToInnerHtml(responseBody["results"]);
}

function base64ToDataURL(base64) {
  const bytes = base64ToUint8(base64);
  const blob = new Blob([bytes], { type: "image/png" });
  return URL.createObjectURL(blob);
}

function base64ToUint8(base64) {
  const image_binary = atob(base64);
  const image_bytes = new Uint8Array(image_binary.length);
  for (let i = 0; i < image_binary.length; i++) {
      image_bytes[i] = image_binary.charCodeAt(i);
  }
  return image_bytes;
}

function jsonToInnerHtml(results) {
  let html = "";
  html += "<div>Score: " + results["score"] + "</div>";
  html += "<div>Week: " + results["Week"] + "</div>";
  let i = 1;
  do {
    html += "<div>Game " + i + ": " + parseGame(results["Game" + i]) + "</div>";
  } while ("Game" + ++i in results);
  i = 1;
  do {
    html += "<div>Score " + i + ": " + parseGame(results["Score" + i]) + "</div>";
  } while ("Score" + ++i in results);
  i = 1;
  let phone = "";
  do {
    phone += results["Phone" + i];
  } while ("Phone" + ++i in results);
  html += "<div>Phone: " + phone + "</div>";
  return html;
}

function parseGame(gameResult) {
  if (gameResult == "A") {
    return "Away";
  } else if (gameResult == "H") {
    return "Home";
  } else {
    return gameResult;
  }
}

export function clearLocalStorage() {
  localStorage.removeItem("responseBody");
  localStorage.removeItem("imageUrl");
}
