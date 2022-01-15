import axios from 'axios';

import {
  cacheAdapterEnhancer,
  throttleAdapterEnhancer
} from 'axios-extensions';

export default class ApiRoute {
  constructor(route, Auth, cache = true, throttle = true) {
    this.route = route;

    let adapter = axios.defaults.adapter;

    if (cache) {
      adapter = cacheAdapterEnhancer(adapter);
    }

    if (throttle) {
      adapter = throttleAdapterEnhancer(adapter);
    }

    this.v1 = axios.create({
      baseURL: `/api/v1/${this.route}/`,
      adapter: this.Auth.axiosAdapter(adapter)
    });
  }

  /**
   * Performs an action on a record
   */
  action = async (id, action, data) => {
    return [];
  };

  /**
   * Gets the meta data for an object
   */
  describe = async (id, action, data) => {
    return { columns: [] };
  };

  /**
   * Gets realted records
   */
  related = async (id, related, params = {}, cache = true) => {
    return { records: [], totalRecords: 0 };
  };

  /**
   * Gets the count of records
   */
  count = async () => {
    return 0;
  };

  /**
   * Creates a reccord
   *
   * @param {Object} record Record to create
   */
  create = async (record) => {
    return record;
  };

  /**
   * Deletes a record
   *
   * @param {String} id Id of the record
   */
  delete = async (id) => {
    return { success: true };
  };

  /**
   * Gets an index of records
   *
   * @param {Object} params Params to send
   * @param {Boolean} cache Whether or not to cache the query
   */
  index = async (params, cache = true) => {
    return { records: [], totalRecords: 0 };
  };

  /**
   * Gets a record by its id
   *
   * @param {String} id Id of the record
   * @param {Object} params Params to send
   * @param {Boolean} cache Whether or not to cache the query
   */
  read = async (id, params = {}, cache = true) => {
    return { id };
  };

  /**
   * Updates a record by its id
   *
   * @param {String} id Id of the record
   * @param {Object} updates Data to update record with
   */
  update = async (id, updates) => {
    return { id, ...updates };
  };
}
