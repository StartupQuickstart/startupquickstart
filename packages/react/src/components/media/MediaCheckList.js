import React, { useEffect, useState } from 'react';
import MissingRecords from 'components/common/MissingRecords';
import { Card } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { FileIcon, defaultStyles } from 'react-file-icon';
import Moment from 'react-moment';
import LoadingOverlay from 'components/common/LoadingOverlay';
import { Toast } from 'lib';
import { useApi } from 'context/providers';

export function MediaCheckList({
  defaultSelected,
  onChange,
  parent,
  relatedToId
}) {
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(defaultSelected || []);
  const [records, setRecords] = useState([]);
  const { Api } = useApi();

  useEffect(() => {
    setData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Handles single media selection
   *
   * @param {Boolean} isSelect Selection state
   * @param {Array} media Media object being selected
   */
  function onSelect(isSelect, media) {
    let _selected = [...selected];

    for (const m of media) {
      if (isSelect && !_selected.includes(m.id)) {
        _selected.push(m.id);
      } else if (!isSelect && _selected.includes(m.id)) {
        const index = _selected.indexOf(m.id);
        _selected.splice(index, 1);
      }
    }

    onChange && onChange(_selected);
    setSelected(_selected);
  }

  /**
   * Sets teh data for the view
   */
  async function setData() {
    try {
      const { records } = await Api.get(parent).related(
        relatedToId,
        'media',
        {},
        false
      );

      setRecords(records);
    } catch (err) {
      if (err?.response?.data?.message) {
        Toast.error(err.response.data.message);
      } else {
        Toast.error('Failed to get media.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }

  let index = 0;
  const _records = (records || []).map((record) => {
    if (record.type.startsWith('image/') || record.type.startsWith('video/')) {
      record.index = index++;
    }

    return record;
  });

  return (
    <Card className="mb-0">
      {loading && <LoadingOverlay />}
      <BootstrapTable
        keyField={'id'}
        data={_records}
        selectRow={{
          selected,
          mode: 'checkbox',
          onSelectAll: onSelect,
          onSelect: (media, isSelect) => onSelect(isSelect, [media]),
          selectionRenderer: ({ mode, checked, disabled }) => {
            return (
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={!!checked}
                  onChange={() => {}}
                />
                <label className="form-check-label" />
              </div>
            );
          },
          selectionHeaderRenderer: ({ mode, checked, disabled }) => {
            return (
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={!!checked}
                  onChange={() => {}}
                />
                <label className="form-check-label" />
              </div>
            );
          }
        }}
        columns={[
          {
            dataField: 'name',
            text: 'File',
            width: 'auto',
            formatter: (name) => {
              const ext = name.split('.').pop();
              return (
                <div>
                  <div
                    className="d-inline-block me-4"
                    style={{ width: '20px' }}
                  >
                    <FileIcon extension={ext} {...defaultStyles[ext]} />
                  </div>
                  {name}
                </div>
              );
            }
          },
          {
            dataField: 'created_at',
            text: 'Uploaded At',
            formatter: (createdAt, media) => {
              return <Moment format={'lll'}>{createdAt}</Moment>;
            }
          }
        ]}
        noDataIndication={() => (
          <MissingRecords
            title="No Media Found"
            description={`Could not find any records`}
          />
        )}
      />
    </Card>
  );
}
