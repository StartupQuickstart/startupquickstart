import classNames from 'classnames';
import React, { useState, useMemo } from 'react';
import { Card, Table } from 'react-bootstrap';
import { useTable, usePagination, useSortBy } from 'react-table';
import MissingRecords from '../common/MissingRecords';
import ReactBootstrapTablePagination from './ReactBootstrapTablePagination';
import Search from '@/components/inputs/SearchInput';
import { ArrowDown, ArrowUp } from 'react-feather';
import { Loading } from '@/components/common';

export function ReactBootstrapTable({
  id,
  columns,
  loading,
  fetchData,
  data,
  count,
  defaultPageSize = 10,
  defaultPageIndex = 0,
  defaultSearch = '',
  defaultSortBy = [],
  defaultSelectedRowIds = [],
  nPageOptions = 6,
  pageSizeOptions = [5, 10, 25, 50, 100],
  striped,
  bordered,
  hover,
  size = 'sm',
  showSearch = true,
  showLabel = true,
  pluralLabel = 'Records',
  className,
  actions,
  error
}) {
  const [search, setSearch] = useState(defaultSearch);
  defaultPageSize = defaultPageSize || pageSizeOptions[0];

  const tableColumns = useMemo(() => {
    return columns;
  }, [columns]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize, sortBy, selectedRowIds }
  } = useTable(
    {
      columns: tableColumns,
      data,
      initialState: {
        pageIndex: defaultPageIndex,
        pageSize: defaultPageSize,
        sortBy: defaultSortBy,
        selectedRowIds: defaultSelectedRowIds
      }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      manualSortBy: true,
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: Math.ceil(count / defaultPageSize)
    },
    useSortBy,
    usePagination
  );

  // Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(() => {
    fetchData({ pageIndex, pageSize, search, sortBy, selectedRowIds });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify({ pageIndex, pageSize, search, sortBy, selectedRowIds })]);

  return (
    <div id={id} className={classNames('mb-5', className)}>
      <div className="clearfix mb-2">
        {showLabel && <h3 className="float-start mb-0 me-3">{pluralLabel}</h3>}
        {showSearch && (
          <Search onChange={setSearch} defaultValue={defaultSearch} />
        )}
        {actions && <div className="float-end">{actions}</div>}
      </div>
      <Card>
        <Table
          striped={striped}
          bordered={bordered}
          hover={hover}
          size={size}
          className={'mb-0'}
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  return (
                    <th {...column.getHeaderProps()} style={column.headerStyle}>
                      <span {...column.getSortByToggleProps()}>
                        {column.render('Header')}
                        {column.canSort && (
                          <>
                            {!column.isSorted && (
                              <>
                                <ArrowDown className="sort-desc" />
                                <ArrowUp className="sort-asc" />
                              </>
                            )}
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <ArrowDown className="sort-desc" />
                              ) : (
                                <ArrowUp className="sort-asc" />
                              )
                            ) : (
                              ''
                            )}
                          </>
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} style={cell?.column?.style}>
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
        {loading && (
          <Card.Body className="border-bottom">
            <Loading />
          </Card.Body>
        )}
        {!loading && !page.length && !error && (
          <Card.Body className="border-bottom">
            <MissingRecords
              title={`No ${pluralLabel} Found`}
              description={`Please try again later.`}
            />
          </Card.Body>
        )}
        {!loading && !page.length && error && (
          <Card.Body className="border-bottom">
            <MissingRecords
              variant="danger"
              title={`Failed to retrieve ${pluralLabel}.`}
              description={`Please try again later.`}
            />
          </Card.Body>
        )}
        <ReactBootstrapTablePagination
          count={count}
          pageSize={pageSize}
          pageCount={pageCount}
          pageOptions={pageOptions}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          gotoPage={gotoPage}
          nextPage={nextPage}
          previousPage={previousPage}
          nPageOptions={nPageOptions}
          pageSizeOptions={pageSizeOptions}
          pluralLabel={pluralLabel}
        />
      </Card>
    </div>
  );
}

export default ReactBootstrapTable;
