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
		@audio_file_attached = @track.audio_file_attached?
		@author = {
			id: author.id,
			username: author.username,
			first_name: author.first_name,
			last_name: author.last_name
		}
		@parent_track_user_id = @track.parent ? @track.parent.user.id : nil

    @result = !@track.parent_id.nil?
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
			longitude: @longitutde,
			latitude: @latitude,
			children: @children,
			chat_id: @track.chat_id,
			audio_file_url: @track.audio_file.attached? ? url_for(@track.audio_file) : nil,
			audio_file_attached: @audio_file_attached
		}
  end

  def new
    @track = Track.new
  end

  def create
		music_track_params = track_params
  	music_track_params[:audio_file] = nil if music_track_params[:audio_file] == "null"

    @track = Track.new(music_track_params)
		@track.user_id = current_user.id

    if @track.save
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
	rescue => e
		Rails.logger.error("Error creating track: #{e.message}")
		Rails.logger.error(e.backtrace.join("\n"))
		render json: { error: 'Internal Server Error' }, status: :internal_server_error
  end

  def destroy
  end

  private

  def track_params
		params.require(:music_track).permit(:title, :audio_file, :parent_id, :longitude, :latitude, :chat_id, instrument_ids: [], genre_ids: [])
	end
end
