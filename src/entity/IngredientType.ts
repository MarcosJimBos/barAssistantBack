import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany } from "typeorm"
import { ProductType } from "./ProductType"


@Entity()
@Unique(["name"])
export class IngredientType {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    image: string

    @Column()
    quantity: number

    @Column()
    customizable: boolean

    @ManyToMany(() => ProductType, productType => productType.ingredientsType)
    productsType: ProductType[]
}