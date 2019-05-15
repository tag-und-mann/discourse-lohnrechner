import { ajax } from 'discourse/lib/ajax';

const UNINITIALIZED = 0;
const LOADING = 1;
const LOADED = 2;

export default {

  /**
   * Array of favorite category IDs.
   *
   * @type {Set}
   */
  lohnrechner: [],

  /**
   * State of lohnrechner loading.
   *
   * @type {Integer}
   */
  state: UNINITIALIZED,

  /**
   * Queue of callbacks waiting for get().
   * This queue has elements [categoryId, callback(isFavorite)].
   *
   * @type {Array}
   */
  callbacks: [],

  /**
   * Fires all waiting callbacks.
   */
  _fireCallbacks() {
    while (this.callbacks.length > 0) {
      let [categoryId, callback] = this.callbacks.pop();
      if (categoryId !== undefined) {
        callback(this.lohnrechner.has(categoryId));
      } else {
        callback(Array.from(this.lohnrechner));
      }
    }
  },

  /**
   * Constructs the lohnrechner Set from the JSON response.
   *
   * @param {Array} lohnrechner
   */
  _setLohnrechner(lohnrechner) {
    this.lohnrechner = new Set(lohnrechner.map(num => parseInt(num)));
    this.state = LOADED;
    this._fireCallbacks();
  },

  /**
   * Gets the favorite categories from the server and then fires callbacks.
   *
   * If lohnrechner were already fetched, the callbacks will be immediately
   * fired. If lohnrechner are already loading, this does nothing.
   */
  _getLohnrechner() {

    // If lohnrechner are already loaded fire waiting callbacks.
    if (this.state === LOADED) {
      this._fireCallbacks();
    }

    // If lohnrechner are loading or were loaded, do not fetch them again.
    if (this.state !== UNINITIALIZED) {
      return;
    }

    // Load the lohnrechner and then execute all callbacks in queue or try again
    // in the future.
    this.state = LOADING;
    ajax("/lohnrechner/get").then(result => {
      this._setLohnrechner(result.lohnrechner);
    }).catch((err) => {
      console.log("Error loading favorite categories.", err);
      this.state = UNINITIALIZED;
    });
  },

  /**
   * Sets the favorite categories list.
   *
   * @param {Array} categoryIds Array of category IDs.
   */
  set(categoryIds) {
    return ajax("/lohnrechner/set", {
      type: "PUT",
      data: {
        category_ids: categoryIds
      }
    }).then(result => {
      this._setLohnrechner(result.lohnrechner);
    }).catch((err) => {
      console.log("Error setting favorite category.", err);
    });
  },

  /**
   * Adds a new category to the favorite categories.
   *
   * @param {Integer} categoryId Category ID.
   */
  add(categoryId) {
    return ajax("/lohnrechner/add", {
      type: "PUT",
      data: {
        category_id: categoryId
      }
    }).then(result => {
      this._setLohnrechner(result.lohnrechner);
    }).catch((err) => {
      console.log("Error adding favorite category.", err);
    });
  },

  /**
   * Removes a category from the favorite categories.
   *
   * @param {Integer} categoryId Category ID.
   */
  remove(categoryId) {
    return ajax("/lohnrechner/remove", {
      type: "PUT",
      data: {
        category_id: categoryId
      }
    }).then(result => {
      this._setLohnrechner(result.lohnrechner);
    }).catch((err) => {
      console.log("Error removing favorite category.", err);
    });
  },

  /**
   * Gets all favorite categories.
   *
   * @param  {Function} callback Callback to be called as soon as result is
   *                             available.
   */
  get(callback) {
    this.callbacks.push([undefined, callback]);
    this._getLohnrechner();
  },

  /**
   * Checks if a category is a favorite and calls the given callback.
   *
   * This function may call get() to retrieve the set of favorite categories.
   *
   * @param  {Integer}  categoryId Category ID.
   * @param  {Function} callback   Callback to be called as soon as result is
   *                               available.
   */
  isFavorite(categoryId, callback) {
    this.callbacks.push([categoryId, callback]);
    this._getLohnrechner();
  },
};
