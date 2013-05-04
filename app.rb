require 'sinatra'
require 'haml'
require 'yaml'
require 'json'
require './src/tools.rb'
require './src/user.rb'

set :views, File.dirname(__FILE__) + "/views"
set :public_folder, File.dirname(__FILE__) + '/resources'

post '/' do
  user = User.new(params[:login], params[:mdp])
  if user.connected?
    data = user.getData(:all).to_json
    haml :index, :locals => { :logged => true, :data => data }
  else
    haml :index, :locals => { :logged => false, 
                              :error  => 'Connexion impossible' }
  end
end

get '/' do
  haml :index, :locals => { :logged => false }
end

not_found do  
  halt 404, 'page not found'  
end 
