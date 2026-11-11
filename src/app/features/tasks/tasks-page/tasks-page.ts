import { Component, computed, inject, signal } from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TasksApiService } from '../../projects/data-access/tasks-api.service';
import { ProjectsApiService } from '../../projects/data-access/projects-api.service';
import { TaskStatus } from '../../projects/models/task.model';

@Component({
  selector: 'app-tasks-page',
  imports: [RouterLink],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.scss',
})
export class TasksPage {
  //displays, searches, filters, and updates a list of tasks using Angular Signals
  private readonly tasksService = inject(TasksApiService);
  private readonly projectsService = inject(ProjectsApiService);
  private readonly route = inject(ActivatedRoute);

  private readonly queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  }); //It allows component to react automatically whenever query parameters in the URL change

  readonly searchTerm = signal('');
  readonly statusFilter = signal('All');

  readonly filteredTasks = computed(() => {
    const query = (this.searchTerm() || this.queryParams().get('q') || '').trim().toLowerCase();
    const status = this.statusFilter();

    return this.tasksService.tasks().filter((task) => {
      const matchesText =
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.assignee.toLowerCase().includes(query);
      return matchesText && (status === 'All' || task.status === status);
    });
  });
  projectName(projectId: string): string {
    return (
      this.projectsService.projects().find((project) => project.id === projectId)?.name ??
      'Unknown project'
    ); //this method looks up a project by its unique ID and returns its name, or returns 'Unknown project'

    //?? 'Unknown project' (Nullish Coalescing): Checks if the left side evaluated to null or undefined. If it did, it returns the fallback string 'Unknown project'
  }

  updateStatus(taskId: string, status: TaskStatus): void {
    this.tasksService.updateTaskStatus(taskId, status);
  }
}
