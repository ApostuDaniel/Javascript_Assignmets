let tasks = [];
let taskList = document.getElementById("taskList");

// declare taskList with const or let
const update = () => {
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  } // there is a more memory efficient way to do this by adding only new elements to the list but this works
  tasks.forEach((task, index) => {
    let listElement = document.createElement("li");
    let liElementContent = `<p>${task}</p><button class="delete" id="${index}">X</button>`;
    
    if(index != 0 && tasks.length >=2)
    {
      liElementContent += `<button class="up" id="+${index}">↑</button>`;
      console.log(liElementContent);
    }
    if(index != tasks.length-1 && tasks.length >=2)
    {
      liElementContent += `<button class="down" id="-${index}">↓</button>`;
      console.log(liElementContent);
    }
    listElement.innerHTML = liElementContent;
    taskList.appendChild(listElement);
    document.getElementById(`${index}`).addEventListener("click", function(){
        deleteTask(index);});
    
    if(index != 0 && tasks.length >=2)
    {
      document.getElementById(`+${index}`).addEventListener("click", function(){
        upTask(index);});
    };
    if(index != tasks.length-1 && tasks.length >=2)
    {
      document.getElementById(`-${index}`).addEventListener("click", function(){
        downTask(index);});
    }
  });   
};

const pushTask = (event) => {
  let newTask = document.getElementById("newTask").value;
  tasks.push(newTask);
  update();
};

const deleteTask = (index) => {
    tasks.splice(index,1);
    update();
}

const upTask = (index) => {
  let temp = tasks[index];
  tasks[index] = tasks[index-1];
  tasks[index-1] = temp;
  update();
}

const downTask = (index) => {
  let temp = tasks[index];
  tasks[index] = tasks[index+1];
  tasks[index+1] = temp;
  update();
}

document.getElementById("add").addEventListener("click", pushTask);

