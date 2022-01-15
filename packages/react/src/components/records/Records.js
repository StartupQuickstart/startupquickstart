import React, { useEffect, useState } from 'react';
import MissingRecords from 'components/common/MissingRecords';
import { Card } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';

import LoadingOverlay from 'components/common/LoadingOverlay';
import Toast from 'lib/toast';
import CreateRecordButton from './CreateRecordButton';
import Search from 'components/inputs/Search';
import { debounce } from 'throttle-debounce';
import paginationFactory from 'react-bootstrap-table2-paginator';
import SizePerPage from './SizePerPage';
import { useApi } from 'context/providers';

export function Records({
  recordType,
  pluralLabel,
  singularLabel,
  canCreate,
  createLink,
  columns
}) {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ limit: 10, offset: 0 });
  const { Api } = useApi;

  useEffect(() => {
    setData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setDataDebounce();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    setData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  /**
   * Sets the data for the view
   */
  async function setData() {
    try {
      setLoading(true);
      const params = { ...pagination };

      if (search?.length) {
        params.s = search;
      }

      const { records, totalRecords } = await Api.get(recordType).index(
        params,
        false
      );
      setRecords(records);
      setTotalRecords(totalRecords);
    } catch (err) {
      Toast.error(`Failed to retrieve ${recordType.split('/').join(' ')}.`);
    } finally {
      setLoading(false);
    }
  }

  const setDataDebounce = debounce(500, setData);

  return (
    <>
      <div className="clearfix mb-2">
        <h3 className="float-start mb-0">{pluralLabel}</h3>
        <Search className="ms-3" onChange={setSearch} />
        {canCreate && (
          <CreateRecordButton
            className="float-end"
            onClose={setData}
            singularLabel={singularLabel}
            recordType={recordType}
            createLink={createLink}
          />
        )}
      </div>
      <Card>
        {loading && <LoadingOverlay />}
        <BootstrapTable
          remote
          keyField={'id'}
          wrapperClasses={'table-responsive'}
          className="table-bordered table-sm"
          data={records}
          columns={columns}
          noDataIndication={() => (
            <MissingRecords
              title={`No ${pluralLabel} Found`}
              description={`Could not find any ${pluralLabel.toLowerCase()}`}
            />
          )}
          onTableChange={() => {}}
          pagination={paginationFactory({
            totalSize: totalRecords,
            sizePerPage: pagination.limit,
            showTotal: true,
            sizePerPageRenderer: SizePerPage,
            paginationTotalRenderer: (from, to, size) => (
              <span className="react-bootstrap-table-pagination-total">
                Showing {from} to {to} of {size} {pluralLabel}
              </span>
            ),
            onSizePerPageChange: (sizePerPage, page) => {
              setPagination({
                limit: sizePerPage,
                offset: (page - 1) * sizePerPage
              });
            },
            onPageChange: (page, sizePerPage) => {
              setPagination({
                limit: sizePerPage,
                offset: (page - 1) * sizePerPage
              });
            }
          })}
        />
      </Card>
    </>
  );
}

Records.defaultProps = {
  singularLabel: 'Record',
  pluralLabel: 'Records',
  canCreate: true,
  canDelete: true
};

export default Records;
