import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany, JoinTable, ManyToOne } from "typeorm"
import { Section } from "./Section"
import { Product } from "./Product"

@Entity()
export class ElaborationSequence {

    @PrimaryGeneratedColumn()
    id: number
    @Column()
    sectionOrder: number

    @ManyToOne(() => Product, (product) => product.elaborationSequences)
    product: Product;
    @ManyToOne(() => Section, (section) => section.sections)
    section: Section;




}