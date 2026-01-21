import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany, JoinTable, ManyToOne } from "typeorm"
import { SectionType } from "./SectionType"
import { ProductType } from "./ProductType"

@Entity()
export class ElaborationSequenceType {

    @PrimaryGeneratedColumn()
    id: number
    @Column()
    sectionOrder: number

    @ManyToOne(() => ProductType, (productType) => productType.elaborationSequences)
    productType: ProductType;
    @ManyToOne(() => SectionType, (sectionType) => sectionType.sectionsType)
    sectionType: SectionType;




}