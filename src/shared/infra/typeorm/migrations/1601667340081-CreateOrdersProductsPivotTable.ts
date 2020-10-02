import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateOrdersProductsPivotTable1601667340081
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create "orders_customers" pivot table
    await queryRunner.createTable(
      new Table({
        name: 'orders_customers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'product_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'order_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'quantity',
            type: 'integer',
            default: 0,
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

    await queryRunner.createForeignKeys('orders_customers', [
      // Create foreign key "OrderProductProduct"
      new TableForeignKey({
        name: 'OrderProductProduct',
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),

      // Create foreign key "OrderProductOrder"
      new TableForeignKey({
        name: 'OrderProductOrder',
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key "OrderProductOrder"
    await queryRunner.dropForeignKey('orders_customers', 'OrderProductOrder');

    // Drop foreign key "OrderProductProduct"
    await queryRunner.dropForeignKey('orders_customers', 'OrderProductProduct');

    // Drop "orders_customers" pivot table
    await queryRunner.dropTable('orders_customers');
  }
}
