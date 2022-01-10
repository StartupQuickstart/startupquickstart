import { toast } from 'react-toastify';

export class Toast {
  /**
   * Toast to show error message
   *
   * @param {String} message Error message to show
   */
  static error(message = 'Ooops something went wrong. Please try again.') {
    toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
  }

  /**
   * Toast to show success message
   *
   * @param {String} message success message to show
   */
  static success(message) {
    toast.success(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
  }
}

export default Toast;
