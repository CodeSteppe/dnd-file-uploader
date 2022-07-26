const processingTemplate = document.querySelector('#template-task-processing');
const successTemplate = document.querySelector('#template-task-success');
const errorTemplate = document.querySelector('#template-task-error');

new FileUploader({
  element: document.querySelector('.dnd-file-uploader'),
  uploadUrl: 'http://localhost:3000/upload',
  renderTask: function (task) {
    switch (task.status) {
      case TASK_STATUS.PROCESSING: {
        const taskDOM = processingTemplate.content.firstElementChild.cloneNode(true);
        const nameDOM = taskDOM.querySelector('.task-name');
        const progressDOM = taskDOM.querySelector('.task-progress');
        nameDOM.textContent = task.name;
        const progress = `${task.progress}%`
        progressDOM.textContent = progress;
        taskDOM.style.background = `linear-gradient(to right, #bae7ff ${progress}, #fafafa ${progress}, #fafafa 100%)`
        return taskDOM;
      }
      default:
        break;
    }
  }
});