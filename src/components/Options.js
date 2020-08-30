import React, { useState, useCallback } from 'react';
import { TextInput, Checkbox, View, SegmentedControl, SegmentedControlItem } from 'react-desktop/macOs';
import { object, func } from 'prop-types';

const Options = ({ options, setOptions }) => {
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  const changeValue = useCallback((e, block, key) => {
    const { target: { value } } = e;
    setOptions((currentObj) => {
      const copy = Object.assign({}, currentObj);
      copy[block][key] = { ...copy[block][key], value };
      return copy;
    });
  }, [setOptions]);

  const mainOptions = (
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
  );

  const additionalOptions = (
    <View>
      <div className="flex">
        {
          Object.entries(options.additional).map(([key, option]) => (
            <TextInput
              key={key}
              label={option.name}
              placeholder={option.name}
              value={option.value}
              marginBottom="10px"
              onChange={(e) => changeValue(e, 'additional', key)}
            />
          ))
        }
      </div>
    </View>
  );

  return (
    <div className="options">
      <Checkbox
        label="Налаштування"
        onChange={() => setShow((value) => !value)}
        defaultChecked={show}
      />
      { show && (
        <SegmentedControl box>
          <SegmentedControlItem
            key={1}
            title="Основні"
            selected={activeTab === 1}
            onSelect={() => {setActiveTab(1)}}
          >
            {mainOptions}
          </SegmentedControlItem>
          <SegmentedControlItem
            key={2}
            title="Додаткові"
            selected={activeTab === 2}
            onSelect={() => {setActiveTab(2)}}
          >
            {additionalOptions}
          </SegmentedControlItem>
        </SegmentedControl>
      )}
    </div>
  );
};

Options.propTypes = {
  options: object.isRequired,
  setOptions: func.isRequired,
};

export default Options;