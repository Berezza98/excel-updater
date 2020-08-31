import { Workbook } from 'exceljs/excel';
// const Excel = require('exceljs');

class ExcelParser {
  static async getColumnNames(filename) {
    try {
      const workbook = new Workbook();
      await workbook.xlsx.readFile(filename);
      return workbook.getWorksheet().getRow(1).values.filter(value => value);
    } catch(e) {
      console.log(e);
    }
  };

  static async parse(filename, options) {
    try {
      const workbook = new Workbook();
      await workbook.xlsx.readFile(filename);
      let result = {};
      workbook.eachSheet((worksheet) => {
        const iDCellNumber = worksheet.getRow(1).values.findIndex(value => value === options.idField);
        const priceCellNumber = worksheet.getRow(1).values.findIndex(value => value === options.priceField);
        const countCellNumber = worksheet.getRow(1).values.findIndex(value => value === options.countField);
        const oldPriceCellNumber = worksheet.getRow(1).values.findIndex(value => value === options.oldPrice);

        for (let i = 2; i <= worksheet.actualRowCount; i++) {
          const row = worksheet.getRow(i);
          const productIDCell = row.getCell(iDCellNumber);
          const id = productIDCell.value;
          if (id) {
            result[id.toString().trim()] = {
              row,
              iDCellNumber,
              priceCellNumber,
              countCellNumber,
              oldPriceCellNumber
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

  static compareAndChange(main, compareObjects, options) {
    const { coefficient } = options;
    Object.entries(main).forEach(([id, rowObj]) => {
      const neededObj = compareObjects[id];
      if (!neededObj) {
        return;
      }
      const newPrice = neededObj.row.getCell(neededObj.priceCellNumber).value * coefficient;
      const oldPrice = newPrice * options.oldPriceCoefficient;

      const newCountText = neededObj.row.getCell(neededObj.countCellNumber).value;
      const newCount = (/\d+/).exec(newCountText) ? (/\d+/).exec(newCountText)[0] : 0;

      rowObj.row.getCell(rowObj.priceCellNumber).value = newPrice.toFixed(2);
      rowObj.row.getCell(rowObj.countCellNumber).value = newCount;
      rowObj.row.getCell(rowObj.oldPriceCellNumber).value = oldPrice.toFixed(2);
    });
    return main.workbook;
  }
};

export default ExcelParser;