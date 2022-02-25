import axios from 'axios';

export class ApiRoute {
  constructor(route, Auth, options = {}) {
    this.route = route;
    this.Auth = Auth;
    this.options = Object.assign(
      { relatedPathPrefix: '/related', version: 'v1' },
      options
    );

    let adapter = axios.defaults.adapter;

    const config = {
      baseURL: `/api/${this.options.version}/${this.route}/`
    };

    config.adapter = this.Auth?.axiosAdapter
      ? this.Auth.axiosAdapter(adapter)
      : adapter;

    this.axios = axios.create(config);
  }

  /**
   * Performs an action on a record
   */
  action = async (id, action, data) => {
    const res = await this.axios.post(`${id}/actions/${action}`, data);
    return res.data;
  };

  /**
   * Gets the meta data for an object
   */
  describe = async (id, action, data) => {
    const res = await this.axios.get('describe', data);
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
    const res = await this.axios.post(
      this.getRelatedPath(id, relatedType),
      related
    );
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
    const res = await this.axios.delete(
      this.getRelatedPath(id, `${relatedType}/${relatedId}`)
    );
    return res.data;
  };

  /**
   * Gets realted records
   */
  related = async (id, relatedType, params = {}, cache = true) => {
    if (!id || !relatedType) {
      return null;
    }

    const res = await this.axios.get(this.getRelatedPath(id, relatedType), {
      params,
      cache
    });
    return res.data;
  };

  /**
   * Gets the related path
   *
   * @param {String} id Id of the parth objectt
   * @param {String} path Path to the resource
   */
  getRelatedPath = (id, path) => {
    const relatedPath = `/${id}${this.options.relatedPathPrefix || ''}/${path}`;
    return relatedPath;
  };

  /**
   * Gets the count of records
   */
  count = async () => {
    const res = await this.axios.get('count');
    return res.data;
  };

  /**
   * Creates a reccord
   *
   * @param {Object} record Record to create
   */
  create = async (record) => {
    const res = await this.axios.post('', record);
    return res.data;
  };

  /**
   * Deletes a record
   *
   * @param {String} id Id of the record
   */
  delete = async (id) => {
    const res = await this.axios.delete(id);
    return res.data;
  };

  /**
   * Gets an index of records
   *
   * @param {Object} params Params to send
   * @param {Boolean} cache Whether or not to cache the query
   */
  index = async (params, cache = true) => {
    const res = await this.axios.get('', { params, cache });
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
    const res = await this.axios.get(id, { params, cache });
    return res.data;
  };

  /**
   * Updates a record by its id
   *
   * @param {String} id Id of the record
   * @param {Object} updates Data to update record with
   */
  update = async (id, updates) => {
    const res = await this.axios.put(id, updates);
    return res.data;
  };
}

export default ApiRoute;
