require 'sinatra'
require 'haml'
require 'yaml'
require './src/tools.rb'

set :views, File.dirname(__FILE__) + "/views"
set :public_folder, File.dirname(__FILE__) + '/resources'

post '/' do
  @login = params[:login]
  @pass = params[:mdp]
  conf_ae = Tools::load_config("ae")
end

get '/' do
  haml :index
end

not_found do  
  halt 404, 'page not found'  
end 
