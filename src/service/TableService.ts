import { AppDataSource } from "../data-source";
import { Table } from "../entity/Table";
import { TableStatus } from "../entity/TableStatus";

export class TableService {

    private tableRepository = AppDataSource.getRepository(Table);

    // GetTable
    async GetTable(id: number): Promise<Table | null> {
        return await this.tableRepository.findOne({
            where: { id },
            relations: {
                orders: true
            }
        });
    }

    //GetTables 
    async GetTables(): Promise<Table[]> {
        return await this.tableRepository.find({
            relations: {
                orders: true
            }
        });
    }

    // SaveTable (CREA o ACTUALIZA)
    async SaveTable(table: Table): Promise<Table> {
        return await this.tableRepository.save(table);
    }

    // DeleteTable
    async DeleteTable(id: number): Promise<boolean> {
        const table = await this.GetTable(id);

        if (!table) {
            return false;
        }

        await this.tableRepository.remove(table);
        return true;
    }

    //Cambiar estado de la mesa
    async ChangeTableStatus(id: number, status: TableStatus): Promise<Table | null> {
        const table = await this.GetTable(id);

        if (!table) {
            return null;
        }

        table.status = status;
        return await this.SaveTable(table);
    }
}
