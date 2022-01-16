export function DataField({ label, value }) {
  return (
    <tr>
      <td className="align-text-top text-end pe-4 pb-3">
        <b>{label}:</b>
      </td>
      <td className="align-text-top">{value}</td>
    </tr>
  );
}

export default DataField;
