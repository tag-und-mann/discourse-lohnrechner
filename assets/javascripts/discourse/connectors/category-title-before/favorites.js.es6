import { ajax } from 'discourse/lib/ajax';
import lohnrechner from 'discourse/plugins/discourse-lohnrechner/lib/lohnrechner';

export default {

  isAdmin: "",

  setupComponent(args, component) {
    component.set('category', args.category);
    component.set('isAdmin', this.currentUser.admin)
    lohnrechner.isFavorite(args.category.id, isFavorite => {
      component.set('isFavorite', isFavorite);
      if (isFavorite) {
        Ember.$('tr[data-category-id="'+ args.category.id +'"]').addClass('green');
        Ember.$('tr[data-category-id="'+ args.category.id +'"] td').addClass('green');
      } else {
        Ember.$('tr[data-category-id="'+ args.category.id +'"]').removeClass('green');
        Ember.$('tr[data-category-id="'+ args.category.id +'"] td').removeClass('green');
      }
    });
  },

  actions: {
    toggleFavorite: function () {
      if (this.currentUser.admin ) {
        const category_id = this.get('category').id;
        const status = !this.get('isFavorite');
        this.set('isFavorite', status);

        if (status) {
          Ember.$('tr[data-category-id="'+ category_id +'"]').addClass('green');
          Ember.$('tr[data-category-id="'+ category_id +'"] td').addClass('green');
          lohnrechner.add(category_id);
        } else {
          Ember.$('tr[data-category-id="'+ category_id +'"]').removeClass('green');
          Ember.$('tr[data-category-id="'+ category_id +'"] td').removeClass('green');
          lohnrechner.remove(category_id);
        }
      }
    }
  }

};
