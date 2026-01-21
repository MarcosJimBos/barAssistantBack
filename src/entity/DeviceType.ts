import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, ManyToMany, OneToMany } from "typeorm"
import { OrderLine } from "./OrderLine"
import { Enterprise } from "./Enterprise"
import { Product } from "./Product"
import { ElaborationSequence } from "./ElaborationSequence"
import { SectionType } from "./SectionType"

@Entity()
export class DeviceType {

    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    description: string
    @ManyToOne(() => SectionType, sectionType => sectionType.deviceTypes)
    sectionType: SectionType

}