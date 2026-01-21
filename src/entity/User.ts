import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne } from "typeorm"
import { Enterprise } from "./Enterprise"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    passwd: string

    @ManyToOne(() => Enterprise, (enterprise) => enterprise.users,)
    enterprise: Enterprise
}