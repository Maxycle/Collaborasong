class ChatroomsController < ApplicationController
	def index
    chatrooms = Chatroom.where('protagonists_ids @> ARRAY[?]::integer[]', current_user.id)
    render json: chatrooms, status: :ok
  end

  def create
    chatroom = Chatroom.new(chatroom_params)

    if chatroom.save
      render json: chatroom, status: :created
    else
      render json: chatroom.errors.full_messages, status: :unprocessable_entity
    end
  end

  private

  def set_chatroom
    @chatroom = Chatroom.find_by(id: params[:chatroom_id])
  end

  def chatroom_params
    params.require(:chatroom).permit(:name, :isAboutTrack, protagonists_ids: [])
  end
end
