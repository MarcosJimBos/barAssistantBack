import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Product } from "../entity/Product"

export class ProductController {


    private productRepository = AppDataSource.getRepository(Product)

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const productList = await this.productRepository.find()
            response.status(200).json({
                "message": "list products retieved successfully",
                "object": productList
            });
        } catch (error) {
            response.status(500).json({
                "message": error.detail,
                "object": error
            });
        }
    }
    async oneWithElaborationSequence(id: number, arg1: null, arg2: null) {
        try {
            const product = await this.productRepository.findOne({
                where: { id },
                relations: {
                    elaborationSequences: {
                        section: true
                    }
                }
            })
            if (product) {
                return product;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    }
    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)
        try {
            const product = await this.productRepository.findOne({
                where: { id },
                relations: {
                    elaborationSequences: {
                        section: true
                    }
                }
            })
            if (product) {
                response.status(200).json({
                    "message": "product retieved successfully",
                    "object": product
                });
            } else {
                response.status(404).json({
                    "message": "product not found",
                    "object": null
                });
            }

        } catch (error) {
            response.status(500).json({
                "message": error.detail,
                "object": error
            });
        }
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const productData = request.body;

        try {
            await this.productRepository.save(productData)
            response.status(200).json({
                "message": "Product saved successfully",
                "object": productData
            });
        } catch (error) {
            response.status(500).json({
                "message": error.detail,
                "object": error
            });

        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)


        try {
            let productRemove = await this.productRepository.findOneBy({ id })

            if (!productRemove) {
                response.status(400).json({
                    "message": "Product with id " + id + " doesn't existe",
                    "object": null
                });
            } else {
                await this.productRepository.remove(productRemove)
                response.status(200).json({
                    "message": "Product removed successfully",
                    "object": productRemove
                });
            }
        } catch (error) {
            response.status(500).json({
                "message": error.detail,
                "object": error
            });

        }
    }

}