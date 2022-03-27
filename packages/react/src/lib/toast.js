import { toast } from 'react-toastify';

export class Toast {
  /**
   * Toast to show error message
   *
   * @param {String} message Error message to show
   */
  static error(
    message = 'Ooops something went wrong. Please try again.',
    options
  ) {
    this.template('error', message, options);
  }

  /**
   * Toast to show success message
   *
   * @param {String} message success message to show
   */
  static success(message, options) {
    this.template('success', message, options);
  }

  /**
   * Toast to show success message
   *
   * @param {String} message success message to show
   */
  static template(type, message, options) {
    const func = toast[type];
    func(
      message,
      Object.assign(
        {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        },
        options || {}
      )
    );
  }

  /**
   * Wraps toast promise
   * @param {Promise} promise Promise to wrap
   * @param {Object} options Options to pass to toast
   */
  static promise(promise, options) {
    return toast.promise(promise, options);
  }
}

export default Toast;
