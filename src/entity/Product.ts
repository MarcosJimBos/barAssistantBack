import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, ManyToOne, ManyToMany, JoinTable } from "typeorm"
import { OrderLine } from "./OrderLine"
import { Enterprise } from "./Enterprise"
import { Ingredient } from "./Ingredient"
import { Category } from "./Category"
import { ElaborationSequence } from "./ElaborationSequence"
import { Section } from "./Section"

@Entity()
@Unique(["name"])
export class Product {

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

    @OneToMany(() => OrderLine, orderLine => orderLine.product)
    orderLines: OrderLine[]

    @ManyToOne(() => Enterprise, enterprise => enterprise.products)
    enterprise: Enterprise

    @ManyToMany(() => Ingredient, ingredient => ingredient.products)
    @JoinTable()
    ingredients: Ingredient[]

    @ManyToMany(() => Category, category => category.products)
    @JoinTable()
    categories: Category[]
    @OneToMany(() => ElaborationSequence, elaborationSequence => elaborationSequence.product)
    elaborationSequences: ElaborationSequence[]



}