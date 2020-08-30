import React, { useState } from 'react'
import { Button, View } from 'react-desktop/macOs';
import "@babel/polyfill";
import ExcelParser from '../excelParser/ExcelParser';
import SelectFile from './SelectFile';
import Options from './Options';
import Loader from './Loader';
const { dialog } = require('electron').remote;
import '../styles/App.css';

const generateOptions = (acc, obj) => {
	const [key, el] = obj;
	acc[key] = el.value;
	return acc;
};

const App = () => {
	const [firstFileName, setFirstFileName] = useState('');
	const [secondFileName, setSecondFileName] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [options, setOptions] = useState({
		main: {
			idField: {
				name: 'Артикул',
				value: 'Артикул'
			},
			priceField: {
				name: 'Ціна',
				value: 'Цена'
			},
			countField: {
				name: 'Кількість',
				value: 'Остатки'
			},
			oldPrice: {
				name: 'Стара ціна',
				value: 'Старая Цена'
			},
		},
		compare: {
			idField: {
				name: 'Артикул',
				value: ''
			},
			priceField: {
				name: 'Ціна',
				value: ''
			},
			countField: {
				name: 'Кількість',
				value: ''
			},
		},
		additional: {
			coefficient: {
				name: 'Коефіцієнт',
				value: '1.6'
			},
			oldPriceCoefficient: {
				name: 'Коефіцієнт старої ціни',
				value: '1.3'
			}
		}
	});

	const changeExcel = async (mainFilename, compareFilename, options) => {
		try {
			const { mainFileOptions, compareFileOptions, additionalOptions } = options
			const xlsxObjectMain = await ExcelParser.parse(mainFilename, mainFileOptions);
			console.log('xlsxObjectMain: ', xlsxObjectMain);
			const xlsxObjectForComparing = await ExcelParser.parse(compareFilename, compareFileOptions);
			console.log('xlsxObjectForComparing: ', xlsxObjectForComparing);
			const updatedWorkbook = ExcelParser.compareAndChange(xlsxObjectMain, xlsxObjectForComparing, additionalOptions);
			const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
			if (result.filePaths.length) {
				updatedWorkbook.xlsx.writeFile(`${result.filePaths[0]}/new.xlsx`);
			}
		} catch(e) {
			console.log(e);
		}
	};

	const checkForUpdates = async () => {
		try {
			setIsLoading(true);
			const mainFileOptions = Object.entries(options.main).reduce(generateOptions, {});
			const compareFileOptions = Object.entries(options.compare).reduce(generateOptions, {});
			const additionalOptions = Object.entries(options.additional).reduce(generateOptions, {});
			const allOptions = {
				mainFileOptions,
				compareFileOptions,
				additionalOptions
			};
			await changeExcel(firstFileName, secondFileName, allOptions);
		} catch(e) {
			console.log(e);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <Loader />
	}

	return (
		<div>
			<View layout="vertical" style={{ height: '90vh' }}>
				<View marginBottom="10px" style={{ flexGrow: '1' }}>
					<SelectFile text="Основний файл" selectedFilePath={firstFileName} onSelect={setFirstFileName} />
					<SelectFile text="Файл для порівняння" selectedFilePath={secondFileName} onSelect={setSecondFileName} />
				</View>
				<Options options={options} setOptions={setOptions}/>
			</View>
			<View horizontalAlignment="center" verticalAlignment="center" style={{ height: '10vh' }}>
				<Button color="blue" onClick={checkForUpdates}>
					Згенерувати
				</Button>
			</View>
		</div>
	)
}

export default App
