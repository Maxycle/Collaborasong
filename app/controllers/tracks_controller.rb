class TracksController < ApplicationController
	skip_before_action :authenticate_user!, only: [:index, :show]

  def index
    @tracks = Track.order(created_at: :desc).where(parent_id: nil)
  
    if params[:instrument].present?
      @tracks = @tracks.joins(:instruments).where("instruments.name LIKE ?", "%#{params[:instrument]}%")
      if params[:genre].present? 
        @tracks = @tracks.joins(:genres).where("genres.name LIKE ?", "%#{params[:genre]}%")
      end
    elsif params[:genre].present?
      @tracks = @tracks.joins(:genres).where("genres.name LIKE ?", "%#{params[:genre]}%")
    end

    @tracks = @tracks.select(:id)
    render json: @tracks
  end  

  def index_results
    @parent_track = Track.find(params[:id])

    @children_tracks = @parent_track.child_tracks

    @children_tracks = @children_tracks.select(:id, :parent_id)
    render json: @children_tracks
  end

	def myTracks
    @tracks = Track.order(created_at: :desc).where(user_id: current_user.id)
    @tracks = @tracks.select(:id)

    render json: @tracks
	end

  def show
    @track = Track.find(params[:id])
		@genres = @track.genres.select(:id, :name)
    @instruments = @track.instruments.select(:id, :name)
    author = @track.user
		@author = {
			id: author.id,
			username: author.username,
			first_name: author.first_name,
			last_name: author.last_name
		}
		if current_user
			@isMyProject = @parent_track_user_id === current_user.id
		else
			@isMyProject = false
		end
    @result = !@track.parent_id.nil?
		@parent_track_user_id = @track.parent ? @track.parent.user.id : nil
		# @longitutde = @track.longitude
		# @latitude = @track.latitude
		@children = @track.child_tracks

    render json: {
      id: @track.id,
      title: @track.title,
      created_at: @track.created_at,
      updated_at: @track.updated_at,
      author: @author,
      genres: @genres,
      instruments: @instruments,
      isResult: @result,
			parent_track_user_id: @parent_track_user_id,
			isMyProject: @isMyProject,
			longitude: @longitutde,
			latitude: @latitude,
			children: @children,
			chat_id: @track.chat_id
    }
  end

  def new
    @track = Track.new
  end

  def create
    @track = Track.new(track_params)
		@track.user_id = current_user.id

    if @track.save
			params[:music_track][:instrument_ids].each do |instrument_id|
				instrument = Instrument.find_by(id: instrument_id)
				@track.instruments << instrument if instrument.present?
			end

			params[:music_track][:music_genre_ids].each do |genre_id|
				genre = Genre.find_by(id: genre_id)
				@track.genres << genre if genre.present?
			end
      render json: @track, status: :created
    else
      render json: @track.errors, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
		@track = Track.find(params[:id])

    if @track.update(track_params)
      render json: @track, status: :ok
    else
      render json: @track.errors, status: :unprocessable_entity
    end
  end

  def destroy
  end

  private

  def track_params
		params.require(:music_track).permit(:title, :parent_id, :longitude, :latitude, :chat_id)
	end
end
