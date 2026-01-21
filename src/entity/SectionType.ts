import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm"
import { ProductType } from "./ProductType"
import { ElaborationSequenceType } from './ElaborationSequenceType';
import { DeviceType } from "./DeviceType";

@Entity()
@Unique(["name"])
export class SectionType {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
    @Column()
    description: string
    @OneToMany(() => ElaborationSequenceType, elaborationSequenceType => elaborationSequenceType.sectionType)
    sectionsType: SectionType[]
    @OneToMany(() => DeviceType, deviceType => deviceType.sectionType)
    deviceTypes: DeviceType[]



}