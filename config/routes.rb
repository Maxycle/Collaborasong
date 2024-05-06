Rails.application.routes.draw do
	devise_for :users, path: '', path_names: {
    sign_in: 'login',
    sign_out: 'logout',
    registration: 'signup'
  },
  controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }

	resources :chatrooms, only: %i[index] do
    resources :messages, only: %i[index create]
  end
	resources :tracks
  resources :instruments, only: [:index, :new, :create]
  resources :genres, only: [:index, :new, :create]
	root 'tracks#index'
  get '/index_results/:id', to: 'tracks#index_results', as: 'index_results'
	get '/my_tracks', to: 'tracks#myTracks', as: 'myTracks'
	get "/member-data", to: "members#show"
	get "*path", to: "static#index", constraints: proc { |request| !request.xhr? && request.format.html? }
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
