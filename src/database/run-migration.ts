import { AppDataSource } from './data-source';

async function runMigration() {
  try {
    console.log('Initializing data source...');
    await AppDataSource.initialize();

    console.log('Running migrations...');
    const migrations = await AppDataSource.runMigrations();

    if (migrations.length === 0) {
      console.log('No migrations to run.');

      // Check if users table exists
      const queryRunner = AppDataSource.createQueryRunner();
      try {
        const result = await queryRunner.query(
          `SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'users'
          )`,
        );

        if (!result[0].exists) {
          console.log('Users table does not exist. Creating it now...');
          await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            
            CREATE TABLE users (
              id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
              email varchar NOT NULL UNIQUE,
              password varchar NOT NULL,
              roles text NOT NULL DEFAULT 'USER',
              "isActive" boolean NOT NULL DEFAULT true,
              "isDeleted" boolean NOT NULL DEFAULT false,
              "firstName" varchar,
              "lastName" varchar,
              "createdAt" timestamp NOT NULL DEFAULT now(),
              "updatedAt" timestamp NOT NULL DEFAULT now()
            );
          `);
          console.log('Users table created successfully!');
        } else {
          console.log('Users table already exists.');
        }
      } finally {
        await queryRunner.release();
      }
    } else {
      console.log(`Successfully ran ${migrations.length} migration(s)`);
      migrations.forEach((migration) => {
        console.log(`- ${migration.name}`);
      });
    }

    await AppDataSource.destroy();
    console.log('Done!');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigration();
