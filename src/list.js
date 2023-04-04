import moreBtn from './moreBtn.js';
import clearAll from './clearAll.js';

class Overall {
  constructor() {
    this.tasks = [];
    this.listContainer = document.querySelector('#to-dos');
    this.form = document.querySelector('form');
    this.clearAllBtn = document.querySelector('#clear-all p');
    this.resync = document.querySelector('#reset');
  }

  setLocalStorage() {
    const toDos = localStorage.getItem('tasks');
    if (toDos) {
      this.tasks = JSON.parse(toDos);
    } else {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
  }

  displayTasks() {
    this.listContainer.innerHTML = '';
    this.tasks.forEach(({
      description, completed,
    }, i) => {
      const ul = document.createElement('li');
      const checkbox = document.createElement('input');
      const describe = document.createElement('p');
      const more = moreBtn();
      this.tasks[i].index = this.tasks.length - i;
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      ul.className = 'to-do-item';
      checkbox.setAttribute('type', 'checkbox');
      checkbox.checked = completed;
      checkbox.addEventListener('change', () => {
        if (this.tasks[i].completed) {
          this.tasks[i].completed = false;
        } else {
          this.tasks[i].completed = true;
        }
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.displayTasks();
      });
      describe.textContent = description;
      if (completed) {
        describe.className = 'strike';
      }
      describe.ondblclick = this.more.bind(this);
      more.onclick = this.more.bind(this);
      ul.appendChild(checkbox);
      ul.appendChild(describe);
      ul.appendChild(more);

      this.listContainer.appendChild(ul);
    });
  }

  add(text) {
    const newTask = {
      description: `${text}`,
      completed: false,
      index: this.tasks.length,
    };

    this.tasks.unshift(newTask);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.displayTasks();
  }

  remove(index) {
    this.tasks = this.tasks.filter((task) => task.index !== index);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.displayTasks();
  }

  more({
    target,
  }) {
    const parent = target.parentNode;
    const targetEle = parent.childNodes[1];
    const list = Array.from(this.listContainer.childNodes);
    let targetIndex;
    list.forEach((each, index) => {
      if (each === parent) {
        targetIndex = index;
      }
    });
    this.edit(targetEle, targetIndex);
  }

  edit(target, index) {
    let text = target.textContent;
    const editInput = document.createElement('input');
    editInput.setAttribute('type', 'text');
    editInput.value = text;
    editInput.className = 'editInput';
    target.parentNode.replaceChild(editInput, target);
    const more = editInput.parentNode.lastChild;
    const trash = document.createElement('i');
    trash.className = 'fa fa-trash trash';
    more.parentNode.replaceChild(trash, more);
    trash.addEventListener('click', ({
      target,
    }) => {
      const tasks = document.querySelectorAll('li');
      tasks.forEach((task, index) => {
        if (task === target.parentNode) {
          this.remove(this.tasks.length - index);
        }
      });
    });

    editInput.addEventListener('keyup', ({
      key,
    }) => {
      if (key === 'Enter') {
        text = editInput.value;
        this.tasks[index].description = text;
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        target.textContent = text;
        editInput.parentNode.replaceChild(target, editInput);
        const more = moreBtn();
        more.addEventListener('click', this.more.bind(this));
        trash.parentNode.replaceChild(more, trash);
      }
    });
  }

  eventListeners() {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = this.form.lastElementChild;
      input.addEventListener('keyup', ({
        key,
      }) => {
        const text = input.value;
        if (key === 'Enter' && text !== '') {
          this.add(text);
          this.form.reset();
        }
      });
    });
    this.clearAllBtn.addEventListener('click', () => {
      this.tasks = clearAll(this.tasks);
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      this.displayTasks();
    });
    this.resync.addEventListener('click', () => {
      this.tasks = [];
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      this.displayTasks();
      this.resync.classList.add('rotate');
      setTimeout(() => this.resync.classList.remove('rotate'), 1500);
    });
  }
}

export default Overall;