const taskTemplate = document.querySelector('#template-task');

new FileUploader({
  element: document.querySelector('.dnd-file-uploader'),
  uploadUrl: 'http://localhost:3000/upload',
  taskRenderer: function (task) {
    const taskDOM = taskTemplate.content.firstElementChild.cloneNode(true);
    const nameDOM = taskDOM.querySelector('.task-name');
    nameDOM.textContent = task.name;
    const progressDOM = taskDOM.querySelector('.task-progress');
    const progress = `${task.progress}%`
    progressDOM.textContent = progress;
    if (task.status === TASK_STATUS.PROCESSING) {
      taskDOM.style.background = `linear-gradient(to right, #bae7ff ${progress}, #fafafa ${progress}, #fafafa 100%)`
    } else if (task.status === TASK_STATUS.SUCCESS) {
      taskDOM.style.background = '#d9f7be';
      nameDOM.href = task.url;
    } else if (task.status === TASK_STATUS.ERROR) {
      taskDOM.style.background = '#ffccc7';
    }
    return taskDOM;
  }
});