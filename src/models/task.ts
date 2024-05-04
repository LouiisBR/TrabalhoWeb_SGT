import { TaskStatus } from "@prisma/client";


export class TaskModel {
    title: string;
    description: string;
    status: TaskStatus;
    completedAt?: Date;
    categoryId: string;
    userId: string;

    constructor(){
        this.title = '';   
        this.description = ''; 
        this.status = 'openTask';
        this.userId = '';
        this.categoryId = '';
    }
}