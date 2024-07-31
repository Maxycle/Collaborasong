require_relative "boot"
require "rails/all"

Bundler.require(*Rails.groups)

module Collaborasong
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Set the session store to use cookie_store with a specific key
    config.session_store :cookie_store, key: 'collabo_session'

    # Ensure the middleware for session, flash, and cookies are loaded
    # config.middleware.use ActionDispatch::Cookies
    # config.middleware.use ActionDispatch::Session::CookieStore
		config.secret_key_base = Rails.application.credentials[:secret_key_base]
		# config.secret_key_base = 'e8a3a9202b6db2e7fd077652b945397fa5bcd38055f941d3ed344d19bc3df190618800ea9aa3d7a6deaea4c6aef69be67345ed6fcdbc8ddf19df9e4f17a1cb27'
    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true
  end
end
