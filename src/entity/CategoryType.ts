import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, ManyToMany, ManyToOne, JoinTable } from "typeorm"
import { ProductType } from "./ProductType"
@Unique(["name"])
@Entity()
export class CategoryType {

    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    description: string
    @Column()
    image: string

    @ManyToMany(() => ProductType, productType => productType.categoriesType)
    productsType: ProductType[]

    @OneToMany(() => CategoryType, categoryType => categoryType.parentCategoryType)
    subcategoriesType: CategoryType[]

    @ManyToOne(() => CategoryType, categoryType => categoryType.subcategoriesType)
    parentCategoryType: CategoryType

}