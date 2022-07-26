const TASK_STATUS = {
  PROCESSING: 1,
  SUCCESS: 2,
  ERROR: 3,
}

class FileUploader {
  constructor({
    element,
    uploadUrl,
    renderTask
  }) {
    if (element instanceof HTMLElement) {
      this.element = element;
    } else {
      throw new Error('element should be an HTMLElement')
    }
    this.uploadUrl = uploadUrl;
    this.renderTask = renderTask;
    this.#init();
  }

  // public props
  tasks = [];

  // private methods
  #init = () => {
    this.#listenToEvents();
  }

  #listenToEvents = () => {
    const dropAreaDOM = this.element.querySelector('.drop-area');
    dropAreaDOM.addEventListener('drop', this.#handleDrop);
    dropAreaDOM.addEventListener('dragover', this.#handleDragover);
  }

  #handleDrop = (e) => {
    // Prevent file from being opened
    e.preventDefault();

    if (e.dataTransfer.items) {
      // Use DataTransferItemList interface to access files
      for (const item of e.dataTransfer.items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          console.log('file: ', file);
          this.#upload(file);
        }
      }
    } else {
      // Use DataTransfer interface to access the files
      for (const file of e.dataTransfer.files) {
        console.log('file: ', file);
        this.#upload(file);
      }
    }
  }

  #handleDragover = (e) => {
    // Prevent file from being opened
    e.preventDefault();
  }

  #upload = (file) => {
    const data = new FormData();
    data.append('file', file);
    const task = {
      name: file.name,
      status: TASK_STATUS.PROCESSING,
      progress: 0
    }
    this.tasks.push(task);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', this.uploadUrl);
    xhr.upload.addEventListener('progress', (e) => {
      const { loaded, total } = e;
      const progress = Math.round(loaded / total * 100);
      task.progress = progress;
      this.#renderTasks();
    });
    xhr.send(data);
  }

  #renderTasks = () => {
    const taskListDOM = this.element.querySelector('.task-list');
    taskListDOM.innerHTML = '';
    const sorted = this.tasks.sort((a, b) => a.status - b.status);
    for (const task of sorted) {
      console.log('render task', task);
      taskListDOM.append(this.renderTask(task));
    }
  }
}