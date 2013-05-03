require 'sinatra'

set :views, File.dirname(__FILE__) + "/../views"
set :public_folder, File.dirname(__FILE__) + '/../resources'

get '/' do
  haml :index
end
