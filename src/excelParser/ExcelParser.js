import { Workbook } from 'exceljs/excel';
// const Excel = require('exceljs');

class ExcelParser {
  static async getColumnNames(filename, setLoad) {
    try {
      if (!ExcelParser.files[filename]) {
        setLoad(true);
        const wb = new Workbook();
        console.log('Start');
        console.time("startread");
        await wb.xlsx.readFile(filename);
        ExcelParser.files[filename] = wb;
        setLoad(false);
      }
      const workbook = ExcelParser.files[filename];
      console.timeLog("startread");
      const names = workbook.getWorksheet().getRow(1).values.filter(value => value);
      console.log('End');
      console.timeEnd("startread");
      return names;
    } catch(e) {
      console.log(e);
    }
  };

  static async parse(filename, options, setloadingPersentage) {
    return new Promise((resolve, reject) => {
      const workbook = ExcelParser.files[filename];
      const workSheetsCount = workbook.worksheets.length;
      let result = {};
  
      function help(workSheetIndex, rowIndex) {
        console.log('workSheetsCount: ', workSheetsCount);
        console.log('workSheetIndex: ', workSheetIndex, 'rowIndex: ', rowIndex);
        const workSheet = workbook.worksheets[workSheetIndex];
        const workSheetRowCount = workSheet && workSheet.actualRowCount;

        if (workSheetIndex >= workSheetsCount) {
          Object.defineProperty(result, 'workbook', {
            value: workbook,
            enumerable: false,
          });
          return resolve(result);
        }
  
        if (rowIndex >= workSheetRowCount) {
          return setImmediate(help.bind(null, ++workSheetIndex, 2));
        }
  
        const iDCellNumber = workSheet.getRow(1).values.findIndex(value => value === options.idField);
        const priceCellNumber = workSheet.getRow(1).values.findIndex(value => value === options.priceField);
        const countCellNumber = workSheet.getRow(1).values.findIndex(value => value === options.countField);
        const oldPriceCellNumber = workSheet.getRow(1).values.findIndex(value => value === options.oldPrice);
  
        setloadingPersentage(`${workSheet.name} - ${((rowIndex / workSheetRowCount) * 100).toFixed(2)}%`);
        const row = workSheet.getRow(rowIndex);
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
  
        setImmediate(help.bind(null, workSheetIndex, ++rowIndex));
      }
  
      help(0, 2);
    });
  }

  static compareAndChange(main, compareObjects, options, setloadingPersentage) {
    return new Promise((resolve, reject) => {
      const { coefficient } = options;
      const mainEntries = Object.entries(main);
  
      function help(index) {
        console.log('INDEX: ', index, 'ALL LENGTH: ', mainEntries.length);
        setloadingPersentage(`Compare Changes: ${((index / mainEntries.length) * 100).toFixed(2)}%`);
        if (index === mainEntries.length) {
          return resolve(main.workbook);
        }
  
        const [id, rowObj] = mainEntries[index];
        const neededObj = compareObjects[id];

        if (!neededObj) {
          return setImmediate(help.bind(null, ++index));
        }
        const newPrice = neededObj.row.getCell(neededObj.priceCellNumber).value * coefficient;
        const oldPrice = newPrice * options.oldPriceCoefficient;
  
        const newCountText = neededObj.row.getCell(neededObj.countCellNumber).value;
        const newCount = (/\d+/).exec(newCountText) ? (/\d+/).exec(newCountText)[0] : 0;
  
        rowObj.row.getCell(rowObj.priceCellNumber).value = newPrice.toFixed(2);
        rowObj.row.getCell(rowObj.countCellNumber).value = newCount;
        rowObj.row.getCell(rowObj.oldPriceCellNumber).value = oldPrice.toFixed(2);
  
        setImmediate(help.bind(null, ++index));
      }

      help(0);
    });
  }
};

ExcelParser.files = {};

export default ExcelParser;