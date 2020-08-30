import React, { useRef, useEffect, useCallback } from 'react';
import { Box, Text } from 'react-desktop/macOs';
const { dialog } = require('electron').remote;
import { string, func } from 'prop-types';
import '../styles/SelectFile.css';

const SelectFile = ({ text, selectedFilePath, onSelect }) => {
  const dropHandler = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(e.dataTransfer.files[0]);
    onSelect(e.dataTransfer.files[0].path);
  }, [onSelect]);

  const dragOverHandler = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const openSelectFileDialog = useCallback(async () => {
		const result = await dialog.showOpenDialog({
			properties: ['openFile'],
			filters: [{ name: 'Excel', extensions: ['xlsx'] }]
    });
    if (result.filePaths.length) {
      console.log(result.filePaths[0]);
      onSelect(result.filePaths[0]);
    }
	}, []);

  useEffect(() => {
    const blockEl = blockRef.current;
		blockEl.addEventListener('drop', dropHandler);
		blockEl.addEventListener('dragover', dragOverHandler);
		return () => {
      blockEl.removeEventListener('drop', dropHandler);
		  blockEl.removeEventListener('dragover', dragOverHandler);
		};
	}, [blockRef, dropHandler, dragOverHandler]);

  const blockRef = useRef(null);

  return (
    <div className="flex hover-effect" ref={blockRef} onClick={openSelectFileDialog}>
      <Box className={selectedFilePath ? 'success pointer' : 'pointer'} horizontalAlignment="center" verticalAlignment="center" style={{ display: 'flex' }}>
        <Text>{selectedFilePath ? selectedFilePath : text}</Text>
      </Box>
    </div>
  );
};

SelectFile.propTypes = {
  text: string,
  selectedFilePath: string,
  onSelect: func,
};

SelectFile.defaultProps = {
  text: '',
  selectedFilePath: '',
  onSelect: () => {},
};

export default SelectFile;