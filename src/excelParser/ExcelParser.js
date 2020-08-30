import { Workbook } from 'exceljs/excel';
// const Excel = require('exceljs');

class ExcelParser {
  static async parse(filename, options) {
    try {
      console.log(options);
      const workbook = new Workbook();
      await workbook.xlsx.readFile(filename);
      let result = {};
      workbook.eachSheet((worksheet) => {
        const IDCellNumber = worksheet.getRow(1).values.findIndex(value => value === options.idField);
        const PriceCellNumber = worksheet.getRow(1).values.findIndex(value => value === options.priceField);
        const CountCellNumber = worksheet.getRow(1).values.findIndex(value => value === options.countField);
        for (let i = 2; i <= worksheet.actualRowCount; i++) {
          const row = worksheet.getRow(i);
          const productIDCell = row.getCell(IDCellNumber);
          const id = productIDCell.value;
          if (id) {
            result[id.toString().trim()] = {
              row,
              IDCellNumber,
              PriceCellNumber,
              CountCellNumber
            };
          }
        }
      });
      Object.defineProperty(result, 'workbook', {
        value: workbook,
        enumerable: false,
      });
      return result;
    } catch(e) {
      console.log(e);
    }
  }

  static compareAndChange(main, compareObjects) {
    Object.entries(main).forEach(([id, value]) => {
      const neededObj = compareObjects[id];
      if (!neededObj) {
        return;
      }
      const newPrice = neededObj.row.getCell(neededObj.PriceCellNumber).value;
      const newCount = neededObj.row.getCell(neededObj.CountCellNumber).value;

      value.row.getCell(value.PriceCellNumber).value = newPrice;
      value.row.getCell(value.CountCellNumber).value = newCount;
    });
    return main.workbook;
  }
};

export default ExcelParser;