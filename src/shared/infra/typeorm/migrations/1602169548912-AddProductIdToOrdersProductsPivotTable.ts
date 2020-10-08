import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddProductIdToOrdersProductsPivotTable1602169548912
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add "product_id" to "orders_products" pivot table
    await queryRunner.addColumn(
      'orders_products',
      new TableColumn({
        name: 'product_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Add FK "OrdersProductsProduct" to "product_id" that references "id" on "products" table
    await queryRunner.createForeignKey(
      'orders_products',
      new TableForeignKey({
        name: 'OrdersProductsProduct',
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FK "OrdersProductsProduct" from "product_id" column
    await queryRunner.dropForeignKey(
      'orders_products',
      'OrdersProductsProduct',
    );

    // Drop "product_id" column
    await queryRunner.dropColumn('orders_products', 'product_id');
  }
}
