import React, {
  Fragment,
  useImperativeHandle,
  useState,
  useRef,
  useEffect
} from 'react';

import UpdateRecordButton from './UpdateRecordButton';
import { useApi } from '@/context/providers';
import DeleteRecordButton from './DeleteRecordButton';
import ViewRecordButton from './ViewRecordButton';
import CreateRecordButton from './CreateRecordButton';
import ReactBootstrapTableRemote from '../table/ReactBootstrapTableRemote';
import classNames from 'classnames';

export function Records({
  id,
  innerRef,
  actions,
  recordType,
  parent,
  pluralLabel = 'Records',
  singularLabel = 'Record',
  canCreate = true,
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
  tableProps,
  tableClassName,
  className,
  createForm
}) {
  const { Api } = useApi();
  const tableRef = useRef();
  const [_params, setParams] = useState();

  async function fetchData(query) {
    const { pageIndex, pageSize, search, sortBy } = query || {};

    if (!_params && isNaN(pageIndex)) {
      return;
    }

    const params = !query
      ? _params
      : {
          ...dataParams,
          [limitParamKey]: pageSize || 10,
          [offsetParamKey]: pageIndex * pageSize,
          page: pageIndex + 1,
          order:
            sortBy?.map((item) => [item.id, item.desc ? 'desc' : 'asc']) || []
        };

    setParams(params);

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

    return result;
  }

  useEffect(() => {
    tableRef.current?.fetchData();
  }, [dataParams]);

  useImperativeHandle(
    innerRef,
    () => ({
      fetchData: tableRef.current?.fetchData
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  columns = columns.map((column) => {
    if (column?.actions) {
      column.accessor = (record, index) => {
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
                    onClose={() => {
                      tableRef.current?.fetchData();
                    }}
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
                    onClose={() => tableRef.current?.fetchData()}
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
    <div id={id} className={classNames('records', className)}>
      <ReactBootstrapTableRemote
        id={recordType}
        className={tableClassName}
        innerRef={tableRef}
        columns={columns}
        pluralLabel={pluralLabel}
        fetchData={fetchData}
        actions={
          <div className="actions">
            {canCreate && (
              <CreateRecordButton
                className="float-end ms-2"
                onClose={() => tableRef.current?.fetchData()}
                singularLabel={singularLabel}
                recordType={recordType}
                createLink={createLink}
                canAddExisting={canCreate.canAddExisting}
                record={defaultRecord}
                parent={parent}
                createForm={createForm}
              />
            )}
            <div className="d-inline-block" style={{ lineHeight: '32px' }}>
              {actions && actions}
            </div>
          </div>
        }
        {...tableProps}
      />
    </div>
  );
}

Records.defaulProps = {
  tableProps: { striped: false, bordered: false, hover: false }
};

export default Records;
