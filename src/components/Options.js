import React, { useState, useCallback } from 'react';
import { TextInput, Checkbox, View } from 'react-desktop/macOs';
import { object, func } from 'prop-types';

const Options = ({ options, setOptions }) => {
  const [show, setShow] = useState(false);

  const changeValue = useCallback((e, block, key) => {
    const { target: { value } } = e;
    setOptions((currentObj) => {
      const copy = Object.assign({}, currentObj);
      copy[block][key] = { ...copy[block][key], value };
      return copy;
    });
  }, [setOptions]);

  return (
    <div className="options">
      <Checkbox
        label="Налаштування"
        onChange={() => setShow((value) => !value)}
        defaultChecked={show}
      />
      { show && (
        <View>
          <div className="flex">
            {
              Object.entries(options.main).map(([key, option]) => (
                <TextInput
                  key={key}
                  label={option.name}
                  placeholder={option.name}
                  value={option.value}
                  marginBottom="10px"
                  onChange={(e) => changeValue(e, 'main', key)}
                />
              ))
            }
          </div>
          <div className="flex">
            {
              Object.entries(options.compare).map(([key, option]) => (
                <TextInput
                  key={key}
                  label={option.name}
                  placeholder={option.name}
                  value={option.value}
                  marginBottom="10px"
                  onChange={(e) => changeValue(e, 'compare', key)}
                />
              ))
            }
          </div>
        </View>
      )}
    </div>
  );
};

Options.propTypes = {
  options: object.isRequired,
  setOptions: func.isRequired,
};

export default Options;