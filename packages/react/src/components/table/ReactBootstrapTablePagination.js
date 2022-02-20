import React, { useMemo } from 'react';
import { Card, Pagination } from 'react-bootstrap';
import ReactBootstrapTablePaginationInfo from './ReactBootstrapTablePaginationInfo';

export function ReactBootstrapTablePagination({
  count,
  pageSize,
  pageCount,
  pageIndex,
  pageOptions,
  setPageSize,
  gotoPage,
  canPreviousPage,
  canNextPage,
  nextPage,
  previousPage,
  nPageOptions = 6,
  pageSizeOptions = [5, 10, 25, 50, 100],
  pluralLabel = ''
}) {
  const shownPageOptions = useMemo(() => {
    const half = Math.floor(nPageOptions / 2);
    let start = pageIndex - half;
    let end = pageIndex + half;

    const endCount = Math.min(end, pageCount - 1) - pageIndex;
    const startCount = pageIndex - Math.max(start, 0);

    if (startCount < half) {
      const diff = half - startCount;
      end += diff;
      start += diff;
    } else if (endCount < half) {
      const diff = half - endCount;
      start -= diff;
      end -= diff;
    }

    return pageOptions.filter(
      (pageOption) => start <= pageOption && pageOption <= end
    );
  }, [nPageOptions, pageCount, pageIndex, pageOptions]);

  return (
    <Card.Footer className="p-2">
      <div
        className="dataTables_length"
        id="datatables-column-search-select-inputs_length"
      >
        <select
          name="datatables-column-search-select-inputs_length"
          className="form-select float-start me-2 w-auto"
          onChange={(e) => setPageSize(e.target.value)}
          value={pageSize}
        >
          {pageSizeOptions.map((pageSizeOption) => (
            <option key={pageSizeOption} value={pageSizeOption}>
              {pageSizeOption}
            </option>
          ))}
        </select>
      </div>
      <ReactBootstrapTablePaginationInfo
        count={count}
        pageSize={pageSize}
        pageIndex={pageIndex}
        pluralLabel={pluralLabel}
      />
      {pageOptions.length > 0 && (
        <Pagination className="float-end mb-0">
          <Pagination.First
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          />
          <Pagination.Prev
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          />
          {shownPageOptions.map((pageOption) => {
            return (
              <Pagination.Item
                key={`page-option-${pageOption}`}
                active={pageIndex === pageOption}
                onClick={() => gotoPage(pageOption)}
              >
                {pageOption + 1}
              </Pagination.Item>
            );
          })}
          <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage} />
          <Pagination.Last
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          />
        </Pagination>
      )}
    </Card.Footer>
  );
}

export default ReactBootstrapTablePagination;
