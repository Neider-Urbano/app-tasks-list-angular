import { Component, computed, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Task } from 'src/app/models/task.model';

export enum FilterTypes {
  all = 'all',
  pending = 'pending',
  completed = 'completed',
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  newTaskControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  tasks = signal<Task[]>([
    {
      id: Date.now(),
      title: 'Crear proyecto',
      completed: false,
    },
    {
      id: Date.now(),
      title: 'Crear componenentes',
      completed: false,
    },
  ]);

  FilterTypes = FilterTypes;
  filterState = signal<FilterTypes>(FilterTypes.all);

  tasksByFilter = computed(() => {
    const filter = this.filterState();
    const tasks = this.tasks();
    if (filter == FilterTypes.completed) {
      return tasks.filter((task) => task.completed);
    }
    if (filter == FilterTypes.pending) {
      return tasks.filter((task) => !task.completed);
    }
    return tasks;
  });

  changeFilter(filter: FilterTypes) {
    this.filterState.set(filter);
  }

  isSelectFilter(filter: FilterTypes) {
    return this.filterState() == filter;
  }

  changeHandler() {
    if (this.newTaskControl.valid) {
      const newTask = this.newTaskControl.value.trim();
      if (newTask !== '') {
        this.addTask(newTask);
        this.newTaskControl.setValue('');
      }
    }
  }

  addTask(title: string) {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  deleteTask(index: number) {
    this.tasks.mutate((state) => {
      state.splice(index, 1);
    });
  }

  updateTask(index: number) {
    this.tasks.mutate((state) => {
      const currentTask = state[index];
      state[index] = {
        ...currentTask,
        completed: !currentTask.completed,
      };
    });
  }

  updateTaskEditingMode(index: number) {
    this.tasks.update((prevState) => {
      return prevState.map((task, position) => {
        let editing;
        if (position === index) {
          editing = true;
        }
        return {
          ...task,
          editing: editing ?? false,
        };
      });
    });
  }

  updateTaskText(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update((prevState) => {
      return prevState.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            title: input.value,
            editing: false,
          };
        }
        return task;
      });
    });
  }
}
