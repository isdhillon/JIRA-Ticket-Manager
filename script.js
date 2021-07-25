//Declarations
let mainContainer=document.querySelector(".main-container");
let plusBtn=document.querySelector(".plus");
let taskBox=document.querySelector(".task-box");
let modalContainer=document.querySelector(".modal-container")
let modalColors=document.querySelectorAll(".modal-color")
let colors=["pink","blue","green","black"];
let filterColorContainer=document.querySelectorAll(".filter-color-container")
let lockIcon=document.querySelector(".lock");
let crossBtn=document.querySelector(".cross");
let allTask=[];
let icolor="black";
//init local storage
//check if any there is any local storage
if(localStorage.getItem("alltask")){
    //local storage is converted to an array
    allTask=JSON.parse(localStorage.getItem("alltask"))
    for(let i=0;i<allTask.length;i++){
        //making the tickets from the data we get from local storage
        createTicketFromLocalStorage(allTask[i]);
    }
}
//making tickets
function createTicketFromLocalStorage(taskObj){
    //getting the keys from object
    let {id,color,task}=taskObj;
    //creating the ticket box
    let taskContainer=document.createElement("div");
    taskContainer.setAttribute("class","ticket-container");
    //making the ticket color and desc
    taskContainer.innerHTML=`<div class="ticket-color ${color}"></div>
    <div class="ticket-desc-container">
    <div class="ticket-id">#${id}</div>
    <div class="ticket-desc">${task}</div>
    </div>`;
    //appending it to the main container
    mainContainer.appendChild(taskContainer);
    //Adding functionality to the ticket to change the color on the top
    addFunctionality(taskContainer);
}

//plus button is clicked
plusBtn.addEventListener("click",function(){
    //just adding red color to the tag so that it looks selected
    plusBtn.firstElementChild.classList.add("locked");
    //if display the modal so that user can enter the data
    modalContainer.style.display="flex";
})

//ticket box appeared on pressing plus
taskBox.addEventListener("keydown",function(e){
    //if enter is pressed and there is data in text area
    if(e.key=='Enter' && taskBox.value!=""){
        plusBtn.firstElementChild.classList.remove("locked");
        //value of textarea is assigned to task variable
        let task=taskBox.value;
        //creating ticket
        let taskContainer=document.createElement("div");
        taskContainer.setAttribute("class","ticket-container");
        //generating id usinh math.random slicing the first digit bcz it starts with 0.
        let id=Math.random().toString(32).slice(2);
        //adding the color selected by the user
        taskContainer.innerHTML=`<div class="ticket-color ${icolor}"></div>
        <div class="ticket-desc-container">
        <div class="ticket-id">#${id}</div>
        <div class="ticket-desc">${task}</div>
        </div>`
        //appending the child
        mainContainer.appendChild(taskContainer);
        //making object to store the data
        let ticketObj={}
        ticketObj.task=task;
        ticketObj.color=icolor;
        ticketObj.id=id;
        //object is pushed in the array
        allTask.push(ticketObj);
        //set in local storage as a json file
        localStorage.setItem("alltask",JSON.stringify(allTask));
        //making the modal disappear again
        modalContainer.style.display="none"
        //reseting the dat of modal
        taskBox.value=""
        icolor="black";
        //adding the color change functionality to the ticket
        addFunctionality(taskContainer)
    }
})

//ticket color borders on the modal container which appears on the plus btn
for(let i=0;i<modalColors.length;i++){
    //selecting the colors of modal
    modalColors[i].addEventListener("click",function(){
        //getting the color selected
        let color=modalColors[i].classList[1];
        //assigning it to the variable taht will be passed in the object
        icolor=color;
        //removing border from all the colors
        for(let j=0;j<modalColors.length;j++){
            modalColors[j].classList.remove("border");
        }
        //adding border only to the specified color
        modalColors[i].classList.add("border")
    })
}

//changing the colors of the notes formed by modal container
function addFunctionality(taskContainer){
    //getting the ticket color
    let ticketcolor=taskContainer.querySelector(".ticket-color");
    ticketcolor.addEventListener("click",function(){
        //getting the current color
        let ccolor=ticketcolor.classList[1];
        //finding the index of current color in the colors array
        let idx=colors.indexOf(ccolor);
        //new index when it is clicked
        let newidx=(idx+1)%4;
        //getting the new color
        let newColor=colors[newidx];
        //removing the old color
        ticketcolor.classList.remove(ccolor);
        //adding new color
        ticketcolor.classList.add(newColor);
        //updating the color in local storage using id
        let ticketId=taskContainer.querySelector(".ticket-id").innerText.slice(1);
        for(let i=0;i<allTask.length;i++){
            //if ticketid and object id matches do the changes in the object
            if(allTask[i].id==ticketId){
                allTask[i].color=newColor
                //save the changes to local storage
                localStorage.setItem('alltask',JSON.stringify(allTask));
            }
        }
    })
}

