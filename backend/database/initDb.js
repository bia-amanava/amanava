const db = require('./db');

function initDb() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Tabela uploads
      db.run(`
        CREATE TABLE IF NOT EXISTS uploads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tenant_id TEXT NOT NULL,
          user_email TEXT NOT NULL,
          file_name TEXT NOT NULL,
          file_type TEXT NOT NULL,
          upload_status TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabela calendar
      db.run(`
        CREATE TABLE IF NOT EXISTS calendar (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tenant_id TEXT NOT NULL,
          upload_id INTEGER NOT NULL,
          calendar_id INTEGER,
          date TEXT,
          day_number_of_week INTEGER,
          day_name TEXT,
          month_name TEXT,
          month_number_of_year INTEGER,
          day_number_of_year INTEGER,
          week_number_of_year INTEGER,
          calendar_quarter INTEGER,
          calendar_year INTEGER,
          fiscal_year INTEGER,
          fiscal_semester INTEGER,
          fiscal_quarter INTEGER,
          fin_month_number_of_year INTEGER,
          day_number_of_month INTEGER,
          period INTEGER,
          month_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabela products
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tenant_id TEXT NOT NULL,
          upload_id INTEGER NOT NULL,
          product_key INTEGER,
          product_subcategory_key INTEGER,
          product_name TEXT,
          standard_cost REAL,
          color TEXT,
          safety_stock_level INTEGER,
          list_price REAL,
          size REAL,
          size_range TEXT,
          weight REAL,
          days_to_manufacture INTEGER,
          product_line TEXT,
          dealer_price REAL,
          class TEXT,
          model_name TEXT,
          description TEXT,
          status TEXT,
          subcategory TEXT,
          category TEXT,
          start_date TEXT,
          end_date TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabela customers
      db.run(`
        CREATE TABLE IF NOT EXISTS customers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tenant_id TEXT NOT NULL,
          upload_id INTEGER NOT NULL,
          customer_key INTEGER,
          geography_key INTEGER,
          name TEXT,
          birth_date TEXT,
          marital_status TEXT,
          gender TEXT,
          yearly_income REAL,
          number_children_at_home INTEGER,
          occupation TEXT,
          house_owner_flag INTEGER,
          number_cars_owned INTEGER,
          address_line_1 TEXT,
          address_line_2 TEXT,
          phone TEXT,
          date_first_purchase TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabela territory
      db.run(`
        CREATE TABLE IF NOT EXISTS territory (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tenant_id TEXT NOT NULL,
          upload_id INTEGER NOT NULL,
          territory_key INTEGER,
          region TEXT,
          country TEXT,
          territory_group TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabela fact_sales
      db.run(`
        CREATE TABLE IF NOT EXISTS fact_sales (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tenant_id TEXT NOT NULL,
          upload_id INTEGER NOT NULL,
          order_date TEXT,
          order_date_key INTEGER,
          product_key INTEGER,
          customer_key INTEGER,
          sales_territory_key INTEGER,
          sales_order_number TEXT,
          ship_date TEXT,
          sales_order_line_number INTEGER,
          order_quantity INTEGER,
          unit_price REAL,
          extended_amount REAL,
          unit_price_discount_pct REAL,
          discount_amount REAL,
          product_standard_cost REAL,
          total_product_cost REAL,
          sales_amount REAL,
          tax_amt REAL,
          freight REAL,
          region_month_id TEXT,
          status TEXT DEFAULT 'pending',
          audit_log TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabela dim_product_subcategory
      db.run(`
        CREATE TABLE IF NOT EXISTS dim_product_subcategory (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tenant_id TEXT NOT NULL,
          upload_id INTEGER NOT NULL,
          product_subcategory_key INTEGER,
          product_subcategory_alternate_key INTEGER,
          english_product_subcategory_name TEXT,
          spanish_product_subcategory_name TEXT,
          french_product_subcategory_name TEXT,
          product_category_key INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabela dim_product_category
      db.run(`
        CREATE TABLE IF NOT EXISTS dim_product_category (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tenant_id TEXT NOT NULL,
          upload_id INTEGER NOT NULL,
          product_category_key INTEGER,
          product_category_alternate_key INTEGER,
          english_product_category_name TEXT,
          spanish_product_category_name TEXT,
          french_product_category_name TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabela budget_period
      db.run(`
        CREATE TABLE IF NOT EXISTS budget_period (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tenant_id TEXT NOT NULL,
          upload_id INTEGER NOT NULL,
          calendar_year INTEGER,
          month_name TEXT,
          month_number INTEGER,
          period INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabela fact_budget
      db.run(`
        CREATE TABLE IF NOT EXISTS fact_budget (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tenant_id TEXT NOT NULL,
          upload_id INTEGER NOT NULL,
          category TEXT,
          budget REAL,
          period INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error("Erro ao criar as tabelas:", err.message);
          reject(err);
        } else {
          console.log("Tabelas do banco de dados inicializadas com sucesso.");
          resolve();
        }
      });
    });
  });
}

module.exports = { initDb };
