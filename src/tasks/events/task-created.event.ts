export class TaskCreatedEvent {
    id: string;

    constructor(id: string) {
        this.id = id;
    }
}