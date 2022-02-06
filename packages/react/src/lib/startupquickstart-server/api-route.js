import axios from 'axios';

import {
  cacheAdapterEnhancer,
  throttleAdapterEnhancer
} from 'axios-extensions';

export class ApiRoute {
  constructor(route, Auth, cache = true, throttle = true) {
    this.route = route;
    this.Auth = Auth;

    let adapter = axios.defaults.adapter;

    if (cache) {
      adapter = cacheAdapterEnhancer(adapter);
    }

    if (throttle) {
      adapter = throttleAdapterEnhancer(adapter);
    }

    const config = {
      baseURL: `/api/v1/${this.route}/`
    };

    config.adapter = this.Auth?.axiosAdapter
      ? this.Auth.axiosAdapter(adapter)
      : adapter;
    this.v1 = axios.create(config);
  }

  /**
   * Performs an action on a record
   */
  action = async (id, action, data) => {
    const res = await this.v1.post(`${id}/actions/${action}`, data);
    return res.data;
  };

  /**
   * Gets the meta data for an object
   */
  describe = async (id, action, data) => {
    const res = await this.v1.get('describe', data);
    return res.data;
  };

  /**
   * Adds related records
   *
   * @param {String} id Id of the parent record
   * @param {String} relatedType Type of related object
   * @param {Object} related Record to add. Should only contain an id if associating exisitng record
   *
   */
  addRelated = async (id, relatedType, related) => {
    const res = await this.v1.post(`${id}/related/${relatedType}`, related);
    return res.data;
  };

  /**
   * Removes related records
   *
   * @param {String} id Id of the parent record
   * @param {String} relatedType Type of related object
   * @param {Object} recordId Record id to remove.
   *
   */
  removeRelated = async (id, relatedType, relatedId) => {
    const res = await this.v1.delete(
      `${id}/related/${relatedType}/${relatedId}`
    );
    return res.data;
  };

  /**
   * Gets realted records
   */
  related = async (id, related, params = {}, cache = true) => {
    const res = await this.v1.get(`${id}/related/${related}`, {
      params,
      cache
    });
    return res.data;
  };

  /**
   * Gets the count of records
   */
  count = async () => {
    const res = await this.v1.get('count');
    return res.data;
  };

  /**
   * Creates a reccord
   *
   * @param {Object} record Record to create
   */
  create = async (record) => {
    const res = await this.v1.post('', record);
    return res.data;
  };

  /**
   * Deletes a record
   *
   * @param {String} id Id of the record
   */
  delete = async (id) => {
    const res = await this.v1.delete(id);
    return res.data;
  };

  /**
   * Gets an index of records
   *
   * @param {Object} params Params to send
   * @param {Boolean} cache Whether or not to cache the query
   */
  index = async (params, cache = true) => {
    const res = await this.v1.get('', { params, cache });
    return res.data;
  };

  /**
   * Gets a record by its id
   *
   * @param {String} id Id of the record
   * @param {Object} params Params to send
   * @param {Boolean} cache Whether or not to cache the query
   */
  read = async (id, params = {}, cache = true) => {
    const res = await this.v1.get(id, { params, cache });
    return res.data;
  };

  /**
   * Updates a record by its id
   *
   * @param {String} id Id of the record
   * @param {Object} updates Data to update record with
   */
  update = async (id, updates) => {
    const res = await this.v1.put(id, updates);
    return res.data;
  };
}

export default ApiRoute;
