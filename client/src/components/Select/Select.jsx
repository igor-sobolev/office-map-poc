import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import styles from './Select.module.scss';

const Select = ({
  onChange,
  options,
  placeholder,
  value,
  valueKey,
  labelKey,
}) => {
  const [state, setState] = useState(value);

  useEffect(() => {
    setState(value);
  }, [value]);

  const onChangeHandler = useCallback(
    (e) => {
      const selected = e.target.value;
      setState(selected);
      const selectedOption = options.find(
        (option) => selected === option[valueKey]
      );
      onChange && onChange(selectedOption);
    },
    [options]
  );

  return (
    <select className={styles.select} value={state} onChange={onChangeHandler}>
      {placeholder && <option>{placeholder}</option>}
      {options.map((option) => (
        <option key={option[valueKey]} value={option[valueKey]}>
          {option[labelKey]}
        </option>
      ))}
    </select>
  );
};

Select.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
};

Select.defaultProps = {
  valueKey: 'name',
  labelKey: 'name',
};

export default Select;
