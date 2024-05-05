class InstrumentsController < ApplicationController
	skip_before_action :authenticate_user!, only: %i[index]
	
  def index
    @instruments = Instrument.select(:id, :name)

    render json: @instruments
  end

  def show
  end

  def new
    @instrument = Instrument.new
  end

  def create
    @instrument = Instrument.new(instrument_params)
    
    if @instrument.save
      render json: @instrument, status: :created
    else
      render json: @instrument.errors, status: :unprocessable_entity
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
    params.require(:instrument).permit(:name) # Permit only the 'name' parameter
  end
end
