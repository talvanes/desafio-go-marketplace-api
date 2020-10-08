import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateOrdersTable1601665701550
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create "orders" table
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop "orders" table
    await queryRunner.dropTable('orders');
  }
}
