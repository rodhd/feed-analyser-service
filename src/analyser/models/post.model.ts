import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Task } from "src/tasks/models/task.model";

@Table({
    tableName: 'posts'
})
export class Post extends Model {
    @Column({
        type: DataType.INTEGER({ unsigned: true }),
        primaryKey: true,
        autoIncrement: true,
    })
    public id!: number;

    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    @ForeignKey(() => Task)
    taskId: string

    @Column({
        type: DataType.JSON,
        allowNull: false
    })
    data: object;

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
}