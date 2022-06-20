
let cHeaders = ["Endpoint", "Type", "Comments"];
let epMovies =["/movies", "GET, POST", "Return array/add movie to array"];
let barrier = ["........","........","........"];
let epUser = ["/users", "GET, POST", "Return list of user/create user"];
let epUserId = ["/users/:id", "PUT, DELETE", "Update username/delete account"];
let epUserFav = ["/users/id/:movieTitle", "PUT, DELETE", "Add/remove user favorites"];



let openDocButton = document.querySelector("#documentationLink");
openDocButton.addEventListener("click", openDoc);

//set up modal with exit button
let envelope = document.createElement("div")
let docContainer = document.createElement('table');
let closeDocBtn = document.createElement('button');
closeDocBtn.classList.add('closeDocBtn');
closeDocBtn.innerText = "X";
docContainer.appendChild(closeDocBtn);
docContainer.classList.add('docContainer');
//set up table and append data
let trHead = document.createElement("tr")
trHead.classList.add("tableRow");
let trMovies = document.createElement("tr");
trMovies.classList.add("tableRow");
let trBarrier = document.createElement("tr");
trBarrier.classList.add("tableRow");
let trUser = document.createElement("tr");
trUser.classList.add("tableRow");
let trUserId = document.createElement("tr");
trUserId.classList.add("tableRow");
let trUserFav = document.createElement("tr");
trUserFav.classList.add("tableRow");
let jsonIMG = document.createElement("img")
jsonIMG.setAttribute("src", "Capture.PNG")
docContainer.appendChild(trHead)
docContainer.appendChild(trMovies)
docContainer.appendChild(trBarrier)
docContainer.appendChild(trUser)
docContainer.appendChild(trUserId)
docContainer.appendChild(trUserFav)
docContainer.appendChild(jsonIMG);
envelope.appendChild(docContainer);
envelope.appendChild(jsonIMG);
envelope.classList.add("envelope")
//use forLoop to append data based on order
for (let i = 0; i < cHeaders.length; i++) {
    let th = document.createElement("th");
    th.classList.add("th");
    th.innerText = cHeaders[i];
    trHead.appendChild(th);
}

for (let i = 0; i < epMovies.length; i++) {
    let td = document.createElement("td");
    td.classList.add("td");
    td.innerText = epMovies[i];
    trMovies.append(td);
   }
for (let i = 0; i < barrier.length; i++) {
    let td = document.createElement("td");
    td.classList.add("td");
    td.innerText = barrier[i];
    trBarrier.append(td);
   }
for (let i = 0; i < epUser.length; i++) {
    let td = document.createElement("td");
    td.classList.add("td");
    td.innerText = epUser[i];
    trUser.append(td);
   }
for (let i = 0; i < epUserId.length; i++) {
    let td = document.createElement("td");
    td.classList.add("td");
    td.innerText = epUserId[i];
    trUserId.append(td);
   }
for (let i = 0; i < epUserFav.length; i++) {
    let td = document.createElement("td");
    td.classList.add("td");
    td.innerText = epUserFav[i];
    trUserFav.append(td);
   }
function openDoc(){
    let mainContainer = document.querySelector(".main-container");
    if (envelope.parentElement !== mainContainer){
        mainContainer.appendChild(envelope);
    }else{
        mainContainer.removeChild(envelope);
    }
    closeDocBtn.addEventListener('click', () =>{
    mainContainer.removeChild(envelope);
})
}
