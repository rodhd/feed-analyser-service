import { Column, Model, Table } from "sequelize-typescript";

@Table
export class Feed extends Model {
    @Column
    name: string;

    @Column
    channelId: number;

    @Column
    countries?: string;

    @Column
    types?: string;
}