import { UUID } from "sequelize";
import { Sequelize } from "sequelize";
import { Column, DataType, Model, Table } from "sequelize-typescript";

enum TaskStatus {
    Created = "CREATED",
    InProgress = "IN PROGRESS",
    Completed = "COMPLETED",
    Failed = "FAILED"
}

@Table({
    tableName: 'tasks'
})
export class Task extends Model {
    @Column({
        type: DataType.UUID,
        unique: true,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataType.UUIDV4
    })
    id: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: new Date()
    })
    createdAt: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: new Date()
    })
    updatedAt: Date;

    @Column({
        type: DataType.ENUM(TaskStatus.Created, TaskStatus.InProgress, TaskStatus.Completed, TaskStatus.Failed),
        defaultValue: TaskStatus.Created
    })
    status: TaskStatus;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    feedUrl: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: 'jobs'
    })
    listingDescriptor: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: 'job'
    })
    elementDescriptor: string;

    @Column
    completedAt?: Date;

    @Column
    numberOfPosts?: string;
}