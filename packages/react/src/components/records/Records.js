import React, {
  Fragment,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';
import MissingRecords from '@/components/common/MissingRecords';
import { Card } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';

import CreateRecordButton from './CreateRecordButton';
import UpdateRecordButton from './UpdateRecordButton';
import Search from '@/components/inputs/SearchInput';
import paginationFactory from 'react-bootstrap-table2-paginator';
import SizePerPage from './SizePerPage';
import { useApi } from '@/context/providers';
import classNames from 'classnames';
import { LoadingSmall } from '../common';
import DeleteRecordButton from './DeleteRecordButton';
import { ViewRecordButton } from '.';

export function Records({
  innerRef,
  actions,
  recordType,
  parent,
  pluralLabel = 'Records',
  singularLabel = 'Record',
  canCreate = true,
  canDelete = true,
  canAdd = true,
  showLabel = true,
  createLink,
  columns,
  dataParams = {},
  keyField = 'id',
  searchParamKey = 's',
  limitParamKey = 'limit',
  offsetParamKey = 'offset',
  orderParamKey = 'order',
  onRecords,
  onPagination,
  defaultRecord,
  classes
}) {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ limit: 10, offset: 0 });
  const { Api } = useApi();

  useEffect(() => {
    setData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, JSON.stringify(dataParams), search, parent?.id]);

  useEffect(() => {
    onPagination && onPagination(pagination);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  /**
   * Sets the data for the view
   */
  async function setData() {
    try {
      setLoading(true);
      const params = {
        ...dataParams,
        [limitParamKey]: pagination.limit,
        [offsetParamKey]: pagination.offset,
        page: pagination.offset / pagination.limit + 1
      };

      if (search?.length) {
        params[searchParamKey] = search;
      }

      let result;

      if (parent) {
        result = await Api.get(parent.type).related(
          parent.id,
          recordType,
          params,
          false
        );
      } else {
        result = await Api.get(recordType).index(params, false);
      }

      const { records, totalRecords } = result;
      setRecords(records);
      setTotalRecords(totalRecords);
      onRecords && onRecords({ records, totalRecords });
    } finally {
      setLoading(false);
    }
  }

  useImperativeHandle(
    innerRef,
    () => ({
      setData
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  columns = columns.map((column) => {
    if (column?.actions) {
      column.formatter = (e, record) => {
        return (
          <div>
            {column.actions.map((action, index) => {
              if (action === 'view') {
                return (
                  <ViewRecordButton
                    className="mx-1"
                    key={index}
                    recordType={recordType}
                    singularLabel={singularLabel}
                    pluralLabel={pluralLabel}
                    record={record}
                    iconOnly
                    asText
                  />
                );
              } else if (action === 'update') {
                return (
                  <UpdateRecordButton
                    className="mx-1"
                    key={index}
                    recordType={recordType}
                    singularLabel={singularLabel}
                    pluralLabel={pluralLabel}
                    record={record}
                    iconOnly
                    asText
                    onClose={setData}
                  />
                );
              } else if (action === 'delete') {
                return (
                  <DeleteRecordButton
                    className="mx-1"
                    key={index}
                    recordType={recordType}
                    singularLabel={singularLabel}
                    pluralLabel={pluralLabel}
                    parent={parent}
                    record={record}
                    iconOnly
                    asText
                    onClose={setData}
                  />
                );
              }

              return <Fragment key={index}>{action}</Fragment>;
            })}
          </div>
        );
      };
    }

    return column;
  });

  return (
    <>
      <div className="clearfix mb-2">
        {showLabel && <h3 className="float-start mb-0 me-3">{pluralLabel}</h3>}
        <Search onChange={setSearch} />
        {loading && <LoadingSmall />}
        {actions && <div className="float-end">{actions}</div>}
        {canCreate && (
          <CreateRecordButton
            className="float-end"
            onClose={setData}
            singularLabel={singularLabel}
            recordType={recordType}
            createLink={createLink}
            record={defaultRecord}
            parent={parent}
          />
        )}
      </div>
      <Card>
        <BootstrapTable
          remote
          keyField={keyField}
          wrapperClasses={'table-responsive'}
          classes={classNames('border-bottom', classes)}
          bordered={false}
          data={records}
          columns={columns}
          noDataIndication={() => (
            <MissingRecords
              title={`No ${pluralLabel} Found`}
              description={`Please try again later.`}
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

export default Records;
