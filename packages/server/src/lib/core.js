import models from '@/api/models';

export class Core {
  static features = {};

  static get featureNames() {
    return Object.keys(this.features);
  }

  /**
   * Registers a feature with the app
   *
   * @param {String} name Name of the feature
   * @param {String} label Label of the feature
   * @param {String} description Description of the feature
   * @param {Boolean} defaultEnabled Whether or not the feature should be enabled by default
   */
  static async registerFeature(
    name,
    label,
    description,
    defaultEnabled = true
  ) {
    const isValid = name && /^[a-z_]+$/.test(name);

    if (!isValid) {
      throw new Error(`${name} is not a valid feature name`);
    }

    if (this.features[name]) {
      throw new Error(`${name} has already been registered`);
    }

    this.features[name] = { name, label, description, defaultEnabled };

    const feature =
      (await models.SystemSetting.findOne({
        where: { type: 'feature', name }
      })) ||
      new models.SystemSetting({
        type: 'feature',
        name,
        value: { enabled: defaultEnabled }
      });

    const value = feature.value;

    value.name = name;
    value.label = label;
    value.description = description;
    feature.value = value;

    await feature.save();

    return feature;
  }
}

export default Core;
