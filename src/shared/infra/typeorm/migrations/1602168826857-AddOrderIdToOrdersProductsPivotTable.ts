import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddOrderIdToOrdersProductsPivotTable1602168826857
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add "order_id" to "orders_products" pivot table
    await queryRunner.addColumn(
      'orders_products',
      new TableColumn({
        name: 'order_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Add FK "OrdersProductsOrder" to "order_id" that references "id" on "orders" table
    await queryRunner.createForeignKey(
      'orders_products',
      new TableForeignKey({
        name: 'OrdersProductsOrder',
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FK "OrdersProductsOrder" from "order_id" column
    await queryRunner.dropForeignKey('orders_products', 'OrdersProductsOrder');

    // Drop "order_id" column
    await queryRunner.dropColumn('orders_products', 'order_id');
  }
}
