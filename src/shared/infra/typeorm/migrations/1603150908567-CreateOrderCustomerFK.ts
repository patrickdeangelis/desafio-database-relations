import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class CreateOrderCustomerFK1603150908567 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createForeignKey('orders', new TableForeignKey({
      name: 'OrdersCustomer',
      columnNames: ['customer_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'customers'
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey('orders', 'OrdersCustomer')
  }

}
