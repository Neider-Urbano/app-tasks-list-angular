import { Component, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Task } from 'src/app/models/task.model';

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
}
