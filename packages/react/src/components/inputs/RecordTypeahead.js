import React, { useState, useRef, useEffect } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import Avatar from '@/components/common/Avatar';
import { useApi } from '@/context/providers';
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
  placeholder = 'Select Record',
  className,
  isInvalid,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);
  const ref = useRef();
  const { Api } = useApi();

  const handleSearch = async (s, filter) => {
    setIsLoading(true);
    const query = {
      limit: 50
    };

    if (s) {
      query.search = s;
    }

    if (filter) {
      query.filter = filter;
    }

    const { records } = await Api.get(recordType).index(query);

    setRecords(records);
    setIsLoading(false);
    return records;
  };

  useEffect(() => {
    const filter = value && { id: value };
    handleSearch(null, filter).then((records) => {
      const record = getRecordById(value, records);
      setSelected(record);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (records && records.length) {
      const record = getRecordById(value, records);
      setSelected(record);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  /**
   * Gets a record by its id
   *
   * @param {String} recordId Id of the record
   */
  function getRecordById(recordId, records = []) {
    return _.find(records, (record) => record.id === recordId);
  }

  /**
   * Handles change events
   *
   * @param {Array} recorvaluesds List of selected records
   */
  function handleChange(values) {
    const newValue = _.last(values);
    onChange && onChange(newValue);

    if (clearOnChange && ref?.current?.clear) {
      ref.current.clear();
    } else {
      setSelected(newValue);
    }
  }

  // Bypass client-side filtering by returning `true`. Results are already
  // filtered by the search endpoint, so no need to do it again.
  const filterBy = () => true;

  return (
    <AsyncTypeahead
      {...props}
      isInvalid={isInvalid === 'true'}
      id={id}
      name={name}
      filterBy={filterBy}
      isLoading={isLoading}
      onSearch={handleSearch}
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
      inputProps={{ id, name, className }}
      labelKey={(record) => record.label || record.name || 'Unknown'}
      className="typehead"
      onChange={handleChange}
      options={records}
      onBlur={onBlur}
      placeholder={placeholder}
      selected={(selected && [selected]) || []}
      ref={ref}
    />
  );
}
