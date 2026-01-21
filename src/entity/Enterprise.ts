import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from "typeorm"
import { User } from "./User"
import { Order } from "./Order"
import { Section } from "./Section"
import { Product } from "./Product"
import { Category } from "./Category"
import { Ingredient } from "./Ingredient"

@Entity()
export class Enterprise {
    @PrimaryGeneratedColumn()
    id: number
    @Unique(['name'])
    @Column()
    name: string

    @Column()
    address: string

    @Column()
    phone: string

    @Column()
    nif: string

    @OneToMany(() => User, (user) => user.enterprise)
    users: User[]

    @OneToMany(() => Order, (order) => order.enterprise)
    orders: Order[]

    @OneToMany(() => Section, (section) => section.enterprise)
    sections: Section[]

    @OneToMany(() => Product, (product) => product.enterprise)
    products: Product[]

    @OneToMany(() => Category, (category) => category.enterprise)
    categories: Category[]

    @OneToMany(() => Ingredient, (ingredient) => ingredient.enterprise)
    ingredients: Ingredient[];
}