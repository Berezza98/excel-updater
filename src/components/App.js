import React, { useState, useCallback } from 'react'
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
	const [firstFileOptions, setFirstFileOptions] = useState([]);
	const [secondFileOptions, setSecondFileOptions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [loadingFirstFile, setLoadingFirstFile] = useState(false);
	const [loadingSecondFile, setLoadingSecondFile] = useState(false);
	const [loadingPersentage, setloadingPersentage] = useState('');
	const [options, setOptions] = useState({
		main: {
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
			oldPrice: {
				name: 'Стара ціна',
				value: ''
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

	const selectFirstFile = useCallback(async (value) => {
		setFirstFileName(value);
		const columnNames = await ExcelParser.getColumnNames(value, setLoadingFirstFile);
		setFirstFileOptions(['', ...columnNames]);
	}, [ExcelParser, setFirstFileName]);

	const selectSecondFile = useCallback(async (value) => {
		setSecondFileName(value);
		const columnNames = await ExcelParser.getColumnNames(value, setLoadingSecondFile);
		setSecondFileOptions(['', ...columnNames]);
	}, [ExcelParser, setSecondFileOptions]);

	const changeExcel = async (mainFilename, compareFilename, options) => {
		try {
			const { mainFileOptions, compareFileOptions, additionalOptions } = options
			const xlsxObjectMain = await ExcelParser.parse(mainFilename, mainFileOptions, setloadingPersentage);
			console.log('xlsxObjectMain: ', xlsxObjectMain);
			const xlsxObjectForComparing = await ExcelParser.parse(compareFilename, compareFileOptions, setloadingPersentage);
			console.log('xlsxObjectForComparing: ', xlsxObjectForComparing);
			const updatedWorkbook = await ExcelParser.compareAndChange(xlsxObjectMain, xlsxObjectForComparing, additionalOptions, setloadingPersentage);
			const path = await dialog.showOpenDialog({ properties: ['openDirectory'] });
			if (path.filePaths.length) {
				updatedWorkbook.xlsx.writeFile(`${path.filePaths[0]}/new.xlsx`);
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
			console.log('DONE');
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <Loader loadingPersentage={loadingPersentage} />
	}

	return (
		<div>
			<View layout="vertical" style={{ height: '90vh' }}>
				<View marginBottom="10px" style={{ flexGrow: '1' }}>
					<SelectFile text="Основний файл" selectedFilePath={firstFileName} isLoading={loadingFirstFile} onSelect={selectFirstFile} />
					<SelectFile text="Файл для порівняння" selectedFilePath={secondFileName} isLoading={loadingSecondFile} onSelect={selectSecondFile} />
				</View>
				<Options options={options} columnNames={{ firstFileOptions, secondFileOptions }} setOptions={setOptions}/>
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
