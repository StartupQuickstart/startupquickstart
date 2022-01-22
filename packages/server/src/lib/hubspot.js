import axios from 'axios';
import url from 'url';
import {
  cacheAdapterEnhancer,
  throttleAdapterEnhancer
} from 'axios-extensions';
import AwsParamStore from '@/lib/aws/param-store';

class Hubspot {
  constructor() {
    this.axios = axios.create({
      baseURL: `https://api.hubapi.com`,
      adapter: this.axiosAdapter(
        throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter))
      )
    });
  }

  /**
   * Adds a contact
   *
   * @param {Object} contact Contact to add
   */
  async addContact(contact) {
    return await this.axios.post('/contacts/v1/contact/', {
      properties: Object.keys(contact).map((prop) => {
        return { property: prop, value: contact[prop] };
      }),
      json: true
    });
  }

  /**
   * Adapter to add auth auth to axios
   *
   * @param {Object} axiosAdapter AxiosAdapter
   */
  axiosAdapter(axiosAdapter) {
    return async (config) => {
      const _url = url.parse(config.url);
      _url.query = _url.query || {};
      _url.query.hapikey = await AwsParamStore.get('/shared/hubspot/hapi-key');

      delete _url.search;
      config.url = _url.format(_url);

      return axiosAdapter(config);
    };
  }

  /**
   * Gets contact for an email address
   *
   * @param {String} email Email address to get contact for
   */
  async getContactByEmail(email) {
    try {
      const result = await this.axios.get(
        `/contacts/v1/contact/email/${email}/profile`
      );
      return result.data;
    } catch (err) {
      if (err.response.status !== 404) {
        console.log(err);
      }

      return null;
    }
  }

  /**
   * Gets data for an email address
   *
   * @param {String} email Email address to get data for
   * @param {Object} data Data to use if doesnt exist in hubspot
   */
  async getDataForEmail(email, data) {
    try {
      let contact = await this.getContactByEmail(email);

      if (!contact && data) {
        contact = await this.addContact({
          email,
          firstname: data.first_name,
          lastname: data.last_name,
          website: data.website,
          company: data.account ? data.account.name : null,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip
        });
      }

      return { contact };
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

export default new Hubspot();
