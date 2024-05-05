class GenresController < ApplicationController
	skip_before_action :authenticate_user!, only: %i[index]
	
  def index
    @genres = Genre.select(:id, :name)

    render json: @genres
  end

  def show
  end

  def new
    @genre = Genre.new
  end

  def create
    @genre = Genre.new(instrument_params)
    
    if @genre.save
      render json: @genre, status: :created
    else
      render json: @genre.errors, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
  end

  def destroy
  end

  private

  def instrument_params
    params.require(:genre).permit(:name) # Permit only the 'name' parameter
  end
end
