import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, ManyToMany } from "typeorm"
import { Enterprise } from "./Enterprise"
import { Product } from "./Product"

@Entity()
@Unique(["name"])
export class Ingredient {

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

    @ManyToOne(() => Enterprise, (enterprise) => enterprise.ingredients)
    enterprise: Enterprise
    @ManyToMany(() => Product, product => product)
    products: Product[]

}