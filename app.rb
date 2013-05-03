require 'sinatra'
require 'haml'
require 'yaml'
require './src/user.rb'

set :views, File.dirname(__FILE__) + "/views"
set :public_folder, File.dirname(__FILE__) + '/resources'

post '/' do
  user = User.new(params[:login], params[:mdp])
  if user.connected?
    data = user.getData(:all)
  else
    #TODO show error message
  end
end

get '/' do
  haml :index
end

not_found do  
  halt 404, 'page not found'  
end 
