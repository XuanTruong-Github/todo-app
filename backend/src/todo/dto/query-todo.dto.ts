export class QueryTodoDto {
    page?: number = 1;
    limit?: number = 20;
    search?: string;
    status?: string;
    priority?: string;
}