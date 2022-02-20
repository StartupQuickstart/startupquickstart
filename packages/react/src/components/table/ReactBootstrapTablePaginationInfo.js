import React, { useMemo } from 'react';

export function ReactBootstrapTablePaginationInfo({
  count,
  pageSize,
  pageIndex,
  pluralLabel = ''
}) {
  const { from, to } = useMemo(() => {
    if (!count) {
      return { from: 0, to: 0 };
    }

    const from = pageSize * pageIndex + 1;
    const to = Math.min(parseInt(from) + parseInt(pageSize) - 1, count);
    return { from, to };
  }, [count, pageIndex, pageSize]);

  return (
    <span className="dataTables_info float-start">
      Showing {from} to {to} of {count || 0} {pluralLabel}
    </span>
  );
}

export default ReactBootstrapTablePaginationInfo;
