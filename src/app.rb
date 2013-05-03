require 'sinatra'
require 'haml'

set :views, File.dirname(__FILE__) + "/../views"
set :public_folder, File.dirname(__FILE__) + '/../resources'

post '/' do
  @login = params[:login]
  @pass = params[:mdp]
end

get '/' do
  haml :index
end

not_found do  
  halt 404, 'page not found'  
end  
