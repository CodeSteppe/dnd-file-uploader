const TASK_STATUS = {
  PROCESSING: 1,
  SUCCESS: 2,
  ERROR: 3,
}

class FileUploader {
  constructor({
    element,
    uploadUrl,
    taskRenderer
  }) {
    if (element instanceof HTMLElement) {
      this.element = element;
    } else {
      throw new Error('element should be an HTMLElement')
    }
    this.uploadUrl = uploadUrl;
    this.taskRenderer = taskRenderer;
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
      id: this.tasks.length,
      name: file.name,
      status: TASK_STATUS.PROCESSING,
      progress: 0
    }
    this.tasks.unshift(task);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', this.uploadUrl);
    xhr.setRequestHeader('x-file-name', encodeURIComponent(file.name));
    xhr.upload.addEventListener('progress', (e) => {
      const { loaded, total } = e;
      const progress = Math.round(loaded / total * 100);
      task.progress = progress;
      this.#updateTask(task);
    });
    xhr.addEventListener('load', (e) => {
      task.status = TASK_STATUS.SUCCESS;
      const response = JSON.parse(xhr.response);
      console.log('response', response);
      const { url } = response;
      task.url = url;
      this.#updateTask(task);
    });
    xhr.addEventListener('error', (e) => {
      task.status = TASK_STATUS.ERROR;
      this.#updateTask(task);
    });
    xhr.send(data);
  }

  #updateTask = (task) => {
    const taskList = this.element.querySelector('.task-list');
    const id = `task-${task.id}`;
    let taskBox = taskList.querySelector(`#${id}`);
    if (!taskBox) {
      taskBox = document.createElement('div');
      taskBox.id = id;
      taskList.prepend(taskBox);
    }
    taskBox.innerHTML = '';
    taskBox.append(this.taskRenderer(task));
  }
}