# name: lohnrechner-auth-redirect
# about: generates an authentication key and redirects the user to the lohnrechner
# version: 0.1
# authors: Amos Calamida
# url: https://github.com/tag-und-mann/discourse-lohnrechner/

after_initialize do

  require_dependency "application_controller"
  require_dependency "plugin_store"

  module ::Lohnrechner
    PLUGIN_NAME = "lohnrechner".freeze

    class Engine < ::Rails::Engine
      engine_name Lohnrechner::PLUGIN_NAME
      isolate_namespace Lohnrechner
    end
  end

  class Lohnrechner::Lohnrechner
    class << self

    

      def generateToken()
       "TestToken"
      end

     
    end
  end

  class Lohnrechner::LohnrechnerController < ::ApplicationController
    requires_plugin Lohnrechner::PLUGIN_NAME

    before_action :ensure_logged_in
    skip_before_action :check_xhr

    def redirect
      token = Lohnrechner::Lohnrechner.generateToken()

      render json: token
    end

  end


  Favorites::Engine.routes.draw do
    get "/"       => "lohnrechner#redirect"
  end

  Discourse::Application.routes.append do
    mount ::Favorites::Engine, at: "/lohnrechner"
  end

end
