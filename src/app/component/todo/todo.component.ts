import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Task, TaskService } from '../../service/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent {
  tasks: Task[] = [];
  newTask: string = '';
  selectedTask: any = null;
  addTaskValue: string = '';
  editTaskValue: string = '';


  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.addTaskValue = '';
    this.editTaskValue = '';
    this.tasks = [];
    this.loadTasks();
  }

  selectTask(task: any): void {
    this.selectedTask = task;
    this.editTaskValue = task.description;
  }
  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (err) => {
        console.error('Erro ao carregar tasks:', err);
      }
    });
  }

  toggleComplete(task: Task): void {
    const updatedTask = {
      ...task,
      is_completed: !task.is_completed
    };

    this.taskService.updateTask(task.task_id!, updatedTask).subscribe({
      next: () => {
        task.is_completed = updatedTask.is_completed;
      },
      error: err => console.error('Erro ao atualizar status:', err)
    });
  }

  addTask(): void {
    const newTask = {
      description: this.newTask,
      is_completed: false
    };

    this.taskService.addTask(newTask).subscribe({
      next: (task) => {
        this.tasks.push(task); // atualiza a lista sem recarregar tudo
        this.newTask = ''; // limpa o input
      },
      error: (err) => {
        console.error('Erro ao adicionar task:', err);
      }
    });
  }

  closeModal(): void {
    this.selectedTask = null;
    this.editTaskValue = '';
  }

  updateTask(): void {
    if (this.selectedTask) {
      const updatedTask = {
        ...this.selectedTask,
        description: this.editTaskValue
      };

      this.taskService.updateTask(this.selectedTask.task_id!, updatedTask).subscribe({
        next: () => {
          const index = this.tasks.findIndex(task => task.task_id === this.selectedTask.task_id);
          if (index !== -1) {
            this.tasks[index] = updatedTask;
          }
          this.closeModal();
        },
        error: (err) => {
          console.error('Erro ao atualizar task:', err);
        }
      });
    }
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {

        this.tasks = this.tasks.filter(task => task.task_id);
        this.loadTasks();
      },
      error: (err) => {
        console.error('Erro ao deletar task:', err);
      }
    });
  }

}
