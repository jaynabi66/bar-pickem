const correctDisplay = {
    "Game1": "A",
    "Game2": "H",
    "Game3": "H",
    "Game4": "A",
    "Game5": "A",
    "Game6": "H",
    "Game7": "A",
    "Game8": "H",
    "Game9": "A",
    "Game10": "H",
    "Game11": "H",
    "Game12": "H",
    "Game13": "A",
    "Game14": "A",
    "Game15": "A",
    "Game16": "A",
};

const otherUsers = [
    {
        "name": "PLAYER_ID A",
        "score": 32,
        "week1": 10,
    },
    {
        "name": "PLAYER_ID B",
        "score": 49,
        "week1": 12,
    },
    {
        "name": "PLAYER_ID C",
        "score": 33,
        "week1": 9,
    },
    {
        "name": "PLAYER_ID D",
        "score": 58,
        "week1": 12,
    },
];

export async function setUpPage() {
    const responseBody = JSON.parse(localStorage.getItem("responseBody"));
    const results = responseBody != null ? responseBody["results"] : null;
    const tableBody = document.getElementsByTagName("tbody")[0];
    const tableRows = createTableRows(results);
    for (let row of tableRows) {
        tableBody.appendChild(row);
    }
}

function createTableRows(results) {
    let currentUser = [];
    if (results != null) {
        currentUser = [{
            "name": "Current User",
            "score": results["Score1"] + results["Score2"],
            "week1": calculateScore(results),
        }];
    }

    let users = [...currentUser, ...otherUsers];
    users.sort((a, b) => {
        let weekComp = b["week1"] - a["week1"];
        if (weekComp == 0) return a["name"].localeCompare(b["name"]);
        return weekComp;
    });

    let tableRows = [];
    for (let user of users) {
        const newTr = document.createElement("tr");
        let html = ""
        html += "<td>" + user["name"] + "</td>";
        html += "<td>" + user["score"] + "</td>";
        html += "<td>" + user["week1"] + "</td>";
        html += "<td>" + user["week1"] + "</td>";
        newTr.innerHTML = html;
        tableRows.push(newTr);
    }

    return tableRows;
}

function calculateScore(results) {
    let score = 0;
    console.log(results);
    for (let key in correctDisplay) {
        if (correctDisplay[key] == results[key]) score += 1;
    }
    return score;
}

export function clearLocalStorage() {
    localStorage.removeItem("responseBody");
}
