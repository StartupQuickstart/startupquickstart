import React, { useState, useRef, useContext } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import Avatar from 'components/common/Avatar';
import { useApi } from 'context/providers';
import _ from 'lodash';

export function RecordTypeahead({
  value,
  recordType,
  limit,
  onLoad,
  onChange,
  clearOnChange,
  name,
  id,
  onBlur,
  placeholder,
  ...props
}) {
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);
  const ref = useRef();
  const { Api } = useApi();

  useContext(() => {
    setData();
  }, []);

  useContext(() => {
    setSelected(getRecordById(value));
  }, [value]);

  /**
   * Sets the data for the typeahead
   */
  async function setData() {
    const { records } = await Api.get(recordType).index();
    const selected = getRecordById(value);
    setSelected(selected);
    setRecords(records);
    onLoad && onLoad({ records, selected });
  }

  /**
   * Gets a record by its id
   *
   * @param {String} recordId Id of the record
   */
  function getRecordById(recordId) {
    return _.find(records, (record) => record.id === recordId);
  }

  /**
   * Handles change events
   *
   * @param {Array} records List of selected records
   */
  function handleChange(records) {
    const record = _.last(records);
    onChange && onChange(record);

    if (clearOnChange && ref?.current?.clear) {
      ref.current.clear();
    } else {
      setSelected(record);
    }
  }

  return (
    <Typeahead
      {...props}
      clearButton
      renderMenuItemChildren={(option, props, index) => {
        const label = props.labelKey(option);
        return (
          <span>
            {option.image !== undefined && (
              <Avatar name={label} src={option.image} className="me-2" />
            )}{' '}
            {label}
          </span>
        );
      }}
      inputProps={{ id, name }}
      labelKey={(record) => record.label || record.name || 'Unknown'}
      className="typehead"
      onChange={handleChange}
      options={records}
      onBlur={onBlur}
      placeholder={placeholder}
      value={selected}
      ref={ref}
    />
  );
}

RecordTypeahead.defaultProps = {
  placeholder: 'Select Record',
  id: null
};
