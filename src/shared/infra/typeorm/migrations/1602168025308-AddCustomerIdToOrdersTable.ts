import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddCustomerIdToOrdersTable1602168025308
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add column "customer_id" to "orders" table
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'customer_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Add FK "OrdersCustomer" to "customers_id" that references "id" on "customers" table
    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        name: 'OrdersCustomer',
        columnNames: ['customer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'customers',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FK "OrdersCustomer" from "customer_id" column
    await queryRunner.dropForeignKey('orders', 'OrdersCustomer');

    // Drop "customer_id" column
    await queryRunner.dropColumn('orders', 'customer_id');
  }
}
