# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
# In your Rails console
require 'faker'

# Creating fake users
5.times do
	unique_username = nil

  # Keep generating a genre until a non-empty, non-nil name is obtained
  while unique_username.nil? || User.exists?(username: unique_username)
    unique_username = Faker::Food.vegetables
  end
  User.create(
    first_name: Faker::Name.first_name,
		last_name: Faker::Name.last_name,
		username: unique_username,
    email: Faker::Internet.email,
    password: '123456789'
  )
end

10.times do
  unique_genre = nil

  # Keep generating a genre until a non-empty, non-nil name is obtained
  while unique_genre.nil? || Genre.exists?(name: unique_genre)
    unique_genre = Faker::Music.genre
  end

  Genre.create(name: unique_genre)

end

10.times do
  unique_instrument = nil
  while unique_instrument.nil? || Instrument.exists?(name: unique_instrument)
    unique_instrument = Faker::Music.instrument
  end

  Instrument.create(name: unique_instrument)
end

15.times do
  music_genre_ids = Genre.pluck(:id).sample(rand(1..4))
  instrument_ids = Instrument.pluck(:id).sample(rand(1..4))

  music_track = Track.create(
    title: Faker::Lorem.words(number: 3).join(' '),
    user_id: User.pluck(:id).sample
  )

  music_genre_ids.each do |genre_id|
    music_track.genres << Genre.find(genre_id)
  end

  instrument_ids.each do |instrument_id|
    music_track.instruments << Instrument.find(instrument_id)
  end
end

parent_track = Track.find(3)
child_tracks_ids = [7, 9, 14]

child_tracks_ids.each do |child_id|
	child_track = Track.find(child_id)
	child_track.update(parent_id: parent_track.id)
end
