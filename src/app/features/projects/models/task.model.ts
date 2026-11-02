export type TaskStatus=
| 'Todo'
| 'In Progress'
| 'Completed';

export type TaskPriority=
| 'Low'
| 'Medium'
| 'High'
| 'Urgent';

export interface Task{
    id: string;
    projectId: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignee: string;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
}