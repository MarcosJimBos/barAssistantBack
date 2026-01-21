import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Enterprise } from '../entity/Enterprise';

export class EnterpriseController {

    private enterpriseRepository = AppDataSource.getRepository(Enterprise)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.enterpriseRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        const user = await this.enterpriseRepository.findOne({
            where: { id },

        })

        if (!user) {
            return "unregistered enterprise"
        }
        return user
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { id, name, address, phone, nif } = request.body;
        var user;
        user = Object.assign(new Enterprise(), {
            id,
            name,
            address,
            phone,
            nif
        })

        try {
            await this.enterpriseRepository.save(user)
            response.status(200).json({
                "message": "Enterprise saved successfully",
                "object": user
            });
        } catch (error) {
            response.status(500).json({
                "message": error.detail,
                "object": error
            });

        }
        //return user;
    }
    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let userToRemove = await this.enterpriseRepository.findOneBy({ id })

        if (!userToRemove) {
            return "this user not exist"
        }

        await this.enterpriseRepository.remove(userToRemove)

        return "user has been removed";
    }

}