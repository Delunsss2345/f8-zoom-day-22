const modalId = document.getElementById('addTaskModal') ; 
const addBtn = document.querySelector('.add-btn') ; 
const closeBtn = document.querySelector('.close-button') ; 
const cancelBtn = document.querySelector('.cancel-button') ;
const addTask = document.querySelector('.add-new-button') ; 
const textBox = document.querySelectorAll('.input-group > input, textarea') ; 
const form = document.getElementById('form');
const todoMain = document.querySelector('.task-grid') ; 
const todoTasks = [] ; 

console.log(todoMain);
const toggleButton = [addBtn, closeBtn, cancelBtn];
toggleButton.forEach(btn => {
    btn.onclick = () => {
        modalId.classList.toggle('show');
        if(btn.classList.contains('add-btn')) {
            textBox[0].focus()  ;
        }
        if(btn.classList.contains('cancel-button')) {
            form.reset() ; 
        }
    };
});

function formatHoursAndMinutes(time) {
    const [hours, minutes] = time.split(':')
    const date = new Date();
    date.setHours(hours, minutes, 0, 0); 
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

function getSecondTime(time) {
    const [hours, minutes] = time.split(':'); 
    const totalSeconds = (hours * 3600) + (minutes * 60);
    return totalSeconds ; 
}

function validateField(newTask) {
    if(!newTask.title) {
       return alert('Tên tiêu đề không được trống') ; 
    }

    if(!newTask.startTime) {
       return alert('Giờ bắt đầu không được trống') ; 
    }

    if(!newTask.endTime) {
       return alert('Giờ kết thúc không được trống') ; 
    }

    if(getSecondTime(newTask.endTime) < getSecondTime(newTask.startTime)) {
        return alert('Giờ kết thúc bắt buộc lớn hơn giờ bắt đầu') ; 
    }
    
    if(!newTask.DueDate) {
        return alert('Ngày hết hạn không được trống') ; 
    }
    const currentDate = new Date() ; 
    currentDate.setHours(0 , 0 , 0 , 0) ; 

    const tempDate  = new Date(newTask.DueDate) ;
    tempDate.setHours(0 , 0 , 0 , 0) ; 

    if(tempDate < currentDate) {
        return alert('Ngày hết hạn lớn hơn hoặc bằng ngày hiện tại') ; 
    }


    if(!newTask.description) {
       return alert('Mô tả không được trống') ; 
    }
    
    return true ;
}

const handlerCompleted = (el) => {
    el.closest('.task-card').classList.toggle('completed');
    console.log(el.closest('.task-card'));
};


function renderTask(task) {    
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');

    taskCard.classList.add(task.cardColor || 'blue');
        
    if (task.isCompleted) {
        taskCard.classList.add('completed');
    }

    const taskHeader = document.createElement('div');
    taskHeader.classList.add('task-header');
        
    const taskTitle = document.createElement('h3');
    taskTitle.classList.add('task-title');
    taskTitle.textContent = task.title;

    const taskMenuButton = document.createElement('button');
    taskMenuButton.classList.add('task-menu');
    taskMenuButton.innerHTML = `
    <i class="fa-solid fa-ellipsis fa-icon"></i>
    <div class="dropdown-menu">
        <div class="dropdown-item edit">
            <i class="fa-solid fa-pen-to-square fa-icon"></i>
            Edit
        </div>
        <div class="dropdown-item complete" onclick="handlerCompleted(this)">
            <i class="fa-solid fa-check fa-icon"></i>
            ${taskCard.classList.contains('completed') ? 'Mark as Active' : 'Mark as Complete'}
        </div>
        <div class="dropdown-item delete">
            <i class="fa-solid fa-trash fa-icon"></i>
            Delete
        </div>
    </div>
`;


   
    taskHeader.appendChild(taskTitle);
    taskHeader.appendChild(taskMenuButton);

    const taskDescription = document.createElement('p');
    taskDescription.classList.add('task-description');
    taskDescription.textContent = task.description; 

    const taskTime = document.createElement('div');
    taskTime.classList.add('task-time');
    taskTime.textContent = `${formatHoursAndMinutes(task.startTime)} - ${formatHoursAndMinutes(task.endTime)}`;

    taskCard.appendChild(taskHeader);
    taskCard.appendChild(taskDescription);
    taskCard.appendChild(taskTime);

    todoMain.appendChild(taskCard);
}


form.onsubmit = function (e) {
    e.preventDefault(); 

    const newTask = {
        title: form.title.value.trim(),
        startTime: form.startTime.value,
        endTime: form.endTime.value,
        DueDate: form.DueDate.value,
        category: form.category.value,
        cardColor: form.cardColor.value,
        description: form.description.value.trim(),
        isCompleted: false
    };
    if(!validateField(newTask)) return ; 
    todoTasks.push(newTask);
    renderTask(newTask); //Em truyển newTask để muốn mỗi lần chỉ thêm cái mới 
    //Chứ không phải render lại cả todoTask
    form.reset();
    modalId.classList.remove('show');
};



