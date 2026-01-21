import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany, JoinTable, ManyToOne, OneToMany } from "typeorm"
import { CategoryType } from "./CategoryType"
import { IngredientType } from "./IngredientType"
import { ElaborationSequenceType } from "./ElaborationSequenceType"

@Entity()
@Unique(["name"])
export class ProductType {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    sellPrice: number

    @Column()
    image: string

    @Column()
    quantity: number

    @ManyToMany(() => CategoryType, categoryType => categoryType.productsType)
    @JoinTable()
    categoriesType: CategoryType[];

    @ManyToMany(() => IngredientType, (ingredientType) => ingredientType.productsType)
    @JoinTable()
    ingredientsType: IngredientType[];

    @OneToMany(() => ElaborationSequenceType, (elaborationSequenceType) => elaborationSequenceType.productType)
    elaborationSequences: ElaborationSequenceType[];




}