var pageContentEl = document.querySelector("#page-content");

var tasks = [];

var taskIDCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var taskFormHandler = function(){
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    //Form validation
    if(!taskNameInput || !taskTypeInput){
        alert("You need to fill out the task form!");
        return false;
    }

    var isEdit = formEl.hasAttribute("data-task-id");
    
    if(isEdit){
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attribute, so package up data as an object
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        }
        
        createTaskEl(taskDataObj);
    };
    saveTasks();
    formEl.reset();
};

var completeEditTask = function(taskName, taskType, taskId){
    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id ='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++){
        if (tasks[i].id === parseInt(taskId)){
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    saveTasks();

    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}

var createTaskEl = function (taskDataObj) {
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIDCounter);

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIDCounter, taskDataObj.status);
    listItemEl.appendChild(taskActionsEl);

   // add entire list item to list
    if (taskDataObj.status == "to do"){
        tasksToDoEl.appendChild(listItemEl);
    } else if (taskDataObj.status == "in progress"){
        tasksInProgressEl.appendChild(listItemEl);
    } else if (taskDataObj.status == "completed"){
        tasksCompletedEl.appendChild(listItemEl);
    }; 

    // add the task ID to our object
    taskDataObj.id = taskIDCounter;
    // add the oject to our array
    tasks.push(taskDataObj);

    //increase task counter
    taskIDCounter++;
};

var createTaskActions = function (taskID, myStatus){
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent="Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskID);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskID);

    actionContainerEl.appendChild(deleteButtonEl);

    // create task status dropdown
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className="select-status";
    statusSelectEl.setAttribute("name","status-change");
    statusSelectEl.setAttribute("data-task-id", taskID);

    actionContainerEl.appendChild(statusSelectEl);

    // add options to dropdown
    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (i=0; i<statusChoices.length; i++){
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        
        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    };
    statusSelectEl.value = toTitleCase(myStatus);
    // alert(myStatus + " " + toTitleCase(myStatus));

    return actionContainerEl;
};

var toTitleCase = function(str) {
    return str.replace(/(^|\s)\S/g, function(t) { return t.toUpperCase() });
};

var taskButtonHandler = function(event){
    //get target element from event
    var targetEl = event.target;

    // edit button was clicked
  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  } 

    if (targetEl.matches(".delete-btn")){
        // get the element's task ID
        var taskID = targetEl.getAttribute("data-task-id");
        deleteTask(taskID);
    }
    saveTasks();
};

var editTask = function(taskID){
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id = '" + taskID + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value=taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskID);
};

var deleteTask = function(taskID){
    var taskSelected = document.querySelector(".task-item[data-task-id ='" + taskID + "']");
    taskSelected.remove();

    // create new array to hold updated list of tasks
    var updatedTaskArray = [];

    // loop through current tasks
    for (var i =0; i<tasks.length; i++){
        // if task does match the value of the task being deleted, then add it to the new array
        if (tasks[i].id !== parseInt(taskID)){
            updatedTaskArray.push(tasks[i]);
        }
    }

    //update our tasks array with the updated array
    tasks = updatedTaskArray;
    saveTasks();
};

var taskStatusChangeHandler = function(event){
    // get the task item's ID
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected options value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // Find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id = '" + taskId + "']");

    if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
    } 
    else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
    } 
    else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
    }

    // update tasks in array
    for (var i = 0; i < tasks.length; i++){
        if (tasks[i].id === parseInt(taskId)){
            tasks[i].status = statusValue;
        }
    };

    saveTasks();
};

var saveTasks = function(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function (){
    // Gets task items from localStorage.
    var savedTasks = localStorage.getItem("tasks");

    // Check if tasks is equal to null by using an if statement.
    // if (tasks === null){
    if (!savedTasks){
        return false;
    } // If it's not null, we don't have to worry about it and we can skip the if statement's code block.

    // Converts tasks from the string format back into an array of objects.
    savedTasks = JSON.parse(savedTasks);

    // Iterates through a tasks array and creates task elements on the page from it.
    console.log("saved tasks length" + savedTasks.length);
    for (loadI = 0; loadI < savedTasks.length; loadI++) {
        console.log("call create tasks: "+ loadI);
        createTaskEl(savedTasks[loadI]);
        console.log("created task: "+ loadI);
    };
}

loadTasks();

formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);
