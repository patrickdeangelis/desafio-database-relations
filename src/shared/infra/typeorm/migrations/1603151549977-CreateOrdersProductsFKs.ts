import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class CreateOrdersProductsFKs1603151549977 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createForeignKey('orders_products', new TableForeignKey({
      name: 'OrdersProductsOrder',
      columnNames: ['order_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'orders',
      onDelete: 'SET NULL'
    }))

    await queryRunner.createForeignKey('orders_products', new TableForeignKey({
      name: 'OrdersProductsProduct',
      columnNames: ['product_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'products',
      onDelete: 'SET NULL'
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey('orders_products', 'OrdersProductsOrder')
    await queryRunner.dropForeignKey('orders_products', 'OrdersProductsProduct')
  }

}
