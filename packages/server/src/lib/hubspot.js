import axios from 'axios';
import url from 'url';
import config from '@/config';

export class Hubspot {
  static axios = axios.create({
    baseURL: `https://api.hubapi.com`,
    adapter: this.axiosAdapter(axios.defaults.adapter)
  });

  /**
   * Adds a contact
   *
   * @param {Object} contact Contact to add
   */
  static async addContact(contact) {
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
  static axiosAdapter(axiosAdapter) {
    return async (axiosConfig) => {
      const _url = url.parse(axiosConfig.url);
      _url.query = _url.query || {};
      _url.query.hapikey = config?.hubspot?.apiKey;

      delete _url.search;
      axiosConfig.url = _url.format(_url);

      return axiosAdapter(axiosConfig);
    };
  }

  /**
   * Gets contact for an email address
   *
   * @param {String} email Email address to get contact for
   */
  static async getContactByEmail(email) {
    try {
      const result = await this.axios.get(
        `/contacts/v1/contact/email/${email}/profile`
      );
      return result.data;
    } catch (err) {
      console.log(err);
      if (err?.response?.status !== 404) {
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
  static async getDataForEmail(email, data) {
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

export default Hubspot;
