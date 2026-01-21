import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, ManyToMany, OneToMany } from "typeorm"
import { OrderLine } from "./OrderLine"
import { Enterprise } from "./Enterprise"
import { Product } from "./Product"
import { ElaborationSequence } from "./ElaborationSequence"
import { Device } from "./Device"

@Entity()
export class Section {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
    @Column()
    description: string
    @ManyToOne(() => Enterprise, (enterprise) => enterprise.sections)
    enterprise: Enterprise
    @OneToMany(() => ElaborationSequence, elaborationSequence => elaborationSequence.section)
    sections: Section[]
    @OneToMany(() => Device, device => device.section)
    devices: Device[]



}