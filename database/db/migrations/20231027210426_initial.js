const tableNames = require('../../constants/tableNames');
const orderedTableNames = require('../../constants/orderedTableNames');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  console.log('Creating:', tableNames.User);
  await knex.schema.createTable(tableNames.User, (table) => {
    table.string('NetID').notNullable().unique().primary();
    table.string('Name').notNullable();
    table.string('Email', 254).notNullable().unique();
    table.boolean('Is_Faculty').notNullable().defaultTo(false);
    table.boolean('Is_Student').notNullable().defaultTo(false);
    table.boolean('Is_Admin').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });

  console.log('Creating:', tableNames.Device);
  await knex.schema.createTable(tableNames.Device, (table) => {
    table.string('Tag').notNullable().unique().primary();
    table.string('Model_Category').notNullable();
    table.string('Device_Display_Name').notNullable();
    table.string('Assigned_To');
    table.string('Reserved_NetID').references('NetID').inTable(tableNames.User);
    table.string('Location');
    table.string('Funding_Source');
    table.string('Dept_Ownership');
    table.string('Serial_Number');
    table.integer('PO', 10);
    table.date('Warranty_EXP');
    table.boolean('Available').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });

  console.log('Creating:', tableNames.Room);
  await knex.schema.createTable(tableNames.Room, (table) => {
    table.string('Building').notNullable();
    table.string('RoomNumber').notNullable();
    table.date('Date').notNullable();
    table.integer('Time').notNullable();
    table.boolean('Available').notNullable().defaultTo(true);
    table.string('Reserved_Name');
    table.string('Reserved_NetID').references('NetID').inTable(tableNames.User);
    table.integer('Max_Occupancy').notNullable();
    table.boolean('Is_Office').notNullable().defaultTo(false);
    table.timestamps(true, true);

    table.primary(['Building', 'RoomNumber', 'Date', 'Time']);
  });

  console.log('Creating:', tableNames.Device_Res);
  await knex.schema.createTable(tableNames.Device_Res, (table) => {
    table.increments('id').primary();
    table.string('NetID').notNullable().references('NetID').inTable(tableNames.User);
    table.string('Tag').notNullable().references('Tag').inTable(tableNames.Device);
    table.date('Request_Date').notNullable();
    table.date('Start_Date').notNullable();
    table.date('End_Date').notNullable();
    table.timestamps(true, true);
  });

  console.log('Creating:', tableNames.Room_Res);
  await knex.schema.createTable(tableNames.Room_Res, (table) => {
    table.increments('id').primary();
    table.string('NetID').notNullable().references('NetID').inTable(tableNames.User);
    table.string('Building').notNullable();
    table.string('RoomNumber').notNullable();
    table.date('Date').notNullable();
    table.integer('Time').notNullable();
    table.date('Request_Date').notNullable();
    table.timestamps(true, true);

    table.foreign(['Building', 'RoomNumber', 'Date', 'Time']).references(['Building', 'RoomNumber', 'Date', 'Time']).inTable(tableNames.Room);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  for (const tableName of orderedTableNames) {
    console.log('Dropping:', tableName);
    await knex.schema.dropTableIfExists(tableNames[tableName]);
  }
};
