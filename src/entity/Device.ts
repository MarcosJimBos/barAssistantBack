import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, ManyToMany, OneToMany } from "typeorm"
import { OrderLine } from "./OrderLine"
import { Enterprise } from "./Enterprise"
import { Product } from "./Product"
import { ElaborationSequence } from "./ElaborationSequence"
import { SectionType } from "./SectionType"
import { Section } from "./Section"

@Entity()
export class Device {

    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    description: string
    @ManyToOne(() => Section, section => section.devices)
    section: Section

}