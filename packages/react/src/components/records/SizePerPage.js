import { Dropdown } from 'react-bootstrap';

export function SizePerPage({ options, currSizePerPage, onSizePerPageChange }) {
  return (
    <Dropdown className="d-inline me-2">
      <Dropdown.Toggle variant="white" id="dropdown-basic">
        {currSizePerPage}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {options.map((option) => (
          <Dropdown.Item
            key={option.page}
            href="#"
            data-page={option.page}
            onMouseDown={(e) => {
              e.preventDefault();
              onSizePerPageChange(option.page);
            }}
          >
            {option.text}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SizePerPage;
