import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany, ManyToOne } from "typeorm"
import { Enterprise } from './Enterprise';
import { Product } from "./Product";

@Entity()
@Unique(["name"])
export class Category {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    image: string
    @ManyToOne(() => Enterprise, enterprise => enterprise.categories)
    enterprise: Enterprise
    @ManyToMany(() => Product, product => product.categories)
    products: Product[]

    

}