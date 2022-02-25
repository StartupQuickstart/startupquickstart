import React from 'react';
import { Link, useParams } from 'react-router-dom';

export function Error({ code = 404, message }) {
  const params = useParams();
  code = code || params.code;
  message =
    message ||
    {
      404: "The Page can't be found",
      401: 'Unauthorized',
      403: 'Forbidden'
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
          {code !== 401 && <Link to="/">Go To Dashboard</Link>}
          {code === 401 && <Link to="/login">Login</Link>}
        </div>
      </div>
    </>
  );
}
export default Error;
