import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateOrdersTable1601665701550
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create 'orders' table
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'customer_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    // Create foreign key 'OrderCustomer' on 'customer_id' to 'id' on 'customers'
    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        name: 'OrderCostumer',
        columnNames: ['customer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'customers',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key 'OrderCustomer'
    await queryRunner.dropForeignKey('orders', 'OrderCustomer');

    // Drop 'orders' table
    await queryRunner.dropTable('orders');
  }
}
