import React from 'react';
import { Link, useParams } from 'react-router-dom';

export function Error(props) {
  const params = useParams();
  const code = props.code || params.code;
  const message =
    props.message ||
    {
      404: "The Page can't be found"
    }[code] ||
    'Unknown Error';

  return (
    <>
      <div id="error">
        <div className="error">
          <div className="error-code">
            <h1>Oops!</h1>
            <h2>
              {code} - {message}
            </h2>
          </div>
          <Link to="/">Go To Dashboard</Link>
        </div>
      </div>
    </>
  );
}

Error.defaultProps = {
  code: 404
};

export default Error;
