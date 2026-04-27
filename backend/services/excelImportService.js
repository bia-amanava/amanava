const db = require('../database/db');
const xlsx = require('xlsx');

function normalizeKeys(row, mapping) {
  const normalized = {};
  for (const [excelKey, dbKey] of Object.entries(mapping)) {
    normalized[dbKey] = row[excelKey] !== undefined ? row[excelKey] : null;
  }
  return normalized;
}

const mappings = {
  "Calendar": {
    "ID": "calendar_id",
    "Date": "date",
    "DayNumberOfWeek": "day_number_of_week",
    "DayName": "day_name",
    "MonthName": "month_name",
    "MonthNumberOfYear": "month_number_of_year",
    "DayNumberOfYear": "day_number_of_year",
    "WeekNumberOfYear": "week_number_of_year",
    "CalendarQuarter": "calendar_quarter",
    "CalendarYear": "calendar_year",
    "Fiscal Year": "fiscal_year",
    "FiscalSemester": "fiscal_semester",
    "FiscalQuarter": "fiscal_quarter",
    "FinMonthNumberOfYear": "fin_month_number_of_year",
    "DayNumberOfMonth": "day_number_of_month",
    "Period": "period",
    "Month ID": "month_id"
  },
  "Products": {
    "ProductKey": "product_key",
    "ProductSubcategoryKey": "product_subcategory_key",
    "ProductName": "product_name",
    "StandardCost": "standard_cost",
    "Color": "color",
    "SafetyStockLevel": "safety_stock_level",
    "ListPrice": "list_price",
    "Size": "size",
    "SizeRange": "size_range",
    "Weight": "weight",
    "DaysToManufacture": "days_to_manufacture",
    "ProductLine": "product_line",
    "DealerPrice": "dealer_price",
    "Class": "class",
    "ModelName": "model_name",
    "Description": "description",
    "Status": "status",
    "SubCategory": "subcategory",
    "Category": "category",
    "StartDate": "start_date",
    "EndDate": "end_date"
  },
  "Customers": {
    "CustomerKey": "customer_key",
    "GeographyKey": "geography_key",
    "Name": "name",
    "BirthDate": "birth_date",
    "MaritalStatus": "marital_status",
    "Gender": "gender",
    "YearlyIncome": "yearly_income",
    "NumberChildrenAtHome": "number_children_at_home",
    "Occupation": "occupation",
    "HouseOwnerFlag": "house_owner_flag",
    "NumberCarsOwned": "number_cars_owned",
    "AddressLine1": "address_line_1",
    "AddressLine2": "address_line_2",
    "Phone": "phone",
    "DateFirstPurchase": "date_first_purchase"
  },
  "Territory": {
    "Territory Key": "territory_key",
    "Region": "region",
    "Country": "country",
    "Group": "territory_group"
  },
  "Sales": {
    "OrderDate": "order_date",
    "OrderDate Key": "order_date_key",
    "ProductKey": "product_key",
    "CustomerKey": "customer_key",
    "SalesTerritoryKey": "sales_territory_key",
    "SalesOrderNumber": "sales_order_number",
    "ShipDate": "ship_date",
    "SalesOrderLineNumber": "sales_order_line_number",
    "OrderQuantity": "order_quantity",
    "UnitPrice": "unit_price",
    "ExtendedAmount": "extended_amount",
    "UnitPriceDiscountPct": "unit_price_discount_pct",
    "DiscountAmount": "discount_amount",
    "ProductStandardCost": "product_standard_cost",
    "TotalProductCost": "total_product_cost",
    "SalesAmount": "sales_amount",
    "TaxAmt": "tax_amt",
    "Freight": "freight",
    "RegionMonthID": "region_month_id"
  },
  "dimProductSubCategory": {
    "ProductSubcategoryKey": "product_subcategory_key",
    "ProductSubcategoryAlternateKey": "product_subcategory_alternate_key",
    "EnglishProductSubcategoryName": "english_product_subcategory_name",
    "SpanishProductSubcategoryName": "spanish_product_subcategory_name",
    "FrenchProductSubcategoryName": "french_product_subcategory_name",
    "ProductCategoryKey": "product_category_key"
  },
  "dimProductCategory": {
    "ProductCategoryKey": "product_category_key",
    "ProductCategoryAlternateKey": "product_category_alternate_key",
    "EnglishProductCategoryName": "english_product_category_name",
    "SpanishProductCategoryName": "spanish_product_category_name",
    "FrenchProductCategoryName": "french_product_category_name"
  },
  "BudgetPeriod": {
    "CalendarYear": "calendar_year",
    "MonthName": "month_name",
    "Month Number": "month_number",
    "Period": "period"
  },
  "Budget": {
    "Category": "category",
    "Budget": "budget",
    "Period": "period"
  }
};

const tableNames = {
  "Calendar": "calendar",
  "Products": "products",
  "Customers": "customers",
  "Territory": "territory",
  "Sales": "fact_sales",
  "dimProductSubCategory": "dim_product_subcategory",
  "dimProductCategory": "dim_product_category",
  "BudgetPeriod": "budget_period",
  "Budget": "fact_budget"
};

function processExcelWorkbook(workbook, tenantId, uploadId) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      
      const insertedCounts = {};
      const sheetNames = workbook.SheetNames;
      
      for (const [sheetName, tableName] of Object.entries(tableNames)) {
        insertedCounts[tableName] = 0;
      }

      try {
        for (const sheetName of sheetNames) {
          const mapping = mappings[sheetName];
          const tableName = tableNames[sheetName];
          
          if (!mapping || !tableName) continue;
          
          const worksheet = workbook.Sheets[sheetName];
          // Tratar datas corretamente no excel, raw: false faz com que formatação de texto de data funcione
          const jsonArray = xlsx.utils.sheet_to_json(worksheet, { defval: null, raw: false });
          
          if (jsonArray.length === 0) continue;

          for (const row of jsonArray) {
            const normalizedRow = normalizeKeys(row, mapping);
            
            normalizedRow.tenant_id = tenantId;
            normalizedRow.upload_id = uploadId;

            // default status for fact_sales
            if (tableName === 'fact_sales') {
              normalizedRow.status = 'pending';
              normalizedRow.audit_log = null;
            }
            
            const columns = Object.keys(normalizedRow);
            const values = Object.values(normalizedRow);
            
            const placeholders = columns.map(() => '?').join(', ');
            
            let sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
            db.run(sql, values, function(err) {
              if (err) {
                console.error(`Erro ao inserir na tabela ${tableName}:`, err.message);
                throw err;
              }
            });
            insertedCounts[tableName]++;
          }
        }

        db.run("COMMIT", (err) => {
          if (err) {
            db.run("ROLLBACK");
            return reject(err);
          }
          resolve(insertedCounts);
        });
      } catch (err) {
        db.run("ROLLBACK");
        reject(err);
      }
    });
  });
}

module.exports = { processExcelWorkbook };
