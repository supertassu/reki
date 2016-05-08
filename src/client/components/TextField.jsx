import React from 'react';
import { Input } from 'react-bootstrap';

export function getTextField() {
  function TextField({ value, label, property, onChange }) {

    let timer = 0;
    function handleValueChanged(event) {
      const newValue = event.target.value;

      clearTimeout(timer);
      timer = setTimeout(() => onChange(property, newValue), 400);
    }

    return (
        <Input type="text" label={ label } value={ value } onChange={ handleValueChanged }/>
    );
  }

  TextField.propTypes = {
    value: React.PropTypes.any,
    label: React.PropTypes.string.isRequired,
    property: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
  };

  return TextField;
}
