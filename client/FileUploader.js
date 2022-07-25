class FileUploader {
  constructor({
    element,
    uploadUrl
  }) {
    if (element instanceof HTMLElement) {
      this.element = element;
    } else {
      throw new Error('element should be an HTMLElement')
    }
    this.uploadUrl = uploadUrl;
    this.#init();
  }

  // public props
  tasks = [];

  // private methods
  #init = () => {
    this.#listenToEvents();
  }

  #listenToEvents = () => {
    this.element.addEventListener('drop', this.#handleDrop);
    this.element.addEventListener('dragover', this.#handleDragover);
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
    // fetch(this.uploadUrl, {
    //   method: 'POST',
    //   body: data
    // })
    //   .then(res => res.json())
    //   .then((res) => {
    //     console.log(`${file.name} upload succeeded`, res)
    //   })
    //   .catch(() => {
    //     console.log(`${file.name} upload failed`)
    //   });

    const xhr = new XMLHttpRequest();
    xhr.open('POST', this.uploadUrl);
    xhr.upload.addEventListener('progress', (e) => {
      console.log('progress', e);
    });
    xhr.send(data);
  }

}