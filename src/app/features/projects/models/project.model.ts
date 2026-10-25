export type ProjectStatus = 'Planned' | 'In Progress' | 'Completed';

export interface Project {
    id:string;
    name:string;
    description:string;
    status:ProjectStatus;
    progress: number;
    dueDate: string;
    members: string[];
    color: string;
    createdAt: string;
}