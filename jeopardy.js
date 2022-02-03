//create category array containining the categories and the questions and answers nested inside
let categories = [];


//DONE get array of six random category ids
async function getCategoryIds() {
    const idArray = [];
    for (i = 6; i > 0;) {
        const clue = await axios.get("http://jservice.io/api/random");
        const id = await clue.data[0].category_id;
        if (await doesContain500(id)) {
            idArray.push(id);
        } 
        if (idArray.length === 6) {
            return idArray;
        } 
    }
}

async function doesContain500 (id) {
    const categoryInfo = await axios.get("http://jservice.io/api/category", {params: {id: id}})
    for (clue of await categoryInfo.data["clues"]) {
        if (clue["value"] === 500) {
            return true; 
        }
    }
    return false;
}

//DONE using an id, get title, questions and answers from a a category
async function getCategory(catId) {
    const catInfo = await axios.get("http://jservice.io/api/category", {params: {
        id: catId}});
    return catInfo.data;
}


//creates array with question of each point value
async function getTitleAndQuestions (categoryData) {
    const categoryObject = {
        title: (await categoryData).title,
        id: (await categoryData).id,
        "500" : (await categoryData.clues).find((clue) => clue.value === 500),
        "400" : (await categoryData.clues).find((clue) => clue.value === 400),
        "300" : (await categoryData.clues).find((clue) => clue.value === 300),
        "200" : (await categoryData.clues).find((clue) => clue.value === 200),
        "100" : (await categoryData.clues).find((clue) => clue.value === 100),
    }
    return categoryObject; 
}

async function fillTable(categories) {
    const gameBoard = document.createElement("table");
    const header = document.createElement("tr");
    gameBoard.append(header);
    for (i = 5; i > 0; i--) {
        const p= document.createElement("tr");
        p.setAttribute("id", `p${i}00row`)
        gameBoard.append(p);
    }
    const gameBox = document.querySelector("#game-container");
    gameBox.append(gameBoard);

    for (category of await Promise.all(categories)) {
        const title = document.createElement("th");
        title.setAttribute("class", category.id)
        title.innerText = category.title;
        header.append(title);
        for (i = 5; i > 0; i--) {
            const q = document.createElement("td");
            q.classList.add(category.id, `${i}00`)
            q.innerText = `$${i}00`;
            const trSelector = document.getElementById(`p${i}00row`);
            trSelector.append(q);
        }
    }
}

// Handle clicking on a clue: show the question or answer.
$("#game-container").on("click", "td", async function(evt) {
    evt.preventDefault();
    const catId = (parseInt(evt.target.classList[0]));
    const value = (parseInt(evt.target.classList[1]));
    const category = categories.find(function(cat) {
        return cat.id === catId;
    });
    const question = category[`${value}`].question;
    const answer = category[`${value}`].answer;
    const clue = $(`.${catId}.${value}`);
    if (clue.hasClass("question")) {
        clue.addClass("answer");
        clue.text(answer);
    } else {
        clue.addClass("question");
        clue.text(question);
    }
})

//create a loading screen
//the tiles are blank
//loading spinner is shown (need to get a loading spinner???)
function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */
function hideLoadingView() {
}

//Start game:
//display loading screen
//get random category Ids (function)
//et data for each category (function)
//create HTML table (function)
//then Hide loading screen
//start button becomes restart button
async function setupAndStart() {
}

//add event handler for start button
$("#start").on("click", async function (evt) {
    evt.preventDefault();
    $("#start").toggle();
    $("#loading").show();
    let categoryIds = await getCategoryIds();
    const categoryList = await Promise.all(categoryIds.map(getCategory));
    const categoriesTitlesIds = await Promise.all(categoryList.map(getTitleAndQuestions));
    categories = categoriesTitlesIds;
    fillTable(categoriesTitlesIds);
    $("#loading").toggle();
});
//when the board loads, run the other event listener for the board
// const cat = getCategory(100).then(function(catInfo) {
//     console.log(catInfo);
// });