//filterling logic on the functionality tab on the top
//setting the default color to null
let prevColor=null;
for(let i=0;i<filterColorContainer.length;i++){
    filterColorContainer[i].addEventListener("click",function(){
        //the color which is clicked
        let color=filterColorContainer[i].children[0].classList[1];
        //if the same color is selected again
        if(prevColor==color){
            //all the elements are displayed
            let ticketContainer=document.querySelectorAll(".ticket-container");
            for(j=0;j<ticketContainer.length;j++){
                ticketContainer[j].style.display="block";
 
            }
            //previous color is set to null
            prevColor=null;
        }
        else{
            //selecting all the tickets
            let ticketContainer=document.querySelectorAll(".ticket-container")
            for(let j=0;j<ticketContainer.length;j++){
                //getting the ticket colors of the container
                mycolor=ticketContainer[j].children[0].classList[1];
                if(mycolor==color){
                    //if the colors matched these elements are blocked
                    ticketContainer[j].style.display="block";
                }
                else{
                    //other elements are hided
                    ticketContainer[j].style.display="none";
                }
            }
            //prevcolor is assigned the current color value
            prevColor=color
        }
    })
}

//lock and ticket addition logic
lockIcon.addEventListener("click",function(){
    //adding and removing the desired classes
    if(lockIcon.classList.contains("fa-lock")){
        lockIcon.classList.remove("fa-lock");
        lockIcon.classList.add("fa-unlock")
        lockIcon.classList.add("locked")
        //selecting all the tickets
        let ticketDescContainer=document.querySelectorAll(".ticket-container");
        for(let i=0;i<ticketDescContainer.length;i++){
            //changing the attribute to editable
            ticketDescContainer[i].setAttribute("contenteditable","true");
        }
    }
    else{
        //adding and removing the desired classes
        lockIcon.classList.remove("fa-unlock")
        lockIcon.classList.add("fa-lock")
        lockIcon.classList.remove("locked")
        let ticketDescContainer=document.querySelectorAll(".ticket-container");
        for(let i=0;i<ticketDescContainer.length;i++){
            //changing back the attribute to false
            ticketDescContainer[i].setAttribute("contenteditable","false");
            //updating the data in the object
            allTask[i].task=ticketDescContainer[i].querySelector(".ticket-desc").innerText;
            allTask[i].color=ticketDescContainer[i].querySelector(".ticket-color").classList[1];
            allTask[i].id=ticketDescContainer[i].querySelector(".ticket-id").innerText.slice(1)
            //setting it to local storage
            localStorage.setItem("alltask",JSON.stringify(allTask));
        }
    }
})

//adding hower property to the colors tab on functional tab
let howerColor=document.querySelectorAll(".filter-color-container");
//selecting the filter colors
for(let i=0;i<howerColor.length;i++){
    //adding event listener to all and adding class when the mouse enters
    howerColor[i].addEventListener("mouseover",function(){
        howerColor[i].classList.add("color-hower")
    })
    //adding event anre removing class when the mouse is out
    howerColor[i].addEventListener("mouseout",function(){
        howerColor[i].classList.remove("color-hower")

    })
}


//adding hower property to icons of cross plus and lock
let icon=document.querySelectorAll(".icon");
for(let i=0;i<icon.length;i++){
    //adding classes when the mouse is over the selector
    icon[i].addEventListener("mouseover",function(e){
        icon[i].classList.add("icon-hower")
    })
    //removing the selector when mouse is move out of the selector
    icon[i].addEventListener("mouseout",function(e){
        icon[i].classList.remove("icon-hower")
    })
}

//cross btn is clicked
let clicked=true;
crossBtn.addEventListener("click",function(){
    //if it is clicked
    if(clicked){
        clicked=false;
        crossBtn.firstElementChild.classList.add("locked")
        //selecting the tickets
    let ticketContainer=document.querySelectorAll(".ticket-container")
    for(let i=0;i<ticketContainer.length;i++){
        ticketContainer[i].addEventListener("click",function(){
            //if ticket is selected and cross is selected
            let ticketId=ticketContainer[i].querySelector(".ticket-id").innerText.slice(1);
        if(!clicked){
            //updating data in local storage
            for(let i=0;i<allTask.length;i++){
                //if id matches
                if(allTask[i].id==ticketId){
                    ///removing the object from the array
                    allTask.splice(ticketId,1);
                    localStorage.setItem('alltask',JSON.stringify(allTask))
                }
            }
            //remving the object
            ticketContainer[i].remove();
        }
        })
    }
    }
    else{
        clicked=true;
        crossBtn.firstElementChild.classList.remove("locked")
    }
})