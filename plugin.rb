# name: lohnrechner-auth-redirect
# about: generates an authentication key and redirects the user to the lohnrechner
# version: 0.1
# authors: Amos Calamida
# url: https://github.com/tag-und-mann/discourse-lohnrechner/

after_initialize do

  require_dependency "application_controller"
  require_dependency "plugin_store"
  require "base64"

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
         time = Time.now.to_i.to_s
         time_token = Base64::strict_encode64(Base64::strict_encode64(time)+(Date.today).strftime('%y'))

         referral = "docdoc"
         referral_token = Digest::MD5.hexdigest(referral+time_token)

         separator = "|"

         token = time_token+separator+referral_token

      end

     
    end
  end

  class Lohnrechner::LohnrechnerController < ::ApplicationController
    requires_plugin Lohnrechner::PLUGIN_NAME

    before_action :ensure_logged_in
    skip_before_action :check_xhr

    def redirect
      token = Lohnrechner::Lohnrechner.generateToken()
      url = "https://www.vsao-zh.ch/lohnrechner/?token="+token
      redirect_to url
    end

  end


  Lohnrechner::Engine.routes.draw do
    get "/"       => "lohnrechner#redirect"
  end

  Discourse::Application.routes.append do
    mount ::Lohnrechner::Engine, at: "/lohnrechner"
  end

end
