import lohnrechner from 'discourse/plugins/discourse-lohnrechner/lib/lohnrechner';
import Category from 'discourse/models/category';

export default {

  setupComponent(args, component) {
    lohnrechner.get(function (categoryIds) {
      component.set('selectedCategories', Category.findByIds(categoryIds));
      component.addObserver('selectedCategories', function() {
        lohnrechner.set(component.get('selectedCategories').map(category => category.id));
      });
    });
  },

};
