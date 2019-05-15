import buildTopicRoute from 'discourse/routes/build-topic-route';
import lohnrechner from 'discourse/plugins/discourse-lohnrechner/lib/lohnrechner';
import { default as computed } from 'ember-addons/ember-computed-decorators';

function buildLohnrechnerRoute(filter) {
  return buildTopicRoute('lohnrechner/' + filter, {
    beforeModel() {
      this.controllerFor('navigation/default').set('filterMode', filter);
    }
  });
}

export default {
  name: "lohnrechner-routes",

  initialize(container) {

    /**
     * This feature is available only to logged users.
     */
    const currentUser = container.lookup('current-user:main');
    if (!currentUser) {
      return;
    }

       /**
     * Create controllers for lohnrechner.
     */
    Discourse[`DiscoverylohnrechnerController`] = DiscoverySortableController.extend();
    Discourse[`DiscoverylohnrechnerRoute`] = buildLohnrechnerRoute('latest');

    Discourse.Site.current().get('filters').forEach(filter => {
      const filterCapitalized = filter.capitalize();
      Discourse[`Discovery${filterCapitalized}lohnrechnerController`] = DiscoverySortableController.extend();
      Discourse[`Discovery${filterCapitalized}lohnrechnerRoute`] = buildLohnrechnerRoute(filter);
    });


    /**
     * Overwrite filter URLs from the navigation bar.
     */
    customNavItemHref(function(navItem) {
      if (!String.prototype.startsWith) {
        String.prototype.startsWith = function(searchString, position){
          position = position || 0;
          return this.substr(position, searchString.length) === searchString;
        };
      }
      
      if (['latest', 'new', 'unread'].includes(navItem.get('name')) && container.lookup('router:main').get('currentURL').startsWith('/lohnrechner/')) {
        return '/lohnrechner/' + navItem.get('name');
      }
      return null;
    });
  }
};
