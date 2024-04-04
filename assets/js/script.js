// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if(!nextId){
        nextId = 1;
    } else{
        nextId ++;
    }
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $("<div>")
    .addClass("card w-75 task-card draggable my-3")
    .attr("data-taskId", task.id)
    const cardHeader = $("<div>").addClass('card-header h4').text(task.title);
    const cardBody = $("<div>").addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $("<p>").addClass('card-text').text(task.dueDate);
    const cardDeleteButton = $('<button>').addClass('btn btn-danger delete')
    .text("Delete").attr('data-taskId', task.id);

    cardDeleteButton.on('click',  handleDeleteTask);

    if(task.dueDate && task.status !== "done"){
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, "DD/MM/YYYY");
        if(now.isSame(taskDueDate, "day")){
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)){
            taskCard.addClass('bg-danger text-white');
            cardDeleteButton.addClass('border-light')
        }
    }
    cardBody.append(cardDescription, cardDueDate, cardDeleteButton);
    taskCard.append(cardHeader, cardBody);
    return taskCard;
}


// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    if(!taskList){
        taskList = [];
    }

    const todoList = $("#todo-cards");
    todoList.empty();

    const inProgressList = $("#in-progress-cards");
    inProgressList.empty();

    const doneList = $("#done-cards");
    doneList.empty();

    for(let i = 0; i < taskList.length; i++){
        if(taskList[i].status === "to-do"){
            todoList.append(createTaskCard(taskList[i]));
        } else if (taskList[i].status === "in-progress"){
            inProgressList.append(createTaskCard(taskList[i]));
        } else if (taskList[i].status === "done"){
            doneList.append(createTaskCard(taskList[i]));
        }
    }

        $(".draggable").draggable({
            opacity: 0.7,
            zIndex: 100,

            helper: function(event){
                let original;
                if($(event.target).hasClass("ui=draggable")){
                    original = $(event.target);
                } else {
                    original = $(event.target).closest(".draggable");
                    
                }
                return original.clone().css({
                    maxWidth: original.outerWidth(),
                });
            }
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault(); // Prevent the default form submission behavior

    // Generate a unique task ID
    const id = generateTaskId();

    // Create a new task object from form inputs
    const task = {
        id: id, // Use the generated unique ID
        title: $("#taskTitle").val().trim(), // Get the title and trim whitespace
        description: $("#taskDescription").val().trim(), // Get the description and trim whitespace
        dueDate: $("#taskDue").val(), // Get the due date
        status: 'to-do' // Initial status for new tasks
    };

    // Log the created task for debugging
    console.log('Created task:', task);

    // Add the new task to the task list
    taskList.push(task);

    // Update the task list in localStorage. Corrected key to "tasks" for consistency
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // Log the task list to confirm it's updated
    console.log('Updated taskList:', taskList);

    // Re-render the task list to include the new task
    renderTaskList();

    // Reset form inputs after adding the task
    $("#taskTitle").val("");
    $("#taskDescription").val("");
    $("#taskDue").val("");
}
// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    event.preventDefault();

    const taskId = $(this).data("taskid");
    
    taskList = taskList.filter(task => task.id !== taskId);

    localStorage.setItem("tasks", JSON.stringify(taskList)); // Update the task list in localStorage
    console.log(taskId)
    renderTaskList(); // Re-render the task list to reflect changes
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    console.log(ui.draggable[0].dataset.taskid);
    const taskId = ui.draggable[0].dataset.taskid;
    const newStatus = event.target.id
    
    for(let i = 0; i < taskList.length; i++){
        if (taskList[i].id == parseInt(taskId)){
            console.log(newStatus)
            taskList[i].status = newStatus;
            
        }
        }
        localStorage.setItem("task", JSON.stringify(taskList));
        renderTaskList();


}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();



    $("#taskForm").on("submit", handleAddTask);



    $(".lane").droppable({
        accept: ".draggable",
        drop: handleDrop
    })

    $('#taskDue').datepicker({
        changeMonth: true,
        changeYear: true
    });
});
