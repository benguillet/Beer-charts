require 'sinatra'

set :views, File.dirname(__FILE__) + "/../views"

get '/' do
  haml :index
end
